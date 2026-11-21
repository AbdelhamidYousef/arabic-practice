import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { aiCalls } from '../../db/schema/index.ts';
import { makeTestApp } from '../../test/app.ts';
import { api } from '../../test/auth.ts';

describe('POST /test/reset-limits', () => {
  it('clears today’s ai_calls rows when NODE_ENV=test', async () => {
    await db.insert(aiCalls).values({
      purpose: 'reply',
      provider: 'fake',
      model: 'fake-reply',
      status: 'ok',
    });
    const res = await api(makeTestApp()).post('/test/reset-limits');

    expect(res.status).toBe(204);
    expect(await db.select().from(aiCalls)).toHaveLength(0);
  });

  it('does not exist outside NODE_ENV=test', async () => {
    const app = makeTestApp({ config: { nodeEnv: 'development' } });
    const res = await api(app).post('/test/reset-limits');

    expect(res.status).toBe(404);
  });
});
