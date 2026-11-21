import { sql } from 'drizzle-orm';
import { Router } from 'express';

import type { AiStatus } from '../ai-status.ts';
import type { Database } from '../db/client.ts';

import { version } from './version.ts';

export interface HealthDeps {
  db: Pick<Database, 'execute'>;
  ai: AiStatus;
  timeoutMs?: number;
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
export function createHealthRouter({ db, ai, timeoutMs = 1000 }: HealthDeps): Router {
  const router = Router();
  router.get('/health', async (req, res) => {
    const dbOk = await pingWithin(db, timeoutMs);
    if (!dbOk) req.log.error('health check: database unreachable');
    res.status(dbOk ? 200 : 503).json({
      status: dbOk ? 'ok' : 'degraded',
      db: dbOk ? 'ok' : 'down',
      ai: { provider: ai.provider, enabled: ai.enabled },
      version,
    });
  });
  return router;
}
