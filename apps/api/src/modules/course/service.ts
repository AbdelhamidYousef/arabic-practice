import {
  cefrRank,
  type CourseResponse,
  type CefrLevel,
  type CourseUnit,
  type LessonStep,
} from '@arabic/shared';
import { and, asc, count, eq, sql } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import { activityDays, lessons, units, vocabCards } from '../../db/schema/index.ts';
import type { AuthUser } from '../auth/sessions.ts';

import { utcDay } from './days.ts';
import { assertPlausibleDay, getStreak, getXpOnDay } from './progress.service.ts';
import { progressByLesson } from './state.ts';
import { visibleTeacherId } from './visible.ts';

// The steps a lesson needs before it counts as finished: talking to the AI is optional, and a
// lesson without a grammar note or a culture tip has nothing to do in those steps.
function requiredSteps(hasGrammar: boolean, hasCulture: boolean): LessonStep[] {
  return [
    'words',
    'practice',
    ...(hasGrammar ? ['grammar' as const] : []),
    ...(hasCulture ? ['culture' as const] : []),
  ];
}

const emptyStats = { streak: 0, xpToday: 0, xpTotal: 0, wordsLearned: 0 };

// `day` is the learner's local date (the browser sends it), so "today" and the streak match what
// they see; without it the server's UTC date is used.
export async function getCourse(
  user: AuthUser,
  dayParam?: string,
  now = new Date(),
): Promise<CourseResponse> {
  if (dayParam) assertPlausibleDay(dayParam, now);
  const day = dayParam ?? utcDay(now);

  const [xpRow, [cards], streak, xpToday] = await Promise.all([
    db
      .select({ total: sql<number>`coalesce(sum(${activityDays.xp}), 0)::int` })
      .from(activityDays)
      .where(eq(activityDays.userId, user.id)),
    db.select({ n: count() }).from(vocabCards).where(eq(vocabCards.userId, user.id)),
    getStreak(user.id, day),
    getXpOnDay(user.id, day),
  ]);
  const stats = {
    ...emptyStats,
    streak,
    xpToday,
    xpTotal: xpRow[0]?.total ?? 0,
    wordsLearned: cards?.n ?? 0,
  };

  const teacherId = visibleTeacherId(user);
  if (!teacherId) return { levels: [], nextUp: null, stats };

  const rows = await db
    .select({
      id: lessons.id,
      slug: lessons.slug,
      title: lessons.title,
      kind: lessons.kind,
      position: lessons.position,
      hasGrammar: sql<boolean>`jsonb_array_length(${lessons.grammarNote}) > 0`,
      hasCulture: sql<boolean>`${lessons.cultureTip} is not null`,
      unitId: units.id,
      unitCode: units.code,
      unitTitle: units.title,
      unitSummary: units.summary,
      unitPosition: units.position,
      level: units.level,
    })
    .from(lessons)
    .innerJoin(units, eq(units.id, lessons.unitId))
    .where(and(eq(lessons.teacherId, teacherId), eq(lessons.status, 'published')))
    .orderBy(asc(units.level), asc(units.position), asc(lessons.position));

  const progress = await progressByLesson(
    user.id,
    rows.map((r) => r.id),
  );

  const byUnit = new Map<string, { level: CefrLevel; unit: CourseUnit }>();
  let nextUp: string | null = null;
  for (const r of rows) {
    const state = progress.get(r.id) ?? { stepsDone: [], practiceScore: null };
    let entry = byUnit.get(r.unitId);
    if (!entry) {
      entry = {
        level: r.level,
        unit: {
          code: r.unitCode,
          title: r.unitTitle,
          summary: r.unitSummary,
          position: r.unitPosition,
          lessons: [],
        },
      };
      byUnit.set(r.unitId, entry);
    }
    const required = requiredSteps(r.hasGrammar, r.hasCulture);
    const finished = required.every((s) => state.stepsDone.includes(s));
    entry.unit.lessons.push({
      slug: r.slug,
      title: r.title,
      kind: r.kind,
      position: r.position,
      steps: [...required, 'talk'],
      ...state,
      finished,
    });
    if (!finished && nextUp === null) nextUp = r.slug;
  }

  // Rows are ordered by the level enum, so units already arrive in CEFR order; grouping keeps that.
  const levels: CourseResponse['levels'] = [];
  for (const { level, unit } of [...byUnit.values()].sort(
    (a, b) => cefrRank(a.level) - cefrRank(b.level) || a.unit.position - b.unit.position,
  )) {
    const last = levels[levels.length - 1];
    if (last?.level === level) last.units.push(unit);
    else levels.push({ level, units: [unit] });
  }
  return { levels, nextUp, stats };
}
