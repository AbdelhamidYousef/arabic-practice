import { createHash } from 'node:crypto';

import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { invites } from '../../db/schema/index.ts';
import { makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import { createDemoTeacher, createInvite } from '../../test/factories.ts';
import { bodyOf, errorOf } from '../../test/http.ts';
import { createSession } from '../auth/sessions.ts';

const { get, post } = api(makeTestApp({ config: { invitesEnabled: true } }));

interface InviteBody {
  id: string;
  note: string;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  status: string;
}
interface CreateBody {
  invite: InviteBody;
  code: string;
  invitePath: string;
}

const teacher = () => signedIn({ role: 'teacher', displayName: 'Ustadh Test' });

describe('teacher invites: access', () => {
  it('answers 401 to anonymous and 403 to a learner on both routes', async () => {
    const learner = await signedIn();
    expect((await get('/teacher/invites')).status).toBe(401);
    expect((await post('/teacher/invites', {})).status).toBe(401);
    expect((await get('/teacher/invites', learner.cookie)).status).toBe(403);
    expect((await post('/teacher/invites', {}, learner.cookie)).status).toBe(403);
  });

  it('POST answers 403 DEMO_READ_ONLY to the demo teacher; GET works', async () => {
    const demo = await createDemoTeacher();
    const { token } = await createSession(demo.id);
    const res = await post('/teacher/invites', { note: 'x' }, `sid=${token}`);
    expect(res.status).toBe(403);
    expect(errorOf(res).code).toBe('DEMO_READ_ONLY');
    expect((await get('/teacher/invites', `sid=${token}`)).status).toBe(200);
  });
});

describe('POST /teacher/invites', () => {
  it('creates an invite, stores only the hash and returns the code and link path once', async () => {
    const t = await teacher();
    const res = await post(
      '/teacher/invites',
      { note: 'Preply, Tuesday group', maxUses: 5, expiresInDays: 14 },
      t.cookie,
    );
    expect(res.status).toBe(201);
    const body = bodyOf<CreateBody>(res);
    expect(body.code).toMatch(/^[A-Za-z0-9_-]{22}$/); // 16 bytes in base64url
    expect(body.invitePath).toBe(`/register?code=${body.code}`);
    expect(body.invite).toMatchObject({
      note: 'Preply, Tuesday group',
      maxUses: 5,
      usedCount: 0,
      status: 'active',
    });
    const days = (Date.parse(body.invite.expiresAt) - Date.now()) / (24 * 3600 * 1000);
    expect(days).toBeGreaterThan(13.99);
    expect(days).toBeLessThan(14.01);

    const [row] = await db.select().from(invites).where(eq(invites.id, body.invite.id));
    expect(row?.teacherId).toBe(t.user.id);
    expect(row?.codeHash).toBe(createHash('sha256').update(body.code).digest('hex'));
    expect(JSON.stringify(row)).not.toContain(body.code);
  });

  it('applies defaults (1 use, 7 days, empty note) and gives each invite a different code', async () => {
    const t = await teacher();
    const a = bodyOf<CreateBody>(await post('/teacher/invites', {}, t.cookie));
    const b = bodyOf<CreateBody>(await post('/teacher/invites', {}, t.cookie));
    expect(a.invite).toMatchObject({ note: '', maxUses: 1 });
    expect(a.code).not.toBe(b.code);
  });

  it('creates a code the register endpoint accepts', async () => {
    const t = await teacher();
    const { code } = bodyOf<CreateBody>(await post('/teacher/invites', {}, t.cookie));
    const res = await get(`/auth/invites/${code}`);
    expect(bodyOf<{ valid: boolean }>(res).valid).toBe(true);
  });

  it('rejects out-of-range values and unknown fields with 400', async () => {
    const t = await teacher();
    const bad = [
      { maxUses: 0 },
      { maxUses: 101 },
      { maxUses: 1.5 },
      { expiresInDays: 0 },
      { expiresInDays: 91 },
      { note: 'x'.repeat(101) },
      { code: 'chosen-by-me' },
    ];
    for (const body of bad) {
      expect((await post('/teacher/invites', body, t.cookie)).status, JSON.stringify(body)).toBe(
        400,
      );
    }
    expect(await db.select().from(invites)).toHaveLength(0);
  });
});

describe('GET /teacher/invites', () => {
  it('lists only my invites, newest first, with a status and no code', async () => {
    const t = await teacher();
    const other = await teacher();
    const active = await createInvite(t.user.id, {
      note: 'active',
      createdAt: new Date(Date.now() - 1000),
    });
    await createInvite(t.user.id, {
      note: 'expired',
      expiresAt: new Date(Date.now() - 1000),
      createdAt: new Date(Date.now() - 3000),
    });
    await createInvite(t.user.id, {
      note: 'used up',
      maxUses: 2,
      usedCount: 2,
      createdAt: new Date(Date.now() - 2000),
    });
    await createInvite(other.user.id, { note: 'not mine' });

    const res = await get('/teacher/invites', t.cookie);
    const list = bodyOf<{ invites: InviteBody[] }>(res).invites;
    expect(list.map((i) => [i.note, i.status])).toEqual([
      ['active', 'active'],
      ['used up', 'used_up'],
      ['expired', 'expired'],
    ]);
    expect(JSON.stringify(res.body)).not.toContain(active.code);
    expect(JSON.stringify(res.body)).not.toContain('codeHash');
  });

  it('is empty for a teacher without invites', async () => {
    const t = await teacher();
    expect(bodyOf(await get('/teacher/invites', t.cookie))).toEqual({ invites: [] });
  });
});
