import cookieParser from 'cookie-parser';
import express from 'express';
import { pino } from 'pino';
import { pinoHttp } from 'pino-http';
import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { db } from '../db/client.ts';
import { sessions } from '../db/schema/index.ts';
import { SESSION_TTL_MS } from '../lib/cookies.ts';
import { createSession } from '../modules/auth/sessions.ts';
import { createUser } from '../test/factories.ts';
import { errorOf, setCookieLine } from '../test/http.ts';

import { createAttachUser, forbidReadOnly, requireRole, requireUser } from './auth.ts';
import { createErrorHandler } from './error.ts';

// A tiny app that exercises the middleware on its own routes; the real teacher routes arrive later.
function miniApp() {
  const app = express();
  app.use(pinoHttp({ logger: pino({ level: 'silent' }) }));
  app.use(cookieParser());
  app.use(createAttachUser({ secureCookies: false }));
  app.get('/user', requireUser, (req, res) => void res.json({ id: req.user?.id }));
  app.get('/teacher', requireRole('teacher'), (_req, res) => void res.json({ ok: true }));
  app.post('/teacher/lessons', requireRole('teacher'), forbidReadOnly, (_req, res) => {
    res.status(201).json({ ok: true });
  });
  app.use(createErrorHandler({ isProduction: false }));
  return app;
}

const asUser = async (overrides: Parameters<typeof createUser>[0] = {}) => {
  const user = await createUser(overrides);
  const { token } = await createSession(user.id);
  return { user, cookie: `sid=${token}` };
};

describe('requireUser', () => {
  it('answers 401 without a cookie or with a junk cookie', async () => {
    const app = miniApp();
    expect((await request(app).get('/user')).status).toBe(401);
    const res = await request(app).get('/user').set('Cookie', 'sid=nonsense');
    expect(errorOf(res).code).toBe('UNAUTHENTICATED');
  });

  it('lets a signed-in user through', async () => {
    const { user, cookie } = await asUser();
    const res = await request(miniApp()).get('/user').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: user.id });
  });

  it('refreshes the cookie when the session slides', async () => {
    const { cookie } = await asUser();
    await db
      .update(sessions)
      .set({ expiresAt: new Date(Date.now() + SESSION_TTL_MS - 3 * 86400000) });
    const res = await request(miniApp()).get('/user').set('Cookie', cookie);
    expect(setCookieLine(res, 'sid')).toContain('HttpOnly');
  });
});

describe('requireRole', () => {
  it('401 anonymous, 403 wrong role, 200 right role', async () => {
    const app = miniApp();
    expect((await request(app).get('/teacher')).status).toBe(401);
    const learner = await asUser();
    expect((await request(app).get('/teacher').set('Cookie', learner.cookie)).status).toBe(403);
    const teacher = await asUser({ role: 'teacher' });
    expect((await request(app).get('/teacher').set('Cookie', teacher.cookie)).status).toBe(200);
  });
});

describe('forbidReadOnly', () => {
  it('lets a normal teacher mutate', async () => {
    const teacher = await asUser({ role: 'teacher' });
    const res = await request(miniApp()).post('/teacher/lessons').set('Cookie', teacher.cookie);
    expect(res.status).toBe(201);
  });

  it('refuses the read-only demo teacher with DEMO_READ_ONLY', async () => {
    const demo = await asUser({ role: 'teacher', readOnly: true });
    const app = miniApp();
    expect((await request(app).get('/teacher').set('Cookie', demo.cookie)).status).toBe(200);
    const res = await request(app).post('/teacher/lessons').set('Cookie', demo.cookie);
    expect(res.status).toBe(403);
    expect(errorOf(res).code).toBe('DEMO_READ_ONLY');
  });
});
