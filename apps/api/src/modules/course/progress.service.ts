import type { LessonProgressRequest, LessonProgressResponse } from '@arabic/shared';
import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import { activityDays, lessonProgress } from '../../db/schema/index.ts';
import { validation } from '../../lib/errors.ts';
import type { AuthUser } from '../auth/sessions.ts';
import { createCardsForLesson } from '../review/service.ts';

import { isPlausibleDay, streakEndingAt } from './days.ts';
import { findVisibleLessonId } from './visible.ts';
import { xpForStep } from './xp.ts';

// A streak longer than this is shown as this many: it bounds the query, not the learner.
const STREAK_LOOKBACK_DAYS = 400;

export async function getStreak(userId: string, day: string): Promise<number> {
  const rows = await db
    .select({ day: activityDays.day })
    .from(activityDays)
    .where(eq(activityDays.userId, userId))
    .orderBy(desc(activityDays.day))
    .limit(STREAK_LOOKBACK_DAYS);
  return streakEndingAt(
    rows.map((r) => r.day),
    day,
  );
}

export async function getXpOnDay(userId: string, day: string): Promise<number> {
  const [row] = await db
    .select({ xp: activityDays.xp })
    .from(activityDays)
    .where(and(eq(activityDays.userId, userId), eq(activityDays.day, day)));
  return row?.xp ?? 0;
}

export function assertPlausibleDay(day: string, now: Date): void {
  if (!isPlausibleDay(day, now))
    throw validation({ day }, 'day must be today in your time zone (within a day of the server)');
}

export async function recordProgress(
  user: AuthUser,
  slug: string,
  input: LessonProgressRequest,
  now = new Date(),
): Promise<LessonProgressResponse> {
  assertPlausibleDay(input.day, now);
  // Practice is the only scored step; an unscored practice would silently pay 5 XP for nothing.
  if (input.step === 'practice' && input.score === undefined)
    throw validation({ score: 'required' }, 'practice needs a score');
  const score = input.step === 'practice' ? (input.score ?? null) : null;
  const lessonId = await findVisibleLessonId(user, slug);

  const xpGained = await db.transaction(async (tx) => {
    // Insert first: the row that comes back means this call is the first completion, so two
    // parallel posts of one step cannot both be paid.
    const inserted = await tx
      .insert(lessonProgress)
      .values({ userId: user.id, lessonId, step: input.step, score })
      .onConflictDoNothing()
      .returning({ step: lessonProgress.step });
    const first = inserted.length > 0;

    if (!first && score !== null) {
      // Keep the best score; the completion time stays the first one.
      await tx
        .update(lessonProgress)
        .set({ score: sql`greatest(coalesce(${lessonProgress.score}, 0), ${score})` })
        .where(
          and(
            eq(lessonProgress.userId, user.id),
            eq(lessonProgress.lessonId, lessonId),
            eq(lessonProgress.step, input.step),
          ),
        );
    }
    // A repeat earns no XP but still counts as a day of practice, so redoing a lesson keeps a streak.
    const gained = first ? xpForStep(input.step, score) : 0;
    await tx
      .insert(activityDays)
      .values({ userId: user.id, day: input.day, xp: gained })
      .onConflictDoUpdate({
        target: [activityDays.userId, activityDays.day],
        set: { xp: sql`${activityDays.xp} + ${gained}` },
      });
    return gained;
  });

  if (input.step === 'practice') await createCardsForLesson(user.id, lessonId);

  const [xpToday, streak] = await Promise.all([
    getXpOnDay(user.id, input.day),
    getStreak(user.id, input.day),
  ]);
  return { xpGained, xpToday, streak };
}
