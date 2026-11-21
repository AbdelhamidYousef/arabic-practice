import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { passwordResets, users } from '../../db/schema/index.ts';
import { verify, hash } from '../../lib/password.ts';
import { makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import { createDemoTeacher, createUser } from '../../test/factories.ts';
import { bodyOf, errorOf } from '../../test/http.ts';
import { createSession, loadSession, sha256 } from '../auth/sessions.ts';

const app = makeTestApp();
const { post } = api(app);
const NEW = 'a brand new passphrase';
const NOBODY = '00000000-0000-4000-8000-000000000000';

interface LinkBody {
  resetPath: string;
  expiresAt: string;
}

const teacher = () => signedIn({ role: 'teacher', displayName: 'Ustadh Test' });
const tokenOf = (res: { body: unknown }) =>
  bodyOf<LinkBody>(res as never)
    .resetPath.split('/')
    .pop() ?? '';

describe('POST /teacher/learners/:id/reset-link', () => {
  it('makes a 24 hour link for my learner and stores only the SHA-256 of the token', async () => {
    const t = await teacher();
    const learner = await createUser({ teacherId: t.user.id });
    const before = Date.now();
    const res = await post(`/teacher/learners/${learner.id}/reset-link`, {}, t.cookie);

    expect(res.status).toBe(201);
    expect(res.headers['cache-control']).toBe('no-store');
    const body = bodyOf<LinkBody>(res);
    expect(body.resetPath).toMatch(/^\/reset\/[A-Za-z0-9_-]{43}$/);
    const hours = (new Date(body.expiresAt).getTime() - before) / 3600_000;
    expect(hours).toBeGreaterThan(23.99);
    expect(hours).toBeLessThan(24.01);

    const [row] = await db.select().from(passwordResets);
    expect(row).toMatchObject({ userId: learner.id, createdBy: t.user.id, usedAt: null });
    expect(row?.tokenHash).toBe(sha256(tokenOf(res)));
    expect(JSON.stringify(row)).not.toContain(tokenOf(res));
  });

  it('keeps one live link per learner: a new one replaces the unused older one', async () => {
    const t = await teacher();
    const learner = await createUser({ teacherId: t.user.id });
    const first = await post(`/teacher/learners/${learner.id}/reset-link`, {}, t.cookie);
    const second = await post(`/teacher/learners/${learner.id}/reset-link`, {}, t.cookie);
    const rows = await db.select().from(passwordResets);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.tokenHash).toBe(sha256(tokenOf(second)));
    const old = await post('/auth/reset', { token: tokenOf(first), password: NEW });
    expect(old.status).toBe(404);
  });

  it("answers 404 for another teacher's learner, a teacher, a guest and an unknown id", async () => {
    const t = await teacher();
    const other = await teacher();
    const theirs = await createUser({ teacherId: other.user.id });
    const guest = await createUser({
      teacherId: t.user.id,
      isGuest: true,
      email: null,
      passwordHash: null,
    });
    for (const id of [theirs.id, other.user.id, guest.id, NOBODY]) {
      const res = await post(`/teacher/learners/${id}/reset-link`, {}, t.cookie);
      expect(res.status).toBe(404);
    }
    expect(await db.select().from(passwordResets)).toHaveLength(0);
  });

  it('is for teachers only: 401 anonymous, 403 for a learner, 403 DEMO_READ_ONLY for the demo', async () => {
    const t = await teacher();
    const learner = await createUser({ teacherId: t.user.id });
    const path = `/teacher/learners/${learner.id}/reset-link`;
    expect((await post(path)).status).toBe(401);
    const asLearner = await signedIn();
    expect((await post(path, {}, asLearner.cookie)).status).toBe(403);

    const demo = await createDemoTeacher();
    const { token } = await createSession(demo.id);
    const res = await post(path, {}, `sid=${token}`);
    expect(errorOf(res).code).toBe('DEMO_READ_ONLY');
    expect(await db.select().from(passwordResets)).toHaveLength(0);
  });

  it('rejects a malformed id', async () => {
    const t = await teacher();
    expect((await post('/teacher/learners/nope/reset-link', {}, t.cookie)).status).toBe(400);
  });
});

async function issued() {
  const t = await teacher();
  const learner = await createUser({
    teacherId: t.user.id,
    passwordHash: await hash('the old passphrase'),
  });
  const res = await post(`/teacher/learners/${learner.id}/reset-link`, {}, t.cookie);
  return { t, learner, token: tokenOf(res) };
}

describe('POST /auth/reset', () => {
  it('sets the new password, spends the link and ends every session of that learner', async () => {
    const { learner, token } = await issued();
    const s1 = await createSession(learner.id);
    const s2 = await createSession(learner.id);
    const bystander = await signedIn();

    const res = await post('/auth/reset', { token, password: NEW });
    expect(res.status).toBe(204);

    const [row] = await db.select().from(users).where(eq(users.id, learner.id));
    expect(await verify(row?.passwordHash ?? '', NEW)).toBe(true);
    expect(await loadSession(s1.token)).toBeNull();
    expect(await loadSession(s2.token)).toBeNull();
    expect(await loadSession(bystander.token)).not.toBeNull();
    const [reset] = await db.select().from(passwordResets);
    expect(reset?.usedAt).not.toBeNull();

    const login = await post('/auth/login', { email: learner.email, password: NEW });
    expect(login.status).toBe(200);
  });

  it('works once: the second use is a 404 and does not change the password again', async () => {
    const { learner, token } = await issued();
    expect((await post('/auth/reset', { token, password: NEW })).status).toBe(204);
    const again = await post('/auth/reset', { token, password: 'someone elses passphrase' });
    expect(again.status).toBe(404);
    const [row] = await db.select().from(users).where(eq(users.id, learner.id));
    expect(await verify(row?.passwordHash ?? '', NEW)).toBe(true);
  });

  it('lets only one of two parallel requests win', async () => {
    const { token } = await issued();
    const results = await Promise.all([
      post('/auth/reset', { token, password: NEW }),
      post('/auth/reset', { token, password: 'another new passphrase' }),
    ]);
    expect(results.map((r) => r.status).sort()).toEqual([204, 404]);
  });

  it('refuses an expired link, and leaves the password and sessions alone', async () => {
    const { learner, token } = await issued();
    await db
      .update(passwordResets)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(passwordResets.userId, learner.id));
    const session = await createSession(learner.id);

    const res = await post('/auth/reset', { token, password: NEW });
    expect(res.status).toBe(404);
    expect(errorOf(res).code).toBe('NOT_FOUND');
    expect(await loadSession(session.token)).not.toBeNull();
    const [row] = await db.select().from(users).where(eq(users.id, learner.id));
    expect(await verify(row?.passwordHash ?? '', 'the old passphrase')).toBe(true);
  });

  it('answers an unknown token like an expired one', async () => {
    await issued();
    const res = await post('/auth/reset', { token: 'A'.repeat(43), password: NEW });
    expect(res.status).toBe(404);
  });

  it('refuses a weak password without spending the link', async () => {
    const { token } = await issued();
    expect((await post('/auth/reset', { token, password: 'short' })).status).toBe(400);
    expect((await post('/auth/reset', { token, password: NEW })).status).toBe(204);
  });

  it('is rate limited per IP', async () => {
    const limited = makeTestApp({ config: { authRateLimit: { windowMs: 60_000, limit: 2 } } });
    const attempt = () =>
      api(limited).post('/auth/reset', { token: 'A'.repeat(43), password: NEW });
    expect((await attempt()).status).toBe(404);
    expect((await attempt()).status).toBe(404);
    expect((await attempt()).status).toBe(429);
  });

  it('removes the links with the account', async () => {
    const { learner } = await issued();
    await db.delete(users).where(eq(users.id, learner.id));
    expect(await db.select().from(passwordResets)).toHaveLength(0);
  });
});
