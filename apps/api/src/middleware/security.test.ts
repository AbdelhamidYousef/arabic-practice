import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { makeTestApp, TEST_ORIGIN } from '../test/app.ts';
import { bodyOf, errorOf } from '../test/http.ts';

import { createCsrfCheck } from './csrf.ts';
import { createAuthRateLimiter, createIpRateLimiter } from './rate-limit.ts';

describe('security headers', () => {
  it('sets helmet headers and hides x-powered-by', async () => {
    const res = await request(makeTestApp()).get('/api/v1/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['strict-transport-security']).toBeDefined();
    expect(res.headers['content-security-policy']).toBeDefined();
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
  });
});

describe('Origin check (CSRF)', () => {
  const app = makeTestApp();

  it('blocks a mutating request from a foreign origin with 403', async () => {
    const res = await request(app).post('/api/v1/anything').set('Origin', 'https://evil.example');
    expect(res.status).toBe(403);
    expect(errorOf(res).code).toBe('FORBIDDEN');
  });

  it('blocks a mutating request with neither Origin nor Referer', async () => {
    const res = await request(app).post('/api/v1/anything');
    expect(res.status).toBe(403);
  });

  it('accepts a matching Origin (then 404s, since the route does not exist)', async () => {
    const res = await request(app).post('/api/v1/anything').set('Origin', TEST_ORIGIN);
    expect(res.status).toBe(404);
  });

  it('falls back to Referer when Origin is absent', async () => {
    const ok = await request(app).post('/api/v1/anything').set('Referer', `${TEST_ORIGIN}/lessons`);
    expect(ok.status).toBe(404);
    const bad = await request(app)
      .post('/api/v1/anything')
      .set('Referer', 'https://evil.example/lessons');
    expect(bad.status).toBe(403);
  });

  it('refuses a lookalike origin (same prefix, different host)', async () => {
    const res = await request(app)
      .post('/api/v1/anything')
      .set('Origin', `${TEST_ORIGIN}.evil.example`);
    expect(res.status).toBe(403);
  });

  it.each(['PUT', 'PATCH', 'DELETE'] as const)('checks %s as well as POST', async (method) => {
    const send = request(app)[method.toLowerCase() as 'put'].bind(request(app));
    const res = await send('/api/v1/anything').set('Origin', 'https://evil.example');
    expect(res.status).toBe(403);
  });

  it('never checks safe methods', async () => {
    const res = await request(app).get('/api/v1/health').set('Origin', 'https://evil.example');
    expect(res.status).toBe(200);
  });

  it('can exempt a prefix for server-to-server routes, and only that prefix', async () => {
    const custom = express();
    custom.use(createCsrfCheck({ webOrigin: TEST_ORIGIN, exemptPrefixes: ['/hooks/'] }));
    custom.post('/hooks/x', (_req, res) => void res.json({ ok: true }));
    custom.post('/other', (_req, res) => void res.json({ ok: true }));
    custom.use(
      (_err: unknown, _req: express.Request, res: express.Response, _n: express.NextFunction) => {
        res.status(403).json({ blocked: true });
      },
    );
    expect((await request(custom).post('/hooks/x')).status).toBe(200);
    expect((await request(custom).post('/other')).status).toBe(403);
  });
});

describe('body limits and parsing', () => {
  const app = makeTestApp();

  it('rejects a body above 16 kB with 413 and the error envelope', async () => {
    const res = await request(app)
      .post('/api/v1/anything')
      .set('Origin', TEST_ORIGIN)
      .send({ blob: 'x'.repeat(17_000) });
    expect(res.status).toBe(413);
    expect(errorOf(res).code).toBe('VALIDATION_ERROR');
  });

  it('accepts a body just under the limit', async () => {
    const res = await request(app)
      .post('/api/v1/anything')
      .set('Origin', TEST_ORIGIN)
      .send({ blob: 'x'.repeat(15_000) });
    expect(res.status).toBe(404);
  });

  it('answers a malformed JSON body with 400 and VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/api/v1/anything')
      .set('Origin', TEST_ORIGIN)
      .set('Content-Type', 'application/json')
      .send('{"broken":');
    expect(res.status).toBe(400);
    expect(errorOf(res).code).toBe('VALIDATION_ERROR');
  });
});

describe('rate limiting', () => {
  it('answers with 429 RATE_LIMITED after the limit and keeps health reachable', async () => {
    const app = makeTestApp({ config: { rateLimit: { windowMs: 60_000, limit: 2 } } });
    await request(app).get('/api/v1/nothing');
    await request(app).get('/api/v1/nothing');
    const res = await request(app).get('/api/v1/nothing');
    expect(res.status).toBe(429);
    expect(errorOf(res).code).toBe('RATE_LIMITED');
    const health = await request(app).get('/api/v1/health');
    expect(health.status).toBe(200);
  });

  it('exposes the standard rate limit headers', async () => {
    const app = makeTestApp({ config: { rateLimit: { windowMs: 60_000, limit: 5 } } });
    const res = await request(app).get('/api/v1/nothing');
    expect(res.headers['ratelimit']).toBeDefined();
    expect(res.headers['x-ratelimit-limit']).toBeUndefined();
  });

  function loginApp(limiter: express.RequestHandler) {
    const app = express();
    app.use(express.json());
    app.post('/login', limiter, (_req, res) => void res.json({ ok: true }));
    app.use(
      (_err: unknown, _req: express.Request, res: express.Response, _n: express.NextFunction) => {
        res.status(429).json({ limited: true });
      },
    );
    return app;
  }

  it('keys the auth limiter by email as well as IP', async () => {
    const app = loginApp(createAuthRateLimiter({ windowMs: 60_000, limit: 1 }));
    const a1 = await request(app).post('/login').send({ email: 'a@x.com' });
    const a2 = await request(app).post('/login').send({ email: 'A@x.com ' });
    const b1 = await request(app).post('/login').send({ email: 'b@x.com' });
    expect(a1.status).toBe(200);
    expect(bodyOf(a2)).toEqual({ limited: true });
    expect(b1.status).toBe(200);
  });

  it('keys the IP limiter by client address only', async () => {
    const app = loginApp(createIpRateLimiter({ windowMs: 60_000, limit: 1 }));
    expect((await request(app).post('/login').send({ email: 'a@x.com' })).status).toBe(200);
    expect((await request(app).post('/login').send({ email: 'b@x.com' })).status).toBe(429);
  });
});
