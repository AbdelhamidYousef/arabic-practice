import { pino, type Logger } from 'pino';

import { FakeProvider } from '../ai/fake.ts';
import type { AiRuntime } from '../ai/index.ts';
import { wrapProvider } from '../ai/index.ts';
import { createApp, type AppConfig } from '../app.ts';
import { db } from '../db/client.ts';
import type { Database } from '../db/client.ts';

export const TEST_ORIGIN = 'http://localhost:5175';

// The AI layer for tests: the real ledger and budget guard over the fake provider and the test
// database, so tests exercise the same wrapping production uses. Keep the `fake` to inject faults
// (`fake.failNext()`) and pass `runtime` to makeTestApp as `ai`.
export function makeTestAi(
  limits: Partial<{
    AI_ENABLED: boolean;
    AI_DAILY_TURNS_LEARNER: number;
    AI_DAILY_TURNS_GUEST: number;
    AI_DAILY_CALLS_PER_MODEL: number;
  }> = {},
) {
  const fake = new FakeProvider();
  const env = {
    AI_TIER: 'free' as const,
    AI_ENABLED: true,
    AI_DAILY_TURNS_LEARNER: 60,
    AI_DAILY_TURNS_GUEST: 20,
    AI_DAILY_CALLS_PER_MODEL: 450,
    AI_MONTHLY_BUDGET_USD: 0,
    ...limits,
  };
  const runtime: AiRuntime = {
    provider: 'fake',
    enabled: env.AI_ENABLED,
    models: {
      correction: 'fake-correction',
      reply: 'fake-reply',
      gloss: 'fake-gloss',
    },
    gateway: wrapProvider(fake, env, db),
  };
  return { fake, runtime };
}

// One way to build the app in tests: silent logger, the real test database, the fake AI and the
// same origin every test sends. Tests override only what they are about.
export function makeTestApp(
  opts: {
    logger?: Logger;
    config?: Partial<AppConfig>;
    db?: Pick<Database, 'execute'>;
    /** Replace the whole AI runtime, or just the status fields shown by /health. */
    ai?: AiRuntime | Partial<Pick<AiRuntime, 'provider' | 'enabled'>>;
  } = {},
) {
  const base = makeTestAi().runtime;
  return createApp({
    logger: opts.logger ?? pino({ level: 'silent' }),
    db: opts.db ?? db,
    ai: { ...base, ...opts.ai },
    config: {
      nodeEnv: 'test',
      webOrigin: TEST_ORIGIN,
      // Too high to trip by accident; the rate-limit tests override it.
      rateLimit: { windowMs: 60_000, limit: 100_000 },
      authRateLimit: { windowMs: 60_000, limit: 100_000 },
      invitesEnabled: false,
      ...opts.config,
    },
  });
}
