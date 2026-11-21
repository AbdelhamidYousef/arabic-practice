import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { invites, users } from '../../db/schema/index.ts';
import { makeTestApp } from '../../test/app.ts';
import { api } from '../../test/auth.ts';
import { createInvite, createTeacher, createUser } from '../../test/factories.ts';
import { bodyOf, cookieValue, errorOf } from '../../test/http.ts';

const open = makeTestApp({ config: { invitesEnabled: true } });
const { get, post } = api(open);
const PASSWORD = 'a long enough passphrase';

const registration = (code: string, extra: object = {}) => ({
  code,
  email: 'New.Student@arabic-practice.test',
  password: PASSWORD,
  displayName: 'New Student',
  ...extra,
});

describe('invites are closed by default', () => {
  it('answers 403 INVITES_CLOSED for register and lookup, even for a real code', async () => {
    const teacher = await createTeacher();
    const { code } = await createInvite(teacher.id);
    const { get: g, post: p } = api(makeTestApp());
    const reg = await p('/auth/register', registration(code));
    expect(reg.status).toBe(403);
    expect(errorOf(reg).code).toBe('INVITES_CLOSED');
    const look = await g(`/auth/invites/${code}`);
    expect(look.status).toBe(403);
    expect(errorOf(look).code).toBe('INVITES_CLOSED');
    expect(await db.select().from(users)).toHaveLength(1);
  });
});

describe('GET /auth/invites/:code', () => {
  it('names the teacher for a valid code', async () => {
    const teacher = await createTeacher({ displayName: 'Ustadha Noor' });
    const { code } = await createInvite(teacher.id);
    const res = await get(`/auth/invites/${code}`);
    expect(res.status).toBe(200);
    expect(bodyOf(res)).toEqual({ valid: true, teacherName: 'Ustadha Noor' });
  });

  it('says invalid, without a name, for unknown, expired and used-up codes', async () => {
    const teacher = await createTeacher();
    const expired = await createInvite(teacher.id, { expiresAt: new Date(Date.now() - 1000) });
    const used = await createInvite(teacher.id, { maxUses: 1, usedCount: 1 });
    for (const code of ['A'.repeat(22), expired.code, used.code]) {
      const res = await get(`/auth/invites/${code}`);
      expect(res.status).toBe(200);
      expect(bodyOf(res)).toEqual({ valid: false, teacherName: null });
    }
  });

  it('rejects a malformed code with 400', async () => {
    expect((await get('/auth/invites/short')).status).toBe(400);
    expect((await get(`/auth/invites/${'a'.repeat(65)}`)).status).toBe(400);
  });
});

describe('POST /auth/register', () => {
  it('creates the learner under the inviting teacher, counts the use and signs in', async () => {
    const teacher = await createTeacher();
    const { invite, code } = await createInvite(teacher.id);
    const res = await post('/auth/register', registration(code));

    expect(res.status).toBe(201);
    expect(bodyOf(res)).toEqual({
      user: {
        id: expect.any(String) as string,
        displayName: 'New Student',
        role: 'learner',
        level: 'A1',
        isGuest: false,
        readOnly: false,
        email: 'new.student@arabic-practice.test',
      },
    });
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.email, 'new.student@arabic-practice.test'));
    expect(row).toMatchObject({ teacherId: teacher.id, role: 'learner', isGuest: false });
    expect(row?.passwordHash).toMatch(/^\$argon2id\$/);
    const [inv] = await db.select().from(invites).where(eq(invites.id, invite.id));
    expect(inv?.usedCount).toBe(1);

    const me = await get('/auth/me', `sid=${cookieValue(res, 'sid')}`);
    expect(me.status).toBe(200);
  });

  it('never lets two sign-ups take the last use', async () => {
    const teacher = await createTeacher();
    const { invite, code } = await createInvite(teacher.id, { maxUses: 1 });
    const results = await Promise.all(
      ['a', 'b', 'c', 'd'].map((n) =>
        post('/auth/register', registration(code, { email: `${n}@arabic-practice.test` })),
      ),
    );
    expect(results.filter((r) => r.status === 201)).toHaveLength(1);
    expect(results.filter((r) => r.status === 422)).toHaveLength(3);
    const [inv] = await db.select().from(invites).where(eq(invites.id, invite.id));
    expect(inv?.usedCount).toBe(1);
  });

  it('lets a multi-use invite be used up to its limit', async () => {
    const teacher = await createTeacher();
    const { code } = await createInvite(teacher.id, { maxUses: 2 });
    expect((await post('/auth/register', registration(code, { email: 'a@x.test' }))).status).toBe(
      201,
    );
    expect((await post('/auth/register', registration(code, { email: 'b@x.test' }))).status).toBe(
      201,
    );
    expect((await post('/auth/register', registration(code, { email: 'c@x.test' }))).status).toBe(
      422,
    );
  });

  it('refuses an expired invite and an unknown code with the same 422', async () => {
    const teacher = await createTeacher();
    const { code } = await createInvite(teacher.id, { expiresAt: new Date(Date.now() - 1000) });
    const expired = await post('/auth/register', registration(code));
    const unknown = await post('/auth/register', registration('A'.repeat(22)));
    expect(expired.status).toBe(422);
    expect(errorOf(expired)).toEqual(errorOf(unknown));
  });

  it('answers 409 for a taken email and does not burn an invite use', async () => {
    const teacher = await createTeacher();
    await createUser({ email: 'new.student@arabic-practice.test' });
    const { invite, code } = await createInvite(teacher.id);
    const res = await post('/auth/register', registration(code));
    expect(res.status).toBe(409);
    expect(errorOf(res).code).toBe('CONFLICT');
    const [inv] = await db.select().from(invites).where(eq(invites.id, invite.id));
    expect(inv?.usedCount).toBe(0);
  });

  it('validates the body: short, common and over-long passwords, bad email, empty name', async () => {
    const teacher = await createTeacher();
    const { code } = await createInvite(teacher.id, { maxUses: 10 });
    for (const bad of [
      { password: 'short' },
      { password: 'password123' },
      { password: 'x'.repeat(129) },
      { email: 'nope' },
      { displayName: '   ' },
      { displayName: 'n'.repeat(61) },
    ]) {
      expect((await post('/auth/register', registration(code, bad))).status).toBe(400);
    }
    const [inv] = await db.select().from(invites);
    expect(inv?.usedCount).toBe(0);
  });

  it('refuses a cross-origin request', async () => {
    const res = await post('/auth/register', registration('A'.repeat(22))).set(
      'Origin',
      'https://evil.example',
    );
    expect(res.status).toBe(403);
    expect(errorOf(res).code).toBe('FORBIDDEN');
  });

  it('rate-limits per IP and email', async () => {
    const limited = makeTestApp({
      config: { invitesEnabled: true, authRateLimit: { windowMs: 60_000, limit: 1 } },
    });
    const { post: p } = api(limited);
    const body = registration('A'.repeat(22));
    expect((await p('/auth/register', body)).status).toBe(422);
    expect((await p('/auth/register', body)).status).toBe(429);
  });
});
