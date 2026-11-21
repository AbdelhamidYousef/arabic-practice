import { and, asc, eq, isNull, sql } from 'drizzle-orm';

import { db, type Tx } from '../../db/client.ts';
import {
  conversations,
  corrections,
  lessons,
  lessonVocab,
  messages,
  mistakes,
} from '../../db/schema/index.ts';
import type { LevelMetrics } from '../../db/schema/messages.ts';

function first<T>(rows: T[], what: string): T {
  const row = rows[0];
  if (!row) throw new Error(`${what}: the statement returned no row`);
  return row;
}

// Ownership lives in the WHERE clause: someone else's conversation is simply "not found".
export async function findOwnedConversation(userId: string, conversationId: string) {
  const [row] = await db
    .select({ conversation: conversations, lesson: lessons })
    .from(conversations)
    .innerJoin(lessons, eq(lessons.id, conversations.lessonId))
    .where(and(eq(conversations.id, conversationId), eq(conversations.userId, userId)));
  return row;
}

export async function listMessages(conversationId: string) {
  // id as a tie-break only keeps the order stable if two rows ever share a timestamp.
  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt), asc(messages.id));
}

export async function listVocab(lessonId: string) {
  return db
    .select({ arabic: lessonVocab.arabic, english: lessonVocab.english })
    .from(lessonVocab)
    .where(eq(lessonVocab.lessonId, lessonId))
    .orderBy(asc(lessonVocab.position));
}

export async function listCorrections(conversationId: string) {
  const rows = await db
    .select({ correction: corrections })
    .from(corrections)
    .innerJoin(messages, eq(messages.id, corrections.messageId))
    .where(eq(messages.conversationId, conversationId));
  const correctionRows = rows.map((r) => r.correction);
  if (correctionRows.length === 0) return { correctionRows, mistakeRows: [] };
  const mistakeRows = await db
    .select({ mistake: mistakes })
    .from(mistakes)
    .innerJoin(corrections, eq(corrections.id, mistakes.correctionId))
    .innerJoin(messages, eq(messages.id, corrections.messageId))
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(mistakes.createdAt), asc(mistakes.id));
  return { correctionRows, mistakeRows: mistakeRows.map((r) => r.mistake) };
}

export async function createConversationWithOpening(
  userId: string,
  lessonId: string,
  openingLine: string,
) {
  return db.transaction(async (tx) => {
    const conversation = first(
      await tx.insert(conversations).values({ userId, lessonId }).returning(),
      'conversation',
    );
    const opening = first(
      await tx
        .insert(messages)
        .values({ conversationId: conversation.id, role: 'partner', text: openingLine })
        .returning(),
      'opening message',
    );
    return { conversation, opening };
  });
}

// A learner message counts as a turn the moment it is saved, even if the reply later fails:
// `turn_count` is "learner messages sent", and the message stays in the history.
export async function saveLearnerMessage(conversationId: string, text: string) {
  return db.transaction(async (tx) => {
    const message = first(
      await tx.insert(messages).values({ conversationId, role: 'learner', text }).returning(),
      'learner message',
    );
    await tx
      .update(conversations)
      .set({ turnCount: sql`${conversations.turnCount} + 1`, lastMessageAt: sql`now()` })
      .where(eq(conversations.id, conversationId));
    return message;
  });
}

export async function savePartnerMessage(
  conversationId: string,
  text: string,
  levelMetrics: LevelMetrics,
) {
  return db.transaction(async (tx) => {
    const message = first(
      await tx
        .insert(messages)
        .values({ conversationId, role: 'partner', text, levelMetrics })
        .returning(),
      'partner message',
    );
    await tx
      .update(conversations)
      .set({ lastMessageAt: sql`now()` })
      .where(eq(conversations.id, conversationId));
    return message;
  });
}

export interface CorrectionInput {
  messageId: string;
  userId: string;
  lessonId: string;
  isCorrect: boolean;
  corrected: string;
  praise: string | undefined;
  mistakes: {
    type: (typeof mistakes.$inferInsert)['type'];
    original: string;
    correction: string;
    explanation: string;
  }[];
}

// The correction and all its mistakes land together or not at all, so progress counts never see a
// correction without its mistakes. `message_id` is unique, so a retried call cannot add a second one.
export async function saveCorrection(input: CorrectionInput) {
  return db.transaction(async (tx: Tx) => {
    const correction = first(
      await tx
        .insert(corrections)
        .values({
          messageId: input.messageId,
          isCorrect: input.isCorrect,
          corrected: input.corrected,
          praise: input.praise ?? null,
        })
        .returning(),
      'correction',
    );
    const mistakeRows =
      input.mistakes.length === 0
        ? []
        : await tx
            .insert(mistakes)
            .values(
              input.mistakes.map((m) => ({
                ...m,
                correctionId: correction.id,
                userId: input.userId,
                lessonId: input.lessonId,
              })),
            )
            .returning();
    return { correction, mistakeRows };
  });
}

export async function findOwnedPartnerMessage(userId: string, messageId: string) {
  const [row] = await db
    .select({ message: messages, conversationId: conversations.id })
    .from(messages)
    .innerJoin(conversations, eq(conversations.id, messages.conversationId))
    .where(
      and(
        eq(messages.id, messageId),
        eq(messages.role, 'partner'),
        eq(conversations.userId, userId),
      ),
    );
  return row;
}

// First write wins: two simultaneous requests cannot overwrite each other's translation.
export async function saveGloss(messageId: string, glossEn: string) {
  const [row] = await db
    .update(messages)
    .set({ glossEn })
    .where(and(eq(messages.id, messageId), isNull(messages.glossEn)))
    .returning({ glossEn: messages.glossEn });
  return row?.glossEn ?? null;
}

export async function findVisiblePublishedLesson(teacherId: string, lessonId: string) {
  const [row] = await db
    .select()
    .from(lessons)
    .where(
      and(
        eq(lessons.id, lessonId),
        eq(lessons.teacherId, teacherId),
        eq(lessons.status, 'published'),
      ),
    );
  return row;
}
