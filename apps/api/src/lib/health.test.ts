import express from 'express';
import { pino } from 'pino';
import { pinoHttp } from 'pino-http';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import type { Database } from '../db/client.ts';
import { makeTestApp } from '../test/app.ts';
import { bodyOf } from '../test/http.ts';

import { createHealthRouter } from './health.ts';

interface HealthBody {
  status: string;
  db: string;
  ai: { provider: string; enabled: boolean };
  version: string;
}

// Stand-ins for a broken database: only `execute` is ever called by the health check.
const failing = {
  execute: () => Promise.reject(new Error('connection refused')),
} as unknown as Database;
const hanging = { execute: () => new Promise(() => undefined) } as unknown as Database;

describe('health probe cache', () => {
  function countingDb(ok = true) {
    const db = {
      calls: 0,
      execute() {
        db.calls += 1;
        return ok ? Promise.resolve([]) : Promise.reject(new Error('down'));
      },
    };
    return db;
  }
  const appFor = (db: ReturnType<typeof countingDb>, clock: () => number) => {
    const app = express();
    app.use(pinoHttp({ logger: pino({ level: 'silent' }) }));
    app.use(
      '/api/v1',
      createHealthRouter({
        db: db as unknown as Database,
        ai: { provider: 'fake', enabled: true },
        now: clock,
      }),
    );
    return app;
  };

  it('hits the database once for many requests inside 5 seconds, then probes again', async () => {
    const db = countingDb();
    let t = 1_000;
    const app = appFor(db, () => t);
    const results = await Promise.all(
      Array.from({ length: 20 }, () => request(app).get('/api/v1/health')),
    );
    expect(results.every((r) => r.status === 200)).toBe(true);
    expect(db.calls).toBe(1);
    t += 4_999;
    await request(app).get('/api/v1/health');
    expect(db.calls).toBe(1);
    t += 1;
    await request(app).get('/api/v1/health');
    expect(db.calls).toBe(2);
  });

  it('caches an outage too, and recovers on the next probe', async () => {
    const db = countingDb(false);
    let t = 0;
    const app = appFor(db, () => t);
    expect((await request(app).get('/api/v1/health')).status).toBe(503);
    expect((await request(app).get('/api/v1/health')).status).toBe(503);
    expect(db.calls).toBe(1);
    t += 5_000;
    await request(app).get('/api/v1/health');
    expect(db.calls).toBe(2);
  });
});

describe('GET /api/v1/health', () => {
  it('reports ok, the database and the ai provider when everything works', async () => {
    const res = await request(makeTestApp()).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(bodyOf<HealthBody>(res)).toMatchObject({
      status: 'ok',
      db: 'ok',
      ai: { provider: 'fake', enabled: true },
    });
    expect(bodyOf<HealthBody>(res).version).toMatch(/^\d+\.\d+\.\d+/);
  });

  it('reports whether AI is switched on and which adapter is configured', async () => {
    const res = await request(makeTestApp({ ai: { provider: 'gemini', enabled: false } })).get(
      '/api/v1/health',
    );
    expect(bodyOf<HealthBody>(res).ai).toEqual({ provider: 'gemini', enabled: false });
  });

  it('answers 503 degraded, still with the ai block, when the database fails', async () => {
    const res = await request(makeTestApp({ db: failing })).get('/api/v1/health');
    expect(res.status).toBe(503);
    expect(bodyOf<HealthBody>(res)).toMatchObject({
      status: 'degraded',
      db: 'down',
      ai: { provider: 'fake' },
    });
    expect(JSON.stringify(res.body)).not.toContain('connection refused');
  });

  it('answers 503 quickly when the database hangs instead of hanging itself', async () => {
    const started = Date.now();
    const res = await request(makeTestApp({ db: hanging })).get('/api/v1/health');
    expect(res.status).toBe(503);
    expect(Date.now() - started).toBeLessThan(3000);
  });

  it('is never rate limited, so a probe cannot see a false outage', async () => {
    const app = makeTestApp({ config: { rateLimit: { windowMs: 60_000, limit: 1 } } });
    for (let i = 0; i < 4; i++) {
      expect((await request(app).get('/api/v1/health')).status).toBe(200);
    }
  });

  it('carries a request id for correlating with the logs', async () => {
    const res = await request(makeTestApp()).get('/api/v1/health');
    expect(res.headers['x-request-id']).toBeTruthy();
  });
});
