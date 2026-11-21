import { ErrorCode } from '@arabic/shared';
import { and, count, eq, gte, inArray, ne, sql } from 'drizzle-orm';

import type { Database, Tx } from '../db/client.ts';
import { aiCalls } from '../db/schema/index.ts';
import { AppError } from '../lib/errors.ts';

import type { AiTier } from './prices.ts';
import type { LlmPurpose } from './provider.ts';
import { recordCall, type AiCallContext, type LlmGateway } from './usage.ts';

// The hard spend limit. Every rule here is checked BEFORE the provider is contacted, from rows we
// wrote ourselves in `ai_calls`. Why count our own rows and not trust the provider's dashboard:
// the dashboard lags, is not per user, and cannot refuse anything; our rows are exact, instant, and
// the check sits in the one place every call must pass.
//
// Check-then-call used to race: the ledger row was written when a call FINISHED, so parallel calls
// all saw the same count and all passed. Now the guard checks and inserts a `pending` row for the call
// inside one transaction that holds an advisory lock, so the next caller counts this one. The ledger
// later settles the row (ok/error). Pending rows count like ok and error rows; a pending row older
// than 5 minutes is a call whose instance died: it keeps counting (the provider may have been used)
// and the usage page shows it as an error.
//
// Rows with status `limited` are calls WE refused: they never reached the provider, so no count
// below includes them (otherwise a refused user would keep using up the shared daily quota).

export interface BudgetLimits {
  /** Kill switch (AI_ENABLED). */
  enabled: boolean;
  tier: AiTier;
  /** A turn is one learner message: one correction call + one reply call. */
  turnsPerLearnerPerDay: number;
  turnsPerGuestPerDay: number;
  /** Glosses ("translate") per user per UTC day: a billed call that is not a turn, so it has its own cap. */
  glossPerLearnerPerDay: number;
  glossPerGuestPerDay: number;
  /** Provider calls per model per UTC day; the free quota is per model. */
  callsPerModelPerDay: number;
  /** Monthly spend ceiling in USD; only meaningful on the paid tier (the free tier costs 0). */
  monthlyBudgetUsd: number;
}

export interface BudgetOptions {
  inner: LlmGateway;
  db: Pick<Database, 'select' | 'insert' | 'transaction'>;
  limits: BudgetLimits;
  now?: () => Date;
}

const startOfUtcDay = (d: Date) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
const startOfUtcMonth = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));

// Any fixed number: every guard in every instance asks Postgres for this same lock.
const BUDGET_LOCK = 7_251_002;

type Reservation = { refused: AppError } | { refused?: undefined; pendingId: string };

const isTurnPurpose = (p: LlmPurpose) => p === 'correction' || p === 'reply';

export function createGuardedGateway({
  inner,
  db,
  limits,
  now = () => new Date(),
}: BudgetOptions): LlmGateway {
  const counted = ne(aiCalls.status, 'limited');

  // Throws the right AppError, or returns when the call may go ahead. One cheap indexed query per
  // rule, run in order, and a rule that does not apply (guest has no user id, free tier has no
  // money) costs no query at all.
  async function check(
    db: Pick<Tx, 'select'>,
    ctx: AiCallContext,
    purpose: LlmPurpose,
    model: string,
    at: Date,
  ): Promise<void> {
    if (!limits.enabled) {
      throw new AppError(ErrorCode.AI_DISABLED, 'AI practice is switched off right now');
    }
    const dayStart = startOfUtcDay(at);

    // 1. Turns per user today. A turn = one `reply` row, so count replies; both calls of a turn are
    //    checked against the same number. A correction runs BEFORE its reply, so for a correction
    //    check the turns already started (pending or ok corrections) count too: otherwise two
    //    parallel turns would both pass their correction and one reply would be refused after its
    //    correction was paid for. A failed correction does not use a turn up.
    if (ctx.userId && isTurnPurpose(purpose)) {
      const limit = ctx.isGuest ? limits.turnsPerGuestPerDay : limits.turnsPerLearnerPerDay;
      const [row] = await db
        .select({
          replies:
            sql<number>`count(*) filter (where ${aiCalls.purpose} = 'reply' and ${counted})`.mapWith(
              Number,
            ),
          corrections:
            sql<number>`count(*) filter (where ${aiCalls.purpose} = 'correction' and ${inArray(aiCalls.status, ['pending', 'ok'])})`.mapWith(
              Number,
            ),
        })
        .from(aiCalls)
        .where(
          and(
            eq(aiCalls.userId, ctx.userId),
            inArray(aiCalls.purpose, ['reply', 'correction']),
            gte(aiCalls.createdAt, dayStart),
          ),
        );
      const used =
        purpose === 'correction'
          ? Math.max(row?.replies ?? 0, row?.corrections ?? 0)
          : (row?.replies ?? 0);
      if (used >= limit) {
        throw new AppError(
          ErrorCode.AI_LIMIT_USER,
          'You have reached today’s practice limit, come back tomorrow',
          { limit, used },
        );
      }
    }

    // 1b. Glosses per user today. Gloss shares the per-model cap below with the turns, so without a
    //     cap of its own one person pressing "translate" on fresh messages could empty it for everybody.
    if (ctx.userId && purpose === 'gloss') {
      const limit = ctx.isGuest ? limits.glossPerGuestPerDay : limits.glossPerLearnerPerDay;
      const [row] = await db
        .select({ n: count() })
        .from(aiCalls)
        .where(
          and(
            eq(aiCalls.userId, ctx.userId),
            eq(aiCalls.purpose, 'gloss'),
            counted,
            gte(aiCalls.createdAt, dayStart),
          ),
        );
      const used = row?.n ?? 0;
      if (used >= limit) {
        throw new AppError(
          ErrorCode.AI_LIMIT_USER,
          'You have reached today’s translation limit, come back tomorrow',
          { limit, used },
        );
      }
    }

    // 2. Calls per model today, across everyone.
    {
      const [row] = await db
        .select({ n: count() })
        .from(aiCalls)
        .where(and(eq(aiCalls.model, model), counted, gte(aiCalls.createdAt, dayStart)));
      const used = row?.n ?? 0;
      if (used >= limits.callsPerModelPerDay) {
        throw new AppError(
          ErrorCode.AI_LIMIT_GLOBAL,
          'The practice partner is very busy today, try again tomorrow',
          { limit: limits.callsPerModelPerDay, used },
        );
      }
    }

    // 3. Money this UTC month (paid tier only). `>=`: spending exactly the budget is spent.
    if (limits.tier === 'paid') {
      const [row] = await db
        .select({ micro: sql<string>`coalesce(sum(${aiCalls.costMicroUsd}), 0)` })
        .from(aiCalls)
        .where(gte(aiCalls.createdAt, startOfUtcMonth(at)));
      const spent = Number(row?.micro ?? 0);
      if (spent >= limits.monthlyBudgetUsd * 1_000_000) {
        throw new AppError(ErrorCode.AI_LIMIT_GLOBAL, 'The monthly AI budget is used up', {
          spentMicroUsd: spent,
        });
      }
    }
  }

  // Check and reserve in one locked transaction; on a refusal write a `limited` row (so the usage
  // page can show it, outside the transaction so the rollback cannot take it away), then rethrow.
  // Returns the context to hand to the ledger, carrying the id of the `pending` row.
  async function guard(
    ctx: AiCallContext,
    purpose: LlmPurpose,
    model: string,
  ): Promise<AiCallContext> {
    const at = now();
    const outcome = await db.transaction(async (tx): Promise<Reservation> => {
      await tx.execute(sql`select pg_advisory_xact_lock(${BUDGET_LOCK})`);
      try {
        await check(tx, ctx, purpose, model, at);
      } catch (e) {
        if (e instanceof AppError) return { refused: e };
        throw e;
      }
      const [row] = await tx
        .insert(aiCalls)
        .values({
          userId: ctx.userId,
          conversationId: ctx.conversationId ?? null,
          purpose,
          provider: inner.provider,
          model,
          status: 'pending',
          createdAt: at,
        })
        .returning({ id: aiCalls.id });
      if (!row) throw new Error('pending ledger insert returned no row');
      return { refused: undefined, pendingId: row.id };
    });
    if (outcome.refused) {
      const e = outcome.refused;
      await recordCall(db, {
        ctx,
        purpose,
        model,
        provider: inner.provider,
        status: 'limited',
        errorCode: e.code,
        tier: limits.tier,
        at,
      }).catch(() => undefined);
      throw e;
    }
    return { ...ctx, pendingId: outcome.pendingId };
  }

  return {
    provider: inner.provider,
    async generateJson(ctx, request) {
      return inner.generateJson(await guard(ctx, request.purpose, request.model), request);
    },
    async streamText(ctx, request) {
      return inner.streamText(await guard(ctx, request.purpose, request.model), request);
    },
  };
}
