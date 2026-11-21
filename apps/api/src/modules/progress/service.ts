import type { ProgressResponse } from '@arabic/shared';
import { and, count, desc, eq, gte, sql } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import { conversations, lessons, messages, mistakes } from '../../db/schema/index.ts';
import type { AuthUser } from '../auth/sessions.ts';

import { formatDay, lastWeekStarts } from './weeks.ts';

const WEEKS = 8;
const RECENT = 10;

// Shared with the teacher's learner page: the aggregates for one learner. The caller decides whose
// id it is (the signed-in learner, or a learner the teacher owns); every query filters by it.
export async function recentMistakes(userId: string, limit = RECENT) {
  const rows = await db
    .select({
      id: mistakes.id,
      type: mistakes.type,
      original: mistakes.original,
      correction: mistakes.correction,
      explanation: mistakes.explanation,
      createdAt: mistakes.createdAt,
      lessonTitle: lessons.title,
      lessonSlug: lessons.slug,
    })
    .from(mistakes)
    .innerJoin(lessons, eq(lessons.id, mistakes.lessonId))
    .where(eq(mistakes.userId, userId))
    .orderBy(desc(mistakes.createdAt), desc(mistakes.id))
    .limit(limit);
  return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
}

export async function mistakesByType(userId: string) {
  return db
    .select({ type: mistakes.type, count: count() })
    .from(mistakes)
    .where(eq(mistakes.userId, userId))
    .groupBy(mistakes.type)
    .orderBy(desc(count()), mistakes.type);
}

const weekKey = (col: Parameters<typeof sql>[1]) =>
  sql<string>`to_char(date_trunc('week', ${col} at time zone 'utc'), 'YYYY-MM-DD')`;

export async function getProgress(user: AuthUser, now = new Date()): Promise<ProgressResponse> {
  const userId = user.id;
  const starts = lastWeekStarts(now, WEEKS);
  const since = starts[0] ?? now;

  const learnerTurns = and(eq(conversations.userId, userId), eq(messages.role, 'learner'));
  const mistakeWeek = weekKey(mistakes.createdAt);
  const turnWeek = weekKey(messages.createdAt);

  const [[convTotal], [turnTotal], [mistakeTotal], byType, turnRows, mistakeRows, recent] =
    await Promise.all([
      db.select({ n: count() }).from(conversations).where(eq(conversations.userId, userId)),
      db
        .select({ n: count() })
        .from(messages)
        .innerJoin(conversations, eq(conversations.id, messages.conversationId))
        .where(learnerTurns),
      db.select({ n: count() }).from(mistakes).where(eq(mistakes.userId, userId)),
      mistakesByType(userId),
      db
        .select({ week: turnWeek, n: count() })
        .from(messages)
        .innerJoin(conversations, eq(conversations.id, messages.conversationId))
        .where(and(learnerTurns, gte(messages.createdAt, since)))
        .groupBy(turnWeek),
      db
        .select({ week: mistakeWeek, n: count() })
        .from(mistakes)
        .where(and(eq(mistakes.userId, userId), gte(mistakes.createdAt, since)))
        .groupBy(mistakeWeek),
      recentMistakes(userId),
    ]);

  const turnsBy = new Map(turnRows.map((r) => [r.week, r.n]));
  const mistakesBy = new Map(mistakeRows.map((r) => [r.week, r.n]));

  return {
    totals: {
      conversations: convTotal?.n ?? 0,
      turns: turnTotal?.n ?? 0,
      mistakes: mistakeTotal?.n ?? 0,
    },
    mistakesByType: byType,
    weeks: starts.map((start) => {
      const key = formatDay(start);
      const turns = turnsBy.get(key) ?? 0;
      const mistakeCount = mistakesBy.get(key) ?? 0;
      return {
        weekStart: key,
        turns,
        mistakes: mistakeCount,
        mistakesPerTurn: turns === 0 ? 0 : Math.round((mistakeCount / turns) * 100) / 100,
      };
    }),
    recentMistakes: recent,
  };
}
