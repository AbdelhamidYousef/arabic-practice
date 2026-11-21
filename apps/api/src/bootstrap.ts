import { createAiRuntime } from './ai/index.ts';
import { createApp } from './app.ts';
import { env } from './config/env.ts';
import { db } from './db/client.ts';
import { createLogger } from './lib/logger.ts';

/**
 * Everything the API needs before it can answer a request: config, logger and the Express app.
 * Shared by the long-running server (index.ts) and, later, the serverless entry (vercel.ts); only
 * what happens around it differs (listen vs. one request at a time).
 */
export function bootstrap() {
  const logger = createLogger({ level: env.LOG_LEVEL, pretty: env.NODE_ENV === 'development' });
  const app = createApp({
    logger,
    db,
    ai: createAiRuntime(env, db, logger),
    config: {
      nodeEnv: env.NODE_ENV,
      webOrigin: env.WEB_ORIGIN,
      rateLimit: { windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX },
      authRateLimit: { windowMs: env.RATE_LIMIT_AUTH_WINDOW_MS, limit: env.RATE_LIMIT_AUTH_MAX },
      invitesEnabled: env.INVITES_ENABLED,
      conversationsPerDay: {
        guest: env.CONVERSATIONS_PER_DAY_GUEST,
        learner: env.CONVERSATIONS_PER_DAY_LEARNER,
      },
    },
  });
  return { app, logger };
}
