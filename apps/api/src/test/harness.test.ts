import { describe, expect, it } from 'vitest';

import { db } from '../db/client.ts';
import {
  aiCalls,
  conversations,
  corrections,
  invites,
  lessonVocab,
  lessons,
  messages,
  mistakes,
  sessions,
  users,
  vocabCards,
} from '../db/schema/index.ts';

import {
  createConversation,
  createExercise,
  createMessage,
  createUnit,
  createUser,
  createVocab,
} from './factories.ts';
import { assertTestDatabase } from './guard.ts';
import { childrenFirst, emptyDirtyTables, listTablesChildrenFirst } from './reset.ts';

const tables = { users, sessions, invites, lessons, lessonVocab, conversations, messages };

// Fills every application table with one row, so the cleanup has to respect every foreign key.
async function populateEverything() {
  const conversation = await createConversation();
  const message = await createMessage(conversation.id);
  const vocab = await createVocab(conversation.lessonId);
  await createExercise(conversation.lessonId);
  await createUnit();
  const [correction] = await db
    .insert(corrections)
    .values({ messageId: message.id, isCorrect: false, corrected: 'x' })
    .returning();
  await db.insert(mistakes).values({
    correctionId: correction?.id ?? '',
    userId: conversation.userId,
    lessonId: conversation.lessonId,
    type: 'grammar',
    original: 'a',
    correction: 'b',
    explanation: 'c',
  });
  await db.insert(vocabCards).values({ userId: conversation.userId, vocabId: vocab.id });
  await db.insert(sessions).values({
    idHash: 'h',
    userId: conversation.userId,
    expiresAt: new Date(Date.now() + 1000),
  });
  await db.insert(invites).values({
    codeHash: 'c',
    teacherId: (await db.select().from(lessons))[0]?.teacherId ?? '',
    expiresAt: new Date(Date.now() + 1000),
  });
  await db.insert(aiCalls).values({
    userId: conversation.userId,
    purpose: 'reply',
    provider: 'fake',
    model: 'm',
    status: 'ok',
  });
}

describe('test harness', () => {
  it('starts each test with an empty database (the row left here is gone in the next test)', async () => {
    await createUser();
    expect(await db.select().from(users)).toHaveLength(1);
  });

  it('really did empty the table before this test', async () => {
    expect(await db.select().from(users)).toHaveLength(0);
    expect(Object.keys(tables).length).toBeGreaterThan(0);
  });

  it('empties every table in foreign-key order and touches only tables with rows', async () => {
    await populateEverything();
    const all = await listTablesChildrenFirst();
    const started = Date.now();
    const emptied = await emptyDirtyTables(all);
    const elapsed = Date.now() - started;

    // Every application table held a row; children come before the tables they point at.
    expect(emptied.sort()).toEqual(all.filter((t) => t !== '__drizzle_migrations').sort());
    expect(emptied).toHaveLength(13);
    expect(await emptyDirtyTables(all)).toEqual([]);
    // The reason the harness exists: emptying a full database is milliseconds, not seconds.
    expect(elapsed).toBeLessThan(2000);
  });

  it('lists tables children first', async () => {
    const all = await listTablesChildrenFirst();
    const index = (t: string) => all.indexOf(t);
    expect(index('messages')).toBeLessThan(index('conversations'));
    expect(index('corrections')).toBeLessThan(index('messages'));
    expect(index('mistakes')).toBeLessThan(index('corrections'));
    expect(index('conversations')).toBeLessThan(index('users'));
    expect(index('lesson_vocab')).toBeLessThan(index('lessons'));
    expect(index('lessons')).toBeLessThan(index('users'));
  });
});

describe('childrenFirst', () => {
  it('orders a chain and a diamond so every child precedes its parents', () => {
    const order = childrenFirst(
      ['a', 'b', 'c', 'd'],
      [
        { child: 'b', parent: 'a' },
        { child: 'c', parent: 'a' },
        { child: 'd', parent: 'b' },
        { child: 'd', parent: 'c' },
      ],
    );
    expect(order.indexOf('d')).toBeLessThan(order.indexOf('b'));
    expect(order.indexOf('d')).toBeLessThan(order.indexOf('c'));
    expect(order.indexOf('b')).toBeLessThan(order.indexOf('a'));
    expect(order.indexOf('c')).toBeLessThan(order.indexOf('a'));
    expect(order).toHaveLength(4);
  });

  it('refuses a foreign-key cycle instead of looping', () => {
    expect(() =>
      childrenFirst(
        ['a', 'b'],
        [
          { child: 'a', parent: 'b' },
          { child: 'b', parent: 'a' },
        ],
      ),
    ).toThrow(/cycle/);
  });
});

describe('assertTestDatabase', () => {
  it('accepts names ending in _test and refuses everything else', () => {
    expect(() => assertTestDatabase('arabic_test', 'empty')).not.toThrow();
    expect(() => assertTestDatabase('arabic', 'empty')).toThrow(/refusing to empty "arabic"/);
    expect(() => assertTestDatabase('arabic_test_old', 'empty')).toThrow();
    expect(() => assertTestDatabase(undefined, 'migrate')).toThrow();
  });
});
