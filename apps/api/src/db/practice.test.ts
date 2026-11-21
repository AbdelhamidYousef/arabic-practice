import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import {
  createConversation,
  createLesson,
  createMessage,
  createUser,
  createVocab,
} from '../test/factories.ts';

import { db } from './client.ts';
import {
  aiCalls,
  conversations,
  corrections,
  messages,
  mistakes,
  users,
  vocabCards,
} from './schema/index.ts';

async function correctedMessage() {
  const conversation = await createConversation();
  const message = await createMessage(conversation.id);
  const [correction] = await db
    .insert(corrections)
    .values({ messageId: message.id, isCorrect: false, corrected: 'أَنَا طَالِبٌ.' })
    .returning();
  if (!correction) throw new Error('no correction');
  return { conversation, message, correction };
}

describe('conversations and messages', () => {
  it('starts a conversation at zero turns and stores partner metrics as json', async () => {
    const conversation = await createConversation();
    expect(conversation.turnCount).toBe(0);
    const metrics = {
      words: 6,
      sentences: 1,
      longestSentence: 6,
      harakatRatio: 0.7,
      lessonVocabHits: 2,
      latinChars: 0,
    };
    const message = await createMessage(conversation.id, {
      role: 'partner',
      levelMetrics: metrics,
    });
    const [stored] = await db.select().from(messages).where(eq(messages.id, message.id));
    expect(stored?.levelMetrics).toEqual(metrics);
    expect(stored?.glossEn).toBeNull();
  });

  it('rejects an unknown message role', async () => {
    const conversation = await createConversation();
    await expect(
      createMessage(conversation.id, { role: 'teacher' as 'learner' }),
    ).rejects.toThrow();
  });

  it('removes messages, corrections and mistakes with the conversation', async () => {
    const { conversation, correction } = await correctedMessage();
    await db.insert(mistakes).values({
      correctionId: correction.id,
      userId: conversation.userId,
      lessonId: conversation.lessonId,
      type: 'harakat',
      original: 'طالب',
      correction: 'طَالِبٌ',
      explanation: 'The case ending was missing.',
    });
    await db.delete(conversations).where(eq(conversations.id, conversation.id));
    expect(await db.select().from(messages)).toEqual([]);
    expect(await db.select().from(corrections)).toEqual([]);
    expect(await db.select().from(mistakes)).toEqual([]);
  });
});

describe('corrections and mistakes', () => {
  it('allows one correction per message', async () => {
    const { message } = await correctedMessage();
    await expect(
      db.insert(corrections).values({ messageId: message.id, isCorrect: true, corrected: 'x' }),
    ).rejects.toThrow();
  });

  it('rejects an unknown mistake type', async () => {
    const { conversation, correction } = await correctedMessage();
    await expect(
      db.insert(mistakes).values({
        correctionId: correction.id,
        userId: conversation.userId,
        lessonId: conversation.lessonId,
        type: 'pronunciation' as 'grammar',
        original: 'a',
        correction: 'b',
        explanation: 'c',
      }),
    ).rejects.toThrow();
  });

  it('removes a learner`s mistakes when the learner is deleted', async () => {
    const { conversation, correction } = await correctedMessage();
    await db.insert(mistakes).values({
      correctionId: correction.id,
      userId: conversation.userId,
      lessonId: conversation.lessonId,
      type: 'grammar',
      original: 'a',
      correction: 'b',
      explanation: 'c',
    });
    await db.delete(users).where(eq(users.id, conversation.userId));
    expect(await db.select().from(mistakes)).toEqual([]);
  });
});

describe('vocab cards', () => {
  async function card(box?: number) {
    const user = await createUser();
    const vocab = await createVocab((await createLesson()).id);
    return db
      .insert(vocabCards)
      .values({ userId: user.id, vocabId: vocab.id, ...(box === undefined ? {} : { box }) })
      .returning();
  }

  it('starts in box 1 with no reviews', async () => {
    const [created] = await card();
    expect(created).toMatchObject({ box: 1, reviews: 0, lapses: 0, lastReviewedAt: null });
  });

  it.each([1, 3, 5])('accepts box %i', async (box) => {
    await expect(card(box)).resolves.toBeDefined();
  });

  it.each([0, 6, -1])('rejects box %i with the check constraint', async (box) => {
    await expect(card(box)).rejects.toThrow();
  });

  it('allows one card per learner and word', async () => {
    const user = await createUser();
    const vocab = await createVocab((await createLesson()).id);
    await db.insert(vocabCards).values({ userId: user.id, vocabId: vocab.id });
    await expect(
      db.insert(vocabCards).values({ userId: user.id, vocabId: vocab.id }),
    ).rejects.toThrow();
  });
});

describe('ai calls', () => {
  it('keeps the usage record when the user is deleted', async () => {
    const user = await createUser();
    await db.insert(aiCalls).values({
      userId: user.id,
      purpose: 'reply',
      provider: 'fake',
      model: 'fake-1',
      inputTokens: 120,
      outputTokens: 40,
      latencyMs: 5,
      status: 'ok',
    });
    await db.delete(users).where(eq(users.id, user.id));
    const rows = await db.select().from(aiCalls);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ userId: null, costMicroUsd: 0, errorCode: null });
  });

  it('rejects an unknown status', async () => {
    await expect(
      db.insert(aiCalls).values({
        purpose: 'gloss',
        provider: 'fake',
        model: 'm',
        status: 'maybe' as 'ok',
      }),
    ).rejects.toThrow();
  });
});
