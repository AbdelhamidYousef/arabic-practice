import { ErrorCode } from '@arabic/shared';
import type { Logger } from 'pino';

import type { Database } from '../db/client.ts';
import { aiCalls } from '../db/schema/index.ts';
import { AppError } from '../lib/errors.ts';

import { costMicroUsd, type AiTier } from './prices.ts';
import {
  LlmBadOutput,
  LlmFailed,
  LlmRateLimited,
  LlmUnavailable,
  type JsonRequest,
  type LlmProvider,
  type LlmPurpose,
  type StreamEvent,
  type TextRequest,
  type Usage,
} from './provider.ts';

/** Who the call is for. Routes pass it; the ledger stores it and the budget guard counts by it. */
export interface AiCallContext {
  userId: string | null;
  conversationId?: string | null;
  /** Guests get a smaller daily allowance than signed-in learners. */
  isGuest?: boolean;
}

/**
 * What routes actually call: a provider plus who is asking. Wrapping order, outermost first:
 * budget guard (may refuse) -> usage ledger (records every call) -> provider (does the work).
 * Failures are thrown as AppError with the API codes (AI_BUSY, AI_FAILED, AI_LIMIT_*, AI_DISABLED).
 */
export interface LlmGateway {
  readonly provider: LlmProvider['name'];
  generateJson<T>(ctx: AiCallContext, request: JsonRequest<T>): Promise<{ data: T; usage: Usage }>;
  /**
   * Resolves once the provider has ACCEPTED the call (first event received), so a refusal or a 429
   * is thrown here, before the route opens its event stream. Iterating then yields the rest.
   */
  streamText(ctx: AiCallContext, request: TextRequest): Promise<AsyncIterable<StreamEvent>>;
}

export interface CallRecord {
  ctx: AiCallContext;
  purpose: LlmPurpose;
  provider: string;
  model: string;
  usage?: Usage;
  status: 'ok' | 'error' | 'limited';
  errorCode?: string;
  tier: AiTier;
  at?: Date;
}

/** Writes one ledger row. Money is computed here, from the price table, not trusted from anywhere else. */
export async function recordCall(db: Pick<Database, 'insert'>, r: CallRecord): Promise<void> {
  const usage = r.usage;
  await db.insert(aiCalls).values({
    userId: r.ctx.userId,
    conversationId: r.ctx.conversationId ?? null,
    purpose: r.purpose,
    provider: r.provider,
    model: r.model,
    inputTokens: usage?.inputTokens ?? 0,
    outputTokens: usage?.outputTokens ?? 0,
    latencyMs: usage?.latencyMs ?? 0,
    costMicroUsd: usage ? costMicroUsd(usage, r.tier, r.at) : 0,
    status: r.status,
    errorCode: r.errorCode ?? null,
  });
}

/** Provider error -> the API error the client sees, plus the short code stored in the ledger. */
export function describeFailure(e: unknown): { code: string; error: Error } {
  if (e instanceof LlmUnavailable) {
    // Checked before LlmRateLimited (its parent): the ledger keeps the real status, e.g. HTTP_503.
    return {
      code: e.code,
      error: new AppError(ErrorCode.AI_BUSY, 'The AI is busy, try again shortly'),
    };
  }
  if (e instanceof LlmRateLimited) {
    return {
      code: 'RATE_LIMITED',
      error: new AppError(ErrorCode.AI_BUSY, 'The AI is busy, try again shortly'),
    };
  }
  if (e instanceof LlmBadOutput) {
    return {
      code: 'BAD_OUTPUT',
      error: new AppError(ErrorCode.AI_FAILED, 'The AI gave an unusable answer'),
    };
  }
  if (e instanceof LlmFailed) {
    return { code: e.code, error: new AppError(ErrorCode.AI_FAILED, 'The AI call failed') };
  }
  // A bug of ours (not a provider failure): keep the original error so it is logged as a 500.
  return { code: 'INTERNAL', error: e instanceof Error ? e : new Error(String(e)) };
}

export interface LedgerOptions {
  provider: LlmProvider;
  db: Pick<Database, 'insert'>;
  tier: AiTier;
  logger?: Logger;
  now?: () => Date;
}

export function createLedgeredGateway({
  provider,
  db,
  tier,
  logger,
  now,
}: LedgerOptions): LlmGateway {
  // A failed ledger write must not turn a good answer into an error for the learner: log it loudly.
  // (The cost is that a call can go uncounted; the per-model caps leave 10% headroom for that.)
  const write = async (r: Omit<CallRecord, 'tier' | 'provider'>) => {
    try {
      await recordCall(db, { ...r, provider: provider.name, tier, ...(now && { at: now() }) });
    } catch (e) {
      logger?.error(
        { err: e, purpose: r.purpose, model: r.model },
        'could not write the ai_calls row',
      );
    }
  };

  // The adapter retries a 500/503 once by itself. It tells us about the attempt that failed, so the
  // ledger (and the daily cap that counts its rows) sees every real provider call, not only the last.
  const trackAttempts = <R extends { purpose: LlmPurpose; model: string }>(
    ctx: AiCallContext,
    request: R,
  ) => {
    const pending: Promise<void>[] = [];
    const tracked: R = {
      ...request,
      onFailedAttempt: (code: string) => {
        pending.push(
          write({
            ctx,
            purpose: request.purpose,
            model: request.model,
            status: 'error',
            errorCode: code,
          }),
        );
      },
    };
    return { tracked, settled: () => Promise.all(pending).then(() => undefined) };
  };

  return {
    provider: provider.name,

    async generateJson(ctx, original) {
      const { tracked: request, settled } = trackAttempts(ctx, original);
      try {
        const result = await provider.generateJson(request);
        await settled();
        await write({
          ctx,
          purpose: request.purpose,
          model: request.model,
          usage: result.usage,
          status: 'ok',
        });
        return result;
      } catch (e) {
        await settled();
        const { code, error } = describeFailure(e);
        await write({
          ctx,
          purpose: request.purpose,
          model: request.model,
          status: 'error',
          errorCode: code,
        });
        throw error;
      }
    },

    async streamText(ctx, original) {
      const { tracked: request, settled } = trackAttempts(ctx, original);
      const iterator = provider.streamText(request)[Symbol.asyncIterator]();
      const base = { ctx, purpose: request.purpose, model: request.model };
      let first: IteratorResult<StreamEvent>;
      try {
        first = await iterator.next();
        await settled();
      } catch (e) {
        await settled();
        const { code, error } = describeFailure(e);
        await write({ ...base, status: 'error', errorCode: code });
        throw error;
      }

      async function* rest(): AsyncGenerator<StreamEvent> {
        // Exactly one row per call, written when the outcome is known: done, failed, or abandoned.
        let recorded = false;
        try {
          let step = first;
          while (!step.done) {
            if (step.value.type === 'done') {
              recorded = true;
              await write({ ...base, usage: step.value.usage, status: 'ok' });
            }
            yield step.value;
            step = await iterator.next();
          }
        } catch (e) {
          const { code, error } = describeFailure(e);
          if (!recorded) {
            recorded = true;
            await write({ ...base, status: 'error', errorCode: code });
          }
          throw error;
        } finally {
          if (!recorded) {
            // The consumer stopped early (learner left, abort): the provider call still happened.
            await write({ ...base, status: 'error', errorCode: 'ABORTED' });
            await iterator.return?.();
          }
        }
      }
      return rest();
    },
  };
}
