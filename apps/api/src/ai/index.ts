import type { Logger } from 'pino';

import type { AiStatus } from '../ai-status.ts';
import { resolveAiProvider } from '../config/ai-provider.ts';
import type { Env } from '../config/env.ts';
import type { Database } from '../db/client.ts';

import { createGuardedGateway } from './budget.ts';
import { FakeProvider } from './fake.ts';
import { GeminiProvider } from './gemini.ts';
import type { LlmProvider } from './provider.ts';
import { createLedgeredGateway, type LlmGateway } from './usage.ts';

/** The model used for each job; a cheaper model can answer the simple ones. */
export interface AiModels {
  correction: string;
  reply: string;
  gloss: string;
}

/**
 * Everything a route needs from the AI layer, and the only AI thing `createApp` receives:
 * the status for /health, the gateway to call (already guarded and recorded), and the model names.
 */
export interface AiRuntime extends AiStatus {
  gateway: LlmGateway;
  models: AiModels;
}

type AiEnv = Pick<
  Env,
  | 'NODE_ENV'
  | 'AI_PROVIDER'
  | 'GEMINI_API_KEY'
  | 'AI_TIER'
  | 'AI_ENABLED'
  | 'AI_MODEL_CORRECTION'
  | 'AI_MODEL_REPLY'
  | 'AI_MODEL_GLOSS'
  | 'AI_DAILY_TURNS_LEARNER'
  | 'AI_DAILY_TURNS_GUEST'
  | 'AI_DAILY_GLOSS_LEARNER'
  | 'AI_DAILY_GLOSS_GUEST'
  | 'AI_DAILY_CALLS_PER_MODEL'
  | 'AI_MONTHLY_BUDGET_USD'
>;

/**
 * Picks the provider from config (explicit AI_PROVIDER, else `fake` under NODE_ENV=test, else
 * `gemini` when a key exists; see config/ai-provider.ts) and wraps it: provider -> usage ledger ->
 * budget guard. A laptop without a key falls back to the fake, loudly, so nobody mistakes canned
 * replies for the real model.
 */
export function createAiRuntime(
  env: AiEnv,
  db: Pick<Database, 'select' | 'insert' | 'update' | 'transaction'>,
  logger?: Logger,
): AiRuntime {
  const name = resolveAiProvider(env);
  let provider: LlmProvider;
  if (name === 'gemini' && env.GEMINI_API_KEY) {
    provider = new GeminiProvider({ apiKey: env.GEMINI_API_KEY });
  } else {
    provider = new FakeProvider();
    if (env.NODE_ENV !== 'test' && !env.AI_PROVIDER) {
      logger?.warn(
        'AI: no GEMINI_API_KEY set, using the FAKE provider: replies are canned, not from a model',
      );
    }
  }
  return {
    provider: provider.name,
    enabled: env.AI_ENABLED,
    models: {
      correction: env.AI_MODEL_CORRECTION,
      reply: env.AI_MODEL_REPLY,
      gloss: env.AI_MODEL_GLOSS,
    },
    gateway: wrapProvider(provider, env, db, logger),
  };
}

export function wrapProvider(
  provider: LlmProvider,
  env: Pick<
    AiEnv,
    | 'AI_TIER'
    | 'AI_ENABLED'
    | 'AI_DAILY_TURNS_LEARNER'
    | 'AI_DAILY_TURNS_GUEST'
    | 'AI_DAILY_GLOSS_LEARNER'
    | 'AI_DAILY_GLOSS_GUEST'
    | 'AI_DAILY_CALLS_PER_MODEL'
    | 'AI_MONTHLY_BUDGET_USD'
  >,
  db: Pick<Database, 'select' | 'insert' | 'update' | 'transaction'>,
  logger?: Logger,
): LlmGateway {
  const inner = createLedgeredGateway({
    provider,
    db,
    tier: env.AI_TIER,
    ...(logger && { logger }),
  });
  return createGuardedGateway({
    inner,
    db,
    limits: {
      enabled: env.AI_ENABLED,
      tier: env.AI_TIER,
      turnsPerLearnerPerDay: env.AI_DAILY_TURNS_LEARNER,
      turnsPerGuestPerDay: env.AI_DAILY_TURNS_GUEST,
      glossPerLearnerPerDay: env.AI_DAILY_GLOSS_LEARNER,
      glossPerGuestPerDay: env.AI_DAILY_GLOSS_GUEST,
      callsPerModelPerDay: env.AI_DAILY_CALLS_PER_MODEL,
      monthlyBudgetUsd: env.AI_MONTHLY_BUDGET_USD,
    },
  });
}
