import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { sessions, users } from '../../db/schema/index.ts';
import { hash, verify } from '../../lib/password.ts';
import { makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import { createDemoTeacher, createUser } from '../../test/factories.ts';
import { errorOf } from '../../test/http.ts';

import { createSession, loadSession } from './sessions.ts';

const OLD = 'correct horse battery staple';
const NEW = 'a brand new passphrase';
const app = makeTestApp();
const { post } = api(app);

async function withPassword() {
  const user = await createUser({ passwordHash: await hash(OLD) });
  const { token } = await createSession(user.id);
  return { user, token, cookie: `sid=${token}` };
}

describe('POST /auth/password', () => {
  it('changes the password, keeps this session and ends the others', async () => {
    const { user, token, cookie } = await withPassword();
    const other = await createSession(user.id);
    const bystander = await signedIn();

    const res = await post('/auth/password', { currentPassword: OLD, newPassword: NEW }, cookie);
    expect(res.status).toBe(204);

    const [row] = await db.select().from(users).where(eq(users.id, user.id));
    expect(await verify(row?.passwordHash ?? '', NEW)).toBe(true);
    expect(await verify(row?.passwordHash ?? '', OLD)).toBe(false);
    expect(await loadSession(token)).not.toBeNull();
    expect(await loadSession(other.token)).toBeNull();
    // Someone else's session is untouched.
    expect(await loadSession(bystander.token)).not.toBeNull();
  });

  it('can log in with the new password afterwards, and no longer with the old one', async () => {
    const { user, cookie } = await withPassword();
    await post('/auth/password', { currentPassword: OLD, newPassword: NEW }, cookie);
    const login = await post('/auth/login', { email: user.email, password: NEW });
    expect(login.status).toBe(200);
    expect((await post('/auth/login', { email: user.email, password: OLD })).status).toBe(401);
  });

  it('refuses a wrong current password with WRONG_PASSWORD (403, not a sign-out)', async () => {
    const { user, cookie } = await withPassword();
    const other = await createSession(user.id);
    const res = await post(
      '/auth/password',
      { currentPassword: 'not the password', newPassword: NEW },
      cookie,
    );
    expect(res.status).toBe(403);
    expect(errorOf(res).code).toBe('WRONG_PASSWORD');
    const [row] = await db.select().from(users).where(eq(users.id, user.id));
    expect(await verify(row?.passwordHash ?? '', OLD)).toBe(true);
    expect(await loadSession(other.token)).not.toBeNull();
  });

  it('refuses a weak or common new password', async () => {
    const { cookie } = await withPassword();
    const short = await post(
      '/auth/password',
      { currentPassword: OLD, newPassword: 'short' },
      cookie,
    );
    expect(short.status).toBe(400);
    const common = await post(
      '/auth/password',
      { currentPassword: OLD, newPassword: 'password123' },
      cookie,
    );
    expect(common.status).toBe(400);
  });

  it('needs a signed-in user, and refuses guests and the read-only demo teacher', async () => {
    const anon = await post('/auth/password', { currentPassword: OLD, newPassword: NEW });
    expect(anon.status).toBe(401);

    const guest = await signedIn({ isGuest: true, email: null, passwordHash: null });
    const g = await post(
      '/auth/password',
      { currentPassword: OLD, newPassword: NEW },
      guest.cookie,
    );
    expect(g.status).toBe(403);

    const demo = await createDemoTeacher();
    const { token } = await createSession(demo.id);
    const d = await post(
      '/auth/password',
      { currentPassword: OLD, newPassword: NEW },
      `sid=${token}`,
    );
    expect(errorOf(d).code).toBe('DEMO_READ_ONLY');
  });

  it('is rate limited per user', async () => {
    const limited = makeTestApp({ config: { authRateLimit: { windowMs: 60_000, limit: 2 } } });
    const { cookie } = await withPassword();
    const attempt = () =>
      api(limited).post(
        '/auth/password',
        { currentPassword: 'wrong wrong wrong', newPassword: NEW },
        cookie,
      );
    expect((await attempt()).status).toBe(403);
    expect((await attempt()).status).toBe(403);
    expect((await attempt()).status).toBe(429);
    expect(await db.select().from(sessions)).toHaveLength(1);
  });
});
