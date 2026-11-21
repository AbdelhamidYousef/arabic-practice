import { sql } from 'drizzle-orm';
import { Router as ExpressRouter, type Router } from 'express';

import type { Database } from '../../db/client.ts';

// Helpers for the e2e suite. createApp mounts this router ONLY when NODE_ENV=test, so none of it
// exists in development or production.
export function createTestRouter({ db }: { db: Pick<Database, 'execute'> }): Router {
  const router = ExpressRouter();

  // Clears today's AI usage rows, so the daily caps start from zero and one e2e run can use as
  // many turns as it needs.
  router.post('/test/reset-limits', async (_req, res) => {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    await db.execute(sql`delete from ai_calls where created_at >= ${startOfDay.toISOString()}`);
    res.status(204).end();
  });

  return router;
}
