import { and, eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { lessonProgress, vocabCards } from '../../db/schema/index.ts';
import { createLesson, createTeacher, createUser, createVocab } from '../../test/factories.ts';
import type { AuthUser } from '../auth/sessions.ts';

import { addDays, utcDay } from './days.ts';
import { recordProgress } from './progress.service.ts';

const today = utcDay(new Date());
const yesterday = addDays(today, -1);

async function learnerWithLesson(lessonOverrides: Parameters<typeof createLesson>[0] = {}) {
  const teacher = await createTeacher();
  const row = await createUser({ teacherId: teacher.id });
  const lesson = await createLesson({ teacherId: teacher.id, ...lessonOverrides });
  const user: AuthUser = {
    id: row.id,
    email: row.email,
    displayName: row.displayName,
    role: 'learner',
    level: row.level,
    isGuest: false,
    readOnly: false,
    teacherId: teacher.id,
  };
  return { user, lesson };
}

describe('recordProgress', () => {
  it('pays XP only on the first completion of a step', async () => {
    const { user, lesson } = await learnerWithLesson();
    const first = await recordProgress(user, lesson.slug, { step: 'words', day: today });
    expect(first).toEqual({ xpGained: 5, xpToday: 5, streak: 1 });
    const again = await recordProgress(user, lesson.slug, { step: 'words', day: today });
    expect(again).toEqual({ xpGained: 0, xpToday: 5, streak: 1 });
    const grammar = await recordProgress(user, lesson.slug, { step: 'grammar', day: today });
    expect(grammar).toEqual({ xpGained: 3, xpToday: 8, streak: 1 });
  });

  it('keeps the best practice score and pays the first score only', async () => {
    const { user, lesson } = await learnerWithLesson();
    const first = await recordProgress(user, lesson.slug, {
      step: 'practice',
      score: 60,
      day: today,
    });
    expect(first.xpGained).toBe(11);
    const better = await recordProgress(user, lesson.slug, {
      step: 'practice',
      score: 100,
      day: today,
    });
    expect(better.xpGained).toBe(0);
    await recordProgress(user, lesson.slug, { step: 'practice', score: 20, day: today });

    const [row] = await db
      .select()
      .from(lessonProgress)
      .where(and(eq(lessonProgress.userId, user.id), eq(lessonProgress.step, 'practice')));
    expect(row?.score).toBe(100);
  });

  it('needs a score for practice', async () => {
    const { user, lesson } = await learnerWithLesson();
    await expect(
      recordProgress(user, lesson.slug, { step: 'practice', day: today }),
    ).rejects.toMatchObject({ status: 400 });
  });

  it('counts a streak across consecutive days and breaks it on a gap', async () => {
    const { user, lesson } = await learnerWithLesson();
    await recordProgress(user, lesson.slug, { step: 'words', day: yesterday });
    const second = await recordProgress(user, lesson.slug, { step: 'grammar', day: today });
    expect(second.streak).toBe(2);
    expect(second.xpToday).toBe(3);
    // A day with no activity between today and an older day does not extend anything.
    const tomorrow = addDays(today, 1);
    const third = await recordProgress(user, lesson.slug, { step: 'culture', day: tomorrow });
    expect(third.streak).toBe(3);
  });

  it('keeps the streak alive on the day after the last activity, before the first step', async () => {
    const { user, lesson } = await learnerWithLesson();
    await recordProgress(user, lesson.slug, { step: 'words', day: yesterday });
    // Nothing yet today; a repeat of the same step adds no XP and so no activity for today.
    const repeat = await recordProgress(user, lesson.slug, { step: 'words', day: today });
    expect(repeat).toEqual({ xpGained: 0, xpToday: 0, streak: 1 });
  });

  it('rejects a day more than one day from the server date', async () => {
    const { user, lesson } = await learnerWithLesson();
    for (const day of [addDays(today, 2), addDays(today, -2), '2026-02-31']) {
      await expect(recordProgress(user, lesson.slug, { step: 'words', day })).rejects.toMatchObject(
        { status: 400, code: 'VALIDATION_ERROR' },
      );
    }
  });

  it('puts the lesson words into the review deck when practice is done', async () => {
    const { user, lesson } = await learnerWithLesson();
    await createVocab(lesson.id);
    await createVocab(lesson.id);
    await recordProgress(user, lesson.slug, { step: 'words', day: today });
    expect(await db.select().from(vocabCards)).toHaveLength(0);
    await recordProgress(user, lesson.slug, { step: 'practice', score: 90, day: today });
    await recordProgress(user, lesson.slug, { step: 'practice', score: 95, day: today });
    expect(await db.select().from(vocabCards).where(eq(vocabCards.userId, user.id))).toHaveLength(
      2,
    );
  });

  it('answers 404 for a draft lesson and for another teacher lesson', async () => {
    const { user } = await learnerWithLesson();
    const draft = await createLesson({ teacherId: user.teacherId ?? '', status: 'draft' });
    const foreign = await createLesson();
    for (const slug of [draft.slug, foreign.slug, 'missing']) {
      await expect(recordProgress(user, slug, { step: 'words', day: today })).rejects.toMatchObject(
        { status: 404 },
      );
    }
  });
});
