import { harakatRatio } from '@arabic/shared';
import { eq, sql } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { verify } from '../../lib/password.ts';
import { db } from '../client.ts';
import {
  aiCalls,
  conversations,
  corrections,
  lessons,
  lessonVocab,
  messages,
  mistakes,
  users,
} from '../schema/index.ts';

import { seedConversations } from './conversations.ts';
import { runSeed } from './index.ts';
import { DEMO_TEACHER, DEV_TEACHER, demoLearners } from './users.ts';
import { harakatProblems } from './validate.ts';

async function counts() {
  const row = async (q: ReturnType<typeof sql>) =>
    Number((await db.execute<{ c: string }>(q))[0]?.c);
  return {
    users: await row(sql`select count(*) c from users`),
    lessons: await row(sql`select count(*) c from lessons`),
    vocab: await row(sql`select count(*) c from lesson_vocab`),
    conversations: await row(sql`select count(*) c from conversations`),
    messages: await row(sql`select count(*) c from messages`),
    corrections: await row(sql`select count(*) c from corrections`),
    mistakes: await row(sql`select count(*) c from mistakes`),
    aiCalls: await row(sql`select count(*) c from ai_calls`),
  };
}

describe('seed', () => {
  it('creates 12 published lessons with 8 to 12 vocabulary items each, owned by the demo teacher', async () => {
    const summary = await runSeed({ nodeEnv: 'test' });
    expect(summary).toMatchObject({ lessons: 12, learners: 4, conversations: 8, devTeacher: true });

    const demo = await db.select().from(users).where(eq(users.email, DEMO_TEACHER.email));
    expect(demo[0]).toMatchObject({ role: 'teacher', readOnly: true, displayName: 'Ustadh Demo' });

    const rows = await db.select().from(lessons);
    expect(rows).toHaveLength(12);
    expect(rows.every((l) => l.teacherId === demo[0]?.id && l.status === 'published')).toBe(true);
    for (const lesson of rows) {
      const vocab = await db.select().from(lessonVocab).where(eq(lessonVocab.lessonId, lesson.id));
      expect(vocab.length, lesson.slug).toBeGreaterThanOrEqual(8);
      expect(vocab.length, lesson.slug).toBeLessThanOrEqual(12);
      expect(harakatRatio(lesson.openingLine)).toBeGreaterThanOrEqual(0.5);
    }
  });

  it('is idempotent: a second run changes nothing', async () => {
    await runSeed({ nodeEnv: 'test' });
    const first = await counts();
    await runSeed({ nodeEnv: 'test' });
    expect(await counts()).toEqual(first);
    expect(first).toMatchObject({ lessons: 12, conversations: 8, users: 1 + 1 + 4 });
  });

  it('puts the made-up class under the demo teacher with data for the teacher view', async () => {
    await runSeed({ nodeEnv: 'test' });
    const [demo] = await db.select().from(users).where(eq(users.email, DEMO_TEACHER.email));
    const learners = await db
      .select()
      .from(users)
      .where(eq(users.teacherId, demo?.id ?? ''));
    expect(learners.map((l) => l.email).sort()).toEqual(demoLearners.map((l) => l.email).sort());
    expect(learners.every((l) => l.email?.endsWith('@arabic-practice.test'))).toBe(true);
    expect(learners.map((l) => l.level).sort()).toEqual(['A1', 'A2', 'B1', 'B2']);

    for (const learner of learners) {
      const convs = await db
        .select()
        .from(conversations)
        .where(eq(conversations.userId, learner.id));
      expect(convs.length, learner.email ?? '').toBeGreaterThanOrEqual(2);
      const learnerMistakes = await db
        .select()
        .from(mistakes)
        .where(eq(mistakes.userId, learner.id));
      expect(learnerMistakes.length, learner.email ?? '').toBeGreaterThanOrEqual(2);
      expect(
        (await db.select().from(aiCalls).where(eq(aiCalls.userId, learner.id))).length,
      ).toBeGreaterThan(0);
    }
    const c = await counts();
    // 8 conversations: each has an opening line plus 1 or 2 turns of (learner, partner).
    const turns = seedConversations.reduce((sum, conv) => sum + conv.turns.length, 0);
    expect(c.messages).toBe(8 + turns * 2);
    expect(c.corrections).toBe(turns);
    expect(c.aiCalls).toBe(turns * 2);
  });

  it('records a correction that flags the right messages', async () => {
    await runSeed({ nodeEnv: 'test' });
    const rows = await db.select().from(corrections);
    const flawless = rows.filter((r) => r.isCorrect);
    expect(flawless.length).toBe(
      seedConversations.flatMap((c) => c.turns).filter((t) => t.mistakes.length === 0).length,
    );
    expect(flawless.every((r) => r.praise)).toBe(true);
    const types = new Set((await db.select().from(mistakes)).map((m) => m.type));
    expect(types).toEqual(new Set(['grammar', 'spelling', 'register', 'harakat', 'vocabulary']));
  });

  it('keeps seeded usage out of today so it never counts against the daily caps', async () => {
    await runSeed({ nodeEnv: 'test' });
    const [today] = await db.execute<{ c: string }>(
      sql`select count(*) c from ai_calls where created_at > now() - interval '23 hours'`,
    );
    expect(Number(today?.c)).toBe(0);
  });

  it('stores partner level metrics computed from the text', async () => {
    await runSeed({ nodeEnv: 'test' });
    const partner = (await db.select().from(messages)).filter((m) => m.role === 'partner');
    expect(partner.length).toBeGreaterThan(0);
    for (const m of partner) {
      expect(m.levelMetrics?.words).toBeGreaterThan(0);
      expect(m.levelMetrics?.latinChars).toBe(0);
    }
  });

  it('gives the dev teacher the password it is told, and nobody else a usable one', async () => {
    await runSeed({ nodeEnv: 'test', teacherPassword: 'Another-pass-9!' });
    const all = await db.select().from(users);
    const dev = all.find((u) => u.email === DEV_TEACHER.email);
    expect(await verify(dev?.passwordHash ?? '', 'Another-pass-9!')).toBe(true);
    expect(await verify(dev?.passwordHash ?? '', 'Teacher-demo-1!')).toBe(false);
    expect(dev?.readOnly).toBe(false);
    for (const u of all.filter((x) => x.email !== DEV_TEACHER.email)) {
      expect(u.passwordHash?.startsWith('!unusable:')).toBe(true);
      expect(await verify(u.passwordHash ?? '', 'anything')).toBe(false);
    }
  });

  it('uses the documented default password when none is given', async () => {
    await runSeed({ nodeEnv: 'test' });
    const [dev] = await db.select().from(users).where(eq(users.email, DEV_TEACHER.email));
    expect(await verify(dev?.passwordHash ?? '', 'Teacher-demo-1!')).toBe(true);
  });

  it('does not create the dev teacher in production', async () => {
    const summary = await runSeed({ nodeEnv: 'production', teacherPassword: 'Whatever-123!' });
    expect(summary.devTeacher).toBe(false);
    expect(await db.select().from(users).where(eq(users.email, DEV_TEACHER.email))).toEqual([]);
  });

  it('removes a vocabulary entry that is no longer in the data', async () => {
    await runSeed({ nodeEnv: 'test' });
    const [lesson] = await db.select().from(lessons).where(eq(lessons.slug, 'greetings'));
    await db.insert(lessonVocab).values({
      lessonId: lesson?.id ?? '',
      arabic: 'مَطَرٌ',
      arabicPlain: 'مطر',
      english: 'rain (stray)',
    });
    await runSeed({ nodeEnv: 'test' });
    const vocab = await db
      .select()
      .from(lessonVocab)
      .where(eq(lessonVocab.lessonId, lesson?.id ?? ''));
    expect(vocab.map((v) => v.arabicPlain)).not.toContain('مطر');
  });
});

describe('seed conversation content', () => {
  const arabicStrings = seedConversations.flatMap((c) =>
    c.turns.flatMap((t) => [t.corrected, t.partner]),
  );

  it('writes corrected sentences and partner replies with well-formed harakat', () => {
    for (const text of arabicStrings) {
      expect(harakatProblems(text), text).toEqual([]);
      expect(harakatRatio(text), text).toBeGreaterThanOrEqual(0.5);
    }
  });

  it('only names lessons that exist and learners that exist', () => {
    const emails = new Set(demoLearners.map((l) => l.email));
    for (const c of seedConversations) expect(emails.has(c.learner)).toBe(true);
    expect(seedConversations.every((c) => c.daysAgo >= 1)).toBe(true);
  });
});
