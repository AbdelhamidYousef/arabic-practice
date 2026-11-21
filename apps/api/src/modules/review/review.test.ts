import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { vocabCards } from '../../db/schema/index.ts';
import { makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import {
  createCard,
  createConversation,
  createLesson,
  createTeacher,
  createVocab,
} from '../../test/factories.ts';
import { bodyOf, errorOf } from '../../test/http.ts';

const { get, post } = api(makeTestApp());

interface DueBody {
  cards: { vocabId: string; arabic: string; english: string; lessonTitle: string; box: number }[];
  totalDue: number;
}
interface AnswerBody {
  vocabId: string;
  box: number;
  dueAt: string;
  reviews: number;
  lapses: number;
}

const hoursFromNow = (h: number) => new Date(Date.now() + h * 3600 * 1000);

async function practised(vocabCount = 2) {
  const teacher = await createTeacher();
  const learner = await signedIn({ teacherId: teacher.id });
  const lesson = await createLesson({ teacherId: teacher.id, title: 'At the bakery' });
  const vocab = [];
  for (let i = 0; i < vocabCount; i++) {
    vocab.push(await createVocab(lesson.id, { position: i, english: `word ${i}` }));
  }
  await createConversation({ userId: learner.user.id, lessonId: lesson.id });
  return { teacher, learner, lesson, vocab };
}

describe('GET /review/due', () => {
  it('requires a session', async () => {
    const res = await get('/review/due');
    expect(res.status).toBe(401);
    expect(errorOf(res).code).toBe('UNAUTHENTICATED');
  });

  it('creates box 1 cards for the vocab of a practised lesson and returns them due now', async () => {
    const { learner, vocab } = await practised(3);
    const body = bodyOf<DueBody>(await get('/review/due', learner.cookie));
    expect(body.totalDue).toBe(3);
    expect(body.cards.map((c) => c.vocabId).sort()).toEqual(vocab.map((v) => v.id).sort());
    expect(body.cards.every((c) => c.box === 1 && c.lessonTitle === 'At the bakery')).toBe(true);
    expect(body.cards[0]).toMatchObject({ arabic: 'كِتَابٌ' });
  });

  it('creates no cards for lessons the learner has not practised and does not reset existing ones', async () => {
    const { teacher, learner, vocab } = await practised(1);
    const other = await createLesson({ teacherId: teacher.id });
    await createVocab(other.id);
    const first = vocab[0];
    if (!first) throw new Error('missing vocab');
    await createCard(learner.user.id, first.id, { box: 3, dueAt: hoursFromNow(-1) });

    const body = bodyOf<DueBody>(await get('/review/due', learner.cookie));
    expect(body.cards).toHaveLength(1);
    expect(body.cards[0]?.box).toBe(3);
    const rows = await db.select().from(vocabCards).where(eq(vocabCards.userId, learner.user.id));
    expect(rows).toHaveLength(1);
  });

  it('leaves cards that are not due yet out, and orders the due ones by due date', async () => {
    const { learner, vocab } = await practised(3);
    const [a, b, c] = vocab;
    if (!a || !b || !c) throw new Error('missing vocab');
    await createCard(learner.user.id, a.id, { dueAt: hoursFromNow(-1) });
    await createCard(learner.user.id, b.id, { dueAt: hoursFromNow(-5) });
    await createCard(learner.user.id, c.id, { dueAt: hoursFromNow(48) });

    const body = bodyOf<DueBody>(await get('/review/due', learner.cookie));
    expect(body.cards.map((x) => x.vocabId)).toEqual([b.id, a.id]);
    expect(body.totalDue).toBe(2);
  });

  it('returns at most 20 cards but reports how many are due in total', async () => {
    const { learner } = await practised(23);
    const body = bodyOf<DueBody>(await get('/review/due', learner.cookie));
    expect(body.cards).toHaveLength(20);
    expect(body.totalDue).toBe(23);
  });

  it('is empty for a learner with no conversations', async () => {
    const teacher = await createTeacher();
    const learner = await signedIn({ teacherId: teacher.id });
    const body = bodyOf<DueBody>(await get('/review/due', learner.cookie));
    expect(body).toEqual({ cards: [], totalDue: 0 });
  });

  it("never shows another learner's cards", async () => {
    const { teacher, vocab } = await practised(1);
    const stranger = await signedIn({ teacherId: teacher.id });
    const body = bodyOf<DueBody>(await get('/review/due', stranger.cookie));
    expect(body.cards).toEqual([]);
    expect(vocab).toHaveLength(1);
  });
});

describe('POST /review/:vocabId', () => {
  async function dueCard(box = 1) {
    const ctx = await practised(1);
    const vocabId = ctx.vocab[0]?.id;
    if (!vocabId) throw new Error('missing vocab');
    await createCard(ctx.learner.user.id, vocabId, { box });
    return { ...ctx, vocabId };
  }

  it('requires a session', async () => {
    const res = await post('/review/00000000-0000-4000-8000-000000000000', { correct: true });
    expect(res.status).toBe(401);
  });

  it('moves a right answer up a box and schedules by the new box interval', async () => {
    const { learner, vocabId } = await dueCard(2);
    const res = await post(`/review/${vocabId}`, { correct: true }, learner.cookie);
    expect(res.status).toBe(200);
    const body = bodyOf<AnswerBody>(res);
    expect(body).toMatchObject({ vocabId, box: 3, reviews: 1, lapses: 0 });
    const days = (Date.parse(body.dueAt) - Date.now()) / (24 * 3600 * 1000);
    expect(days).toBeGreaterThan(3.99);
    expect(days).toBeLessThan(4.01);
  });

  it('sends a wrong answer back to box 1 and counts a lapse', async () => {
    const { learner, vocabId } = await dueCard(4);
    const body = bodyOf<AnswerBody>(
      await post(`/review/${vocabId}`, { correct: false }, learner.cookie),
    );
    expect(body).toMatchObject({ box: 1, reviews: 1, lapses: 1 });
    const [row] = await db.select().from(vocabCards).where(eq(vocabCards.vocabId, vocabId));
    expect(row).toMatchObject({ box: 1, lapses: 1 });
    expect(row?.lastReviewedAt).not.toBeNull();
  });

  it("answers 404 for a card that is not the learner's, and changes nothing", async () => {
    const { teacher, vocabId } = await dueCard(2);
    const stranger = await signedIn({ teacherId: teacher.id });
    const res = await post(`/review/${vocabId}`, { correct: true }, stranger.cookie);
    expect(res.status).toBe(404);
    expect(errorOf(res).code).toBe('NOT_FOUND');
    const [row] = await db.select().from(vocabCards).where(eq(vocabCards.vocabId, vocabId));
    expect(row?.box).toBe(2);
  });

  it('answers 404 for a word with no card yet', async () => {
    const { learner, lesson } = await practised(0);
    const word = await createVocab(lesson.id);
    const res = await post(`/review/${word.id}`, { correct: true }, learner.cookie);
    expect(res.status).toBe(404);
  });

  it('rejects a malformed id and a body without a boolean', async () => {
    const { learner, vocabId } = await dueCard();
    expect((await post('/review/not-a-uuid', { correct: true }, learner.cookie)).status).toBe(400);
    expect((await post(`/review/${vocabId}`, {}, learner.cookie)).status).toBe(400);
    expect((await post(`/review/${vocabId}`, { correct: 'yes' }, learner.cookie)).status).toBe(400);
  });
});

describe('read-only accounts', () => {
  it('may read the due list but it creates no cards, and answering is refused with 403', async () => {
    const teacher = await createTeacher();
    const viewer = await signedIn({ teacherId: teacher.id, readOnly: true });
    const lesson = await createLesson({ teacherId: teacher.id });
    const word = await createVocab(lesson.id, { position: 0 });
    await createConversation({ userId: viewer.user.id, lessonId: lesson.id });

    const due = await get('/review/due', viewer.cookie);
    expect(due.status).toBe(200);
    expect(bodyOf<DueBody>(due)).toEqual({ cards: [], totalDue: 0 });
    expect(await db.select().from(vocabCards)).toHaveLength(0);

    await createCard(viewer.user.id, word.id);
    const answer = await post(`/review/${word.id}`, { correct: true }, viewer.cookie);
    expect(answer.status).toBe(403);
    expect(errorOf(answer).code).toBe('DEMO_READ_ONLY');
    const [card] = await db.select().from(vocabCards).where(eq(vocabCards.vocabId, word.id));
    expect(card).toMatchObject({ box: 1, reviews: 0 });
  });
});
