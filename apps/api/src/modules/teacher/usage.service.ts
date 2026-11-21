import type { TeacherUsageResponse } from '@arabic/shared';
import { and, count, desc, eq, gte, ne, or, sql, sum } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import { aiCalls, users } from '../../db/schema/index.ts';
import type { AuthUser } from '../auth/sessions.ts';

import { readDailyCaps } from './caps.ts';

const DAYS = 30;
const DAY_MS = 24 * 3600 * 1000;

const utcDay = (d: Date) => d.toISOString().slice(0, 10);
const day = sql<string>`to_char(${aiCalls.createdAt} at time zone 'utc', 'YYYY-MM-DD')`;

// A "call" is a provider call. `limited` rows are requests we refused ourselves (a cap or the kill
// switch): they cost nothing, so they are counted apart and never count towards a cap.
const providerCall = ne(aiCalls.status, 'limited');

// Both usage figures and cap checks count the same way: sums come back from SQL as strings or null.
const total = (n: string | null) => Number(n ?? 0);

export async function getUsage(teacher: AuthUser, now = new Date()): Promise<TeacherUsageResponse> {
  const todayKey = utcDay(now);
  const since = new Date(Date.parse(`${todayKey}T00:00:00Z`) - (DAYS - 1) * DAY_MS);

  // Ownership: calls made by me or by someone whose teacher is me. The join also drops ledger rows
  // whose user was deleted (user_id set null), which belong to nobody's class.
  const inMyClass = or(eq(users.id, teacher.id), eq(users.teacherId, teacher.id));
  const mine = and(inMyClass, gte(aiCalls.createdAt, since));

  const sums = {
    calls: sql<number>`count(*) filter (where ${providerCall})`.mapWith(Number),
    inputTokens: sum(aiCalls.inputTokens).mapWith(total),
    outputTokens: sum(aiCalls.outputTokens).mapWith(total),
    costMicroUsd: sum(aiCalls.costMicroUsd).mapWith(total),
  };

  const [dayRows, purposeRows, modelRows, todayModels, todayPeople] = await Promise.all([
    db
      .select({
        date: day,
        limited: sql<number>`count(*) filter (where ${aiCalls.status} = 'limited')`.mapWith(Number),
        ...sums,
      })
      .from(aiCalls)
      .innerJoin(users, eq(users.id, aiCalls.userId))
      .where(mine)
      .groupBy(day),
    db
      .select({ purpose: aiCalls.purpose, ...sums })
      .from(aiCalls)
      .innerJoin(users, eq(users.id, aiCalls.userId))
      .where(mine)
      .groupBy(aiCalls.purpose)
      .orderBy(desc(sums.calls), aiCalls.purpose),
    db
      .select({ model: aiCalls.model, ...sums })
      .from(aiCalls)
      .innerJoin(users, eq(users.id, aiCalls.userId))
      .where(mine)
      .groupBy(aiCalls.model)
      .orderBy(desc(sums.calls), aiCalls.model),
    // The per-model cap is global (the limiter counts everyone), so this one is not class-scoped.
    db
      .select({ model: aiCalls.model, calls: count() })
      .from(aiCalls)
      .where(and(providerCall, gte(aiCalls.createdAt, new Date(`${todayKey}T00:00:00Z`))))
      .groupBy(aiCalls.model)
      .orderBy(aiCalls.model),
    db
      .select({
        userId: users.id,
        displayName: users.displayName,
        isGuest: users.isGuest,
        turns: count(),
      })
      .from(aiCalls)
      .innerJoin(users, eq(users.id, aiCalls.userId))
      .where(
        and(
          inMyClass,
          // Guests are anonymous visitors of the public demo: their ids must not leak to the demo
          // teacher (they are the key to nothing now, but they were, see learners.service.ts).
          eq(users.isGuest, false),
          providerCall,
          eq(aiCalls.purpose, 'reply'),
          gte(aiCalls.createdAt, new Date(`${todayKey}T00:00:00Z`)),
        ),
      )
      .groupBy(users.id)
      .orderBy(desc(count()), users.displayName),
  ]);

  const byDay = new Map(dayRows.map((r) => [r.date, r]));
  return {
    days: Array.from({ length: DAYS }, (_, i) => {
      const date = utcDay(new Date(since.getTime() + i * DAY_MS));
      const row = byDay.get(date);
      return {
        date,
        calls: row?.calls ?? 0,
        limited: row?.limited ?? 0,
        inputTokens: row?.inputTokens ?? 0,
        outputTokens: row?.outputTokens ?? 0,
        costMicroUsd: row?.costMicroUsd ?? 0,
      };
    }),
    byPurpose: purposeRows,
    byModel: modelRows,
    today: { date: todayKey, caps: readDailyCaps(), models: todayModels, people: todayPeople },
  };
}
