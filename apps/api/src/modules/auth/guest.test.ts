import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { conversations, sessions, users } from '../../db/schema/index.ts';
import { makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import {
  createConversation,
  createDemoTeacher,
  createLesson,
  createUser,
} from '../../test/factories.ts';
import { bodyOf, cookieValue, errorOf, setCookieLine } from '../../test/http.ts';

import { GUEST_CLEANUP_BATCH, deleteStaleGuests } from './service.ts';
import { sha256 } from './sessions.ts';

const app = makeTestApp();
const { get, post } = api(app);
const DAY = 24 * 3600 * 1000;

describe('POST /auth/guest', () => {
  it('creates a Guest XXXX learner on the demo teacher at A1 and signs in', async () => {
    const teacher = await createDemoTeacher();
    const res = await post('/auth/guest');

    expect(res.status).toBe(201);
    const { user } = bodyOf<{ user: Record<string, unknown> }>(res);
    expect(user).toMatchObject({
      role: 'learner',
      level: 'A1',
      isGuest: true,
      readOnly: false,
      email: null,
    });
    expect(user.displayName).toMatch(/^Guest [0-9A-F]{4}$/);

    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id as string));
    expect(row).toMatchObject({ teacherId: teacher.id, email: null, passwordHash: null });
    const cookie = `sid=${cookieValue(res, 'sid')}`;
    expect(setCookieLine(res, 'sid')).toContain('HttpOnly');
    const me = await get('/auth/me', cookie);
    expect(bodyOf<{ user: { id: string } }>(me).user.id).toBe(user.id);
  });

  it('answers 503 DEMO_UNAVAILABLE when the demo teacher was never seeded', async () => {
    const res = await post('/auth/guest');
    expect(res.status).toBe(503);
    expect(errorOf(res).code).toBe('DEMO_UNAVAILABLE');
    expect(await db.select().from(users)).toHaveLength(0);
  });

  it('limits guest sign-ins per IP', async () => {
    await createDemoTeacher();
    const limited = makeTestApp({ config: { guestRateLimit: { windowMs: 3600_000, limit: 2 } } });
    const { post: p } = api(limited);
    expect((await p('/auth/guest')).status).toBe(201);
    expect((await p('/auth/guest')).status).toBe(201);
    const third = await p('/auth/guest');
    expect(third.status).toBe(429);
    expect(errorOf(third).code).toBe('RATE_LIMITED');
  });

  it('refuses a cross-origin request', async () => {
    await createDemoTeacher();
    const res = await post('/auth/guest').set('Origin', 'https://evil.example');
    expect(res.status).toBe(403);
  });

  it('replaces the session that arrived with the request', async () => {
    await createDemoTeacher();
    const old = await signedIn();
    const res = await post('/auth/guest', {}, old.cookie);
    expect(cookieValue(res, 'sid')).not.toBe(old.token);
    expect(
      await db
        .select()
        .from(sessions)
        .where(eq(sessions.idHash, sha256(old.token))),
    ).toEqual([]);
  });

  it('sweeps guests unseen for 7 days (with their data) and keeps the rest', async () => {
    const teacher = await createDemoTeacher();
    const stale = await createUser({
      email: null,
      passwordHash: null,
      isGuest: true,
      teacherId: teacher.id,
      lastSeenAt: new Date(Date.now() - 8 * DAY),
    });
    const fresh = await createUser({
      email: null,
      passwordHash: null,
      isGuest: true,
      teacherId: teacher.id,
      lastSeenAt: new Date(Date.now() - 6 * DAY),
    });
    // A real learner unseen for a year must never be swept.
    const learner = await createUser({ lastSeenAt: new Date(Date.now() - 365 * DAY) });
    const lesson = await createLesson({ teacherId: teacher.id });
    await createConversation({ userId: stale.id, lessonId: lesson.id });

    await post('/auth/guest');

    const ids = (await db.select({ id: users.id }).from(users)).map((r) => r.id);
    expect(ids).not.toContain(stale.id);
    expect(ids).toContain(fresh.id);
    expect(ids).toContain(learner.id);
    expect(await db.select().from(conversations)).toHaveLength(0);
  });

  it('deletes at most one batch of stale guests per sweep', async () => {
    const teacher = await createDemoTeacher();
    const old = new Date(Date.now() - 9 * DAY);
    await db.insert(users).values(
      Array.from({ length: GUEST_CLEANUP_BATCH + 5 }, (_, i) => ({
        displayName: `Guest ${i}`,
        isGuest: true,
        teacherId: teacher.id,
        lastSeenAt: old,
      })),
    );
    expect(await deleteStaleGuests()).toBe(GUEST_CLEANUP_BATCH);
    expect(await deleteStaleGuests()).toBe(5);
  });
});
