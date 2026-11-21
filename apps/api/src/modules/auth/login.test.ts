import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { sessions } from '../../db/schema/index.ts';
import { hash } from '../../lib/password.ts';
import { makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import { createUser } from '../../test/factories.ts';
import { bodyOf, cookieValue, errorOf, setCookieLine } from '../../test/http.ts';

import { sha256 } from './sessions.ts';

const PASSWORD = 'correct horse battery staple';
const app = makeTestApp();
const { get, post } = api(app);

async function learnerWithPassword(email = 'ada@arabic-practice.test') {
  return createUser({ email, passwordHash: await hash(PASSWORD), displayName: 'Ada Test' });
}

describe('POST /auth/login', () => {
  it('signs in, returns the user DTO and sets a hardened cookie holding a hashed session', async () => {
    const user = await learnerWithPassword();
    const res = await post('/auth/login', {
      email: ' ADA@arabic-practice.test ',
      password: PASSWORD,
    });

    expect(res.status).toBe(200);
    expect(bodyOf(res)).toEqual({
      user: {
        id: user.id,
        displayName: 'Ada Test',
        role: 'learner',
        level: 'A1',
        isGuest: false,
        readOnly: false,
        email: 'ada@arabic-practice.test',
      },
    });
    expect(JSON.stringify(res.body)).not.toMatch(/argon2|passwordHash|teacherId/);

    const line = setCookieLine(res, 'sid') ?? '';
    expect(line).toContain('HttpOnly');
    expect(line).toContain('SameSite=Lax');
    expect(line).toContain('Path=/');
    expect(line).not.toContain('Secure');
    const token = cookieValue(res, 'sid') ?? '';
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    const rows = await db
      .select()
      .from(sessions)
      .where(eq(sessions.idHash, sha256(token)));
    expect(rows).toHaveLength(1);
  });

  it('marks the cookie Secure in production', async () => {
    await learnerWithPassword();
    const prod = makeTestApp({ config: { nodeEnv: 'production' } });
    const res = await api(prod)
      .post('/auth/login', { email: 'ada@arabic-practice.test', password: PASSWORD })
      .set('Origin', 'http://localhost:5175')
      .set('X-Forwarded-Proto', 'https');
    expect(setCookieLine(res, 'sid')).toContain('Secure');
  });

  it('gives the same 401 for a wrong password and an unknown email', async () => {
    await learnerWithPassword();
    const wrong = await post('/auth/login', {
      email: 'ada@arabic-practice.test',
      password: 'nope',
    });
    const unknown = await post('/auth/login', {
      email: 'ghost@arabic-practice.test',
      password: PASSWORD,
    });
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(errorOf(wrong)).toEqual(errorOf(unknown));
    expect(setCookieLine(wrong, 'sid')).toBeUndefined();
  });

  it('refuses an account that has no usable password (a guest-like or demo row)', async () => {
    await createUser({ email: 'demo@arabic-practice.test', passwordHash: '!unusable:x' });
    const res = await post('/auth/login', {
      email: 'demo@arabic-practice.test',
      password: '!unusable:x',
    });
    expect(res.status).toBe(401);
  });

  it('rejects malformed input with 400', async () => {
    expect((await post('/auth/login', {})).status).toBe(400);
    expect((await post('/auth/login', { email: 'not-an-email', password: 'x' })).status).toBe(400);
    expect(
      (await post('/auth/login', { email: 'a@b.test', password: 'x'.repeat(201) })).status,
    ).toBe(400);
  });

  it('refuses a cross-origin attempt', async () => {
    const res = await api(app)
      .post('/auth/login', { email: 'a@b.test', password: 'x' })
      .set('Origin', 'https://evil.example');
    expect(res.status).toBe(403);
  });

  it('replaces the session that arrived with the request (fixation)', async () => {
    await learnerWithPassword();
    const old = await signedIn();
    const res = await post(
      '/auth/login',
      { email: 'ada@arabic-practice.test', password: PASSWORD },
      old.cookie,
    );
    expect(cookieValue(res, 'sid')).not.toBe(old.token);
    const left = await db
      .select()
      .from(sessions)
      .where(eq(sessions.idHash, sha256(old.token)));
    expect(left).toHaveLength(0);
  });

  it('rate-limits per IP and email, but not other emails', async () => {
    const limited = makeTestApp({ config: { authRateLimit: { windowMs: 60_000, limit: 2 } } });
    const { post: p } = api(limited);
    const body = { email: 'ada@arabic-practice.test', password: 'wrong' };
    expect((await p('/auth/login', body)).status).toBe(401);
    expect((await p('/auth/login', body)).status).toBe(401);
    const third = await p('/auth/login', body);
    expect(third.status).toBe(429);
    expect(errorOf(third).code).toBe('RATE_LIMITED');
    expect((await p('/auth/login', { ...body, email: 'other@arabic-practice.test' })).status).toBe(
      401,
    );
  });
});

describe('POST /auth/logout', () => {
  it('deletes the session, clears the cookie and answers 204', async () => {
    const { token, cookie } = await signedIn();
    const res = await post('/auth/logout', {}, cookie);
    expect(res.status).toBe(204);
    expect(setCookieLine(res, 'sid')).toMatch(/sid=;/);
    expect(
      await db
        .select()
        .from(sessions)
        .where(eq(sessions.idHash, sha256(token))),
    ).toHaveLength(0);
    expect((await get('/auth/me', cookie)).status).toBe(401);
  });

  it('is idempotent for an anonymous caller', async () => {
    expect((await post('/auth/logout')).status).toBe(204);
  });
});

describe('GET /auth/me', () => {
  it('returns the signed-in user and never a password hash', async () => {
    const { user, cookie } = await signedIn({ displayName: 'Mina', level: 'B2' });
    const res = await get('/auth/me', cookie);
    expect(res.status).toBe(200);
    expect(bodyOf(res)).toEqual({
      user: {
        id: user.id,
        displayName: 'Mina',
        role: 'learner',
        level: 'B2',
        isGuest: false,
        readOnly: false,
        email: user.email,
      },
    });
    expect(res.headers['cache-control']).toBe('no-store');
  });

  it('answers 401 without a session and with an expired one', async () => {
    expect((await get('/auth/me')).status).toBe(401);
    const { cookie } = await signedIn();
    await db.update(sessions).set({ expiresAt: new Date(Date.now() - 1000) });
    expect((await get('/auth/me', cookie)).status).toBe(401);
  });
});
