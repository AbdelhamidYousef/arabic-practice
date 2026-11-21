import { sql } from 'drizzle-orm';
import { Router } from 'express';

import type { AiStatus } from '../ai-status.ts';
import type { Database } from '../db/client.ts';

import { version } from './version.ts';

export interface HealthDeps {
  db: Pick<Database, 'execute'>;
  ai: AiStatus;
  timeoutMs?: number;
  /** How long a probe result is reused (default 5 s). */
  cacheMs?: number;
  /** Test hook: the clock the cache reads. */
  now?: () => number;
}

// A hung database must not hang the health endpoint too: the platform's probe would time out
// with no information. Racing against a timer turns "stuck" into a clean, fast "down".
async function pingWithin(db: HealthDeps['db'], ms: number): Promise<boolean> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('db ping timed out')), ms);
  });
  try {
    await Promise.race([db.execute(sql`select 1`), timeout]);
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

// 503 (not 200) when the DB is down, so load balancers and uptime monitors that only look at the
// status code take the instance out of rotation. The AI block is always reported: it is
// configuration, not a dependency check, and says nothing a visitor could abuse.
//
// The probe result is kept for a few seconds (and shared by requests that arrive while it runs):
// /health is public and never rate limited, so without this anyone could turn it into a stream of
// queries against the database. Uptime monitors poll far less often than every 5 seconds.
export function createHealthRouter({
  db,
  ai,
  timeoutMs = 1000,
  cacheMs = 5000,
  now = Date.now,
}: HealthDeps): Router {
  const router = Router();
  let cached: { at: number; result: Promise<boolean> } | undefined;
  router.get('/health', async (req, res) => {
    if (!cached || now() - cached.at >= cacheMs) {
      const probe = pingWithin(db, timeoutMs);
      cached = { at: now(), result: probe };
      void probe.then((ok) => {
        if (!ok) req.log.error('health check: database unreachable');
      });
    }
    const dbOk = await cached.result;
    res.status(dbOk ? 200 : 503).json({
      status: dbOk ? 'ok' : 'degraded',
      db: dbOk ? 'ok' : 'down',
      ai: { provider: ai.provider, enabled: ai.enabled },
      version,
    });
  });
  return router;
}
