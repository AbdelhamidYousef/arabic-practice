import express, { type Express } from 'express';
import helmet from 'helmet';
import type { Logger } from 'pino';
import { pinoHttp } from 'pino-http';

import type { AiStatus } from './ai-status.ts';
import type { Database } from './db/client.ts';
import { createHealthRouter } from './lib/health.ts';
import { createErrorHandler, notFoundHandler } from './middleware/error.ts';
import { requestId } from './middleware/request-id.ts';

export interface AppConfig {
  nodeEnv: 'development' | 'test' | 'production';
  webOrigin: string;
}

export interface AppDeps {
  logger: Logger;
  /** The database handle; tests can pass one that fails to exercise an outage. */
  db: Pick<Database, 'execute'>;
  /** Which AI adapter answers and whether it is switched on (the full provider arrives in phase 3). */
  ai: AiStatus;
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

  app.use('/api/v1', createHealthRouter({ db, ai }));

  // Order matters: unknown routes first, then the error handler that catches everything above.
  app.use(notFoundHandler);
  app.use(createErrorHandler({ isProduction: config.nodeEnv === 'production' }));

  return app;
}
