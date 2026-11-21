import request from 'supertest';
import { describe, expect, it } from 'vitest';

import type { Database } from './db/client.ts';
import { makeTestApp } from './test/app.ts';
import { bodyOf, errorOf } from './test/http.ts';

describe('createApp', () => {
  it('does not advertise the framework', async () => {
    const res = await request(makeTestApp()).get('/api/v1/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
  });

  it('answers an unknown route with the JSON error envelope', async () => {
    const res = await request(makeTestApp()).get('/api/v1/no-such-route');
    expect(res.status).toBe(404);
    expect(errorOf(res)).toMatchObject({ code: 'NOT_FOUND' });
  });

  it('builds independent instances', async () => {
    const a = makeTestApp({ ai: { provider: 'fake', enabled: true } });
    const b = makeTestApp({ ai: { provider: 'gemini', enabled: false } });
    expect(
      bodyOf<{ ai: { provider: string } }>(await request(a).get('/api/v1/health')).ai.provider,
    ).toBe('fake');
    expect(
      bodyOf<{ ai: { provider: string } }>(await request(b).get('/api/v1/health')).ai.provider,
    ).toBe('gemini');
  });
});

// Kept here until step 2.3 moves them next to the health router.
describe('health endpoint', () => {
  it('answers 200 with status ok', async () => {
    const res = await request(makeTestApp()).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(bodyOf(res)).toMatchObject({ status: 'ok' });
  });

  it('reports 503 when the database does not answer', async () => {
    const broken = {
      execute: () => Promise.reject(new Error('connection refused')),
    } as unknown as Database;
    const res = await request(makeTestApp({ db: broken })).get('/api/v1/health');
    expect(res.status).toBe(503);
  });
});
