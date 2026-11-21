import { pino, type Logger } from 'pino';

import { createApp, type AppConfig } from '../app.ts';
import { db } from '../db/client.ts';
import type { Database } from '../db/client.ts';

export const TEST_ORIGIN = 'http://localhost:5175';

// One way to build the app in tests: silent logger, the real test database, the fake AI status and
// the same origin every test sends. Tests override only what they are about.
export function makeTestApp(
  opts: {
    logger?: Logger;
    config?: Partial<AppConfig>;
    db?: Pick<Database, 'execute'>;
    ai?: { provider: string; enabled: boolean };
  } = {},
) {
  return createApp({
    logger: opts.logger ?? pino({ level: 'silent' }),
    db: opts.db ?? db,
    ai: opts.ai ?? { provider: 'fake', enabled: true },
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
