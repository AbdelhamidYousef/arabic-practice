import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import helmet from 'helmet';
import type { Logger } from 'pino';
import { pinoHttp } from 'pino-http';

import type { AiRuntime } from './ai/index.ts';
import type { Database } from './db/client.ts';
import { createHealthRouter } from './lib/health.ts';
import { createAttachUser } from './middleware/auth.ts';
import { createCsrfCheck } from './middleware/csrf.ts';
import { createErrorHandler, notFoundHandler } from './middleware/error.ts';
import { createRateLimiter, type RateLimitOptions } from './middleware/rate-limit.ts';
import { requestId } from './middleware/request-id.ts';
import { createAuthRouter } from './modules/auth/router.ts';
import { createLessonsRouter } from './modules/lessons/router.ts';
import { createPracticeRouter } from './modules/practice/router.ts';
import { createProgressRouter } from './modules/progress/router.ts';
import { createReviewRouter } from './modules/review/router.ts';
import { createTeacherRouter } from './modules/teacher/router.ts';

export interface AppConfig {
  nodeEnv: 'development' | 'test' | 'production';
  webOrigin: string;
  /** General limit per client IP; stricter limits are applied per route by the auth module. */
  rateLimit: RateLimitOptions;
  /** Stricter limit per IP + email on login and register. */
  authRateLimit: RateLimitOptions;
  /** Guest sign-ins per IP (defaults to 10 per hour); tests lower it. */
  guestRateLimit?: RateLimitOptions;
  /** Invite sign-up switch (INVITES_ENABLED); registration answers 403 INVITES_CLOSED while off. */
  invitesEnabled: boolean;
  /** Chat turns and glosses per learner (defaults to 10 per minute); tests lower it. */
  turnRateLimit?: RateLimitOptions;
  /** New conversations per user per UTC day (defaults 10 for a guest, 40 for a learner). */
  conversationsPerDay?: { guest: number; learner: number };
}

export interface AppDeps {
  logger: Logger;
  /** The database handle; tests can pass one that fails to exercise an outage. */
  db: Pick<Database, 'execute'>;
  /** The AI layer: status for /health plus the guarded, recorded gateway routes call. Tests inject the fake. */
  ai: AiRuntime;
  // Required (no defaults) so nobody can build a production app with test-grade settings by omission.
  config: AppConfig;
}

// The app is built by a function, not at import time, so tests can create as many isolated
// instances as they like and Supertest can drive one without opening a real port.
export function createApp({ logger, db, ai, config }: AppDeps): Express {
  const app = express();

  app.disable('x-powered-by');
  // `respond()` reads this to decide whether to validate responses (everywhere except production).
  app.set('env', config.nodeEnv);
  // The host terminates TLS and forwards through exactly one proxy: trusting one hop gives the real
  // client IP (rate limiting) and lets Secure cookies work. Trusting more would let clients spoof
  // X-Forwarded-For.
  if (config.nodeEnv === 'production') app.set('trust proxy', 1);

  // First, so every later middleware (and the access log) can rely on req.id.
  app.use(requestId);
  app.use(
    pinoHttp({
      logger,
      // Reuse the id set above instead of letting pino-http mint a second, different one.
      genReqId: (req) => req.id,
    }),
  );
  app.use(helmet());
  app.use(createRateLimiter(config.rateLimit));
  // Sessions are random ids kept in the database, so the cookie needs no signing secret.
  app.use(cookieParser());
  // 16 kB is far above any legitimate request here (a chat turn is at most 500 characters); it caps
  // the memory a hostile body can cost.
  app.use(express.json({ limit: '16kb' }));
  // Only our own web origin may change anything; see middleware/csrf.ts.
  app.use(createCsrfCheck({ webOrigin: config.webOrigin }));

  // After the body parsers and the Origin check, before any route that needs to know who is calling.
  app.use(createAttachUser({ secureCookies: config.nodeEnv === 'production' }));

  app.use('/api/v1', createHealthRouter({ db, ai }));
  app.use(
    '/api/v1',
    createAuthRouter({
      secureCookies: config.nodeEnv === 'production',
      authRateLimit: config.authRateLimit,
      invitesEnabled: config.invitesEnabled,
      guestRateLimit: config.guestRateLimit,
    }),
  );

  app.use('/api/v1', createLessonsRouter());
  app.use('/api/v1', createProgressRouter());
  app.use('/api/v1', createReviewRouter());
  app.use('/api/v1', createTeacherRouter());
  app.use(
    '/api/v1',
    createPracticeRouter({
      ai,
      turnRateLimit: config.turnRateLimit ?? { windowMs: 60_000, limit: 10 },
      conversationsPerDay: config.conversationsPerDay ?? { guest: 10, learner: 40 },
    }),
  );

  // Order matters: unknown routes first, then the error handler that catches everything above.
  app.use(notFoundHandler);
  app.use(createErrorHandler({ isProduction: config.nodeEnv === 'production' }));

  return app;
}
