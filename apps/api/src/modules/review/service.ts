import type { ReviewAnswerResponse, ReviewDueResponse } from '@arabic/shared';
import { and, asc, count, eq, lte, sql } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import { lessons, lessonVocab, vocabCards } from '../../db/schema/index.ts';
import { notFound } from '../../lib/errors.ts';
import type { AuthUser } from '../auth/sessions.ts';

import { reviewCard } from './leitner.ts';

const DUE_LIMIT = 20;

// One statement, idempotent: a card is created (box 1, due now) for every word of every lesson the
// learner has at least one conversation in. The primary key (user, vocab) plus DO NOTHING means
// two parallel calls, or a second visit, cannot duplicate or reset a card.
async function createMissingCards(userId: string): Promise<void> {
  await db.execute(sql`
    insert into vocab_cards (user_id, vocab_id)
    select ${userId}::uuid, v.id
    from lesson_vocab v
    where v.lesson_id in (select c.lesson_id from conversations c where c.user_id = ${userId}::uuid)
    on conflict do nothing
  `);
}

// The same idempotent insert for one lesson's words: finishing a lesson's practice puts them into
// the learner's review deck without a conversation.
export async function createCardsForLesson(userId: string, lessonId: string): Promise<void> {
  await db.execute(sql`
    insert into vocab_cards (user_id, vocab_id)
    select ${userId}::uuid, v.id
    from lesson_vocab v
    where v.lesson_id = ${lessonId}::uuid
    on conflict do nothing
  `);
}

export async function getDueCards(user: AuthUser): Promise<ReviewDueResponse> {
  // The read-only demo account only looks: reading must not write rows for it.
  if (!user.readOnly) await createMissingCards(user.id);
  // Read after the insert: new cards are due at the database's now(), which is later than a clock
  // value taken before the insert ran.
  const now = new Date();
  const due = and(eq(vocabCards.userId, user.id), lte(vocabCards.dueAt, now));

  const [rows, [total]] = await Promise.all([
    db
      .select({
        vocabId: vocabCards.vocabId,
        arabic: lessonVocab.arabic,
        english: lessonVocab.english,
        note: lessonVocab.note,
        lessonTitle: lessons.title,
        box: vocabCards.box,
        dueAt: vocabCards.dueAt,
      })
      .from(vocabCards)
      .innerJoin(lessonVocab, eq(lessonVocab.id, vocabCards.vocabId))
      .innerJoin(lessons, eq(lessons.id, lessonVocab.lessonId))
      .where(due)
      .orderBy(asc(vocabCards.dueAt), asc(lessonVocab.position), asc(vocabCards.vocabId))
      .limit(DUE_LIMIT),
    db.select({ n: count() }).from(vocabCards).where(due),
  ]);

  return {
    cards: rows.map((r) => ({ ...r, dueAt: r.dueAt.toISOString() })),
    totalDue: total?.n ?? 0,
  };
}

export async function answerCard(
  user: AuthUser,
  vocabId: string,
  correct: boolean,
  now = new Date(),
): Promise<ReviewAnswerResponse> {
  return db.transaction(async (tx) => {
    // FOR UPDATE: two quick taps on the same card must not both read box 2 and both write box 3.
    const [card] = await tx
      .select()
      .from(vocabCards)
      .where(and(eq(vocabCards.userId, user.id), eq(vocabCards.vocabId, vocabId)))
      .for('update');
    if (!card) throw notFound('Card not found');

    const next = reviewCard(card, correct, now);
    await tx
      .update(vocabCards)
      .set(next)
      .where(and(eq(vocabCards.userId, user.id), eq(vocabCards.vocabId, vocabId)));
    return {
      vocabId,
      box: next.box,
      dueAt: next.dueAt.toISOString(),
      reviews: next.reviews,
      lapses: next.lapses,
    };
  });
}
