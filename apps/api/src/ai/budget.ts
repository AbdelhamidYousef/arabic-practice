import { ErrorCode } from '@arabic/shared';
import { and, count, eq, gte, ne, sql } from 'drizzle-orm';

import type { Database } from '../db/client.ts';
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
  db: Pick<Database, 'select' | 'insert'>;
  limits: BudgetLimits;
  now?: () => Date;
}

const startOfUtcDay = (d: Date) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
const startOfUtcMonth = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));

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
  async function check(ctx: AiCallContext, purpose: LlmPurpose, model: string): Promise<void> {
    if (!limits.enabled) {
      throw new AppError(ErrorCode.AI_DISABLED, 'AI practice is switched off right now');
    }
    const at = now();
    const dayStart = startOfUtcDay(at);

    // 1. Turns per user today. A turn = one `reply` row, so count replies; both calls of a turn are
    //    checked against the same number (the correction does not add to it, the reply does).
    if (ctx.userId && isTurnPurpose(purpose)) {
      const limit = ctx.isGuest ? limits.turnsPerGuestPerDay : limits.turnsPerLearnerPerDay;
      const [row] = await db
        .select({ n: count() })
        .from(aiCalls)
        .where(
          and(
            eq(aiCalls.userId, ctx.userId),
            eq(aiCalls.purpose, 'reply'),
            counted,
            gte(aiCalls.createdAt, dayStart),
          ),
        );
      const used = row?.n ?? 0;
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

  // Run the check; on a refusal write a `limited` row (so the usage page can show it), then rethrow.
  async function guard(ctx: AiCallContext, purpose: LlmPurpose, model: string): Promise<void> {
    try {
      await check(ctx, purpose, model);
    } catch (e) {
      if (e instanceof AppError) {
        await recordCall(db, {
          ctx,
          purpose,
          model,
          provider: inner.provider,
          status: 'limited',
          errorCode: e.code,
          tier: limits.tier,
          at: now(),
        }).catch(() => undefined);
      }
      throw e;
    }
  }

  return {
    provider: inner.provider,
    async generateJson(ctx, request) {
      await guard(ctx, request.purpose, request.model);
      return inner.generateJson(ctx, request);
    },
    async streamText(ctx, request) {
      await guard(ctx, request.purpose, request.model);
      return inner.streamText(ctx, request);
    },
  };
}
