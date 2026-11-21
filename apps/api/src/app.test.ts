import request from 'supertest';
import { describe, expect, it } from 'vitest';

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
