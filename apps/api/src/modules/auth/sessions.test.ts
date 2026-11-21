import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { sessions, users } from '../../db/schema/index.ts';
import { SESSION_TTL_MS } from '../../lib/cookies.ts';
import { createUser } from '../../test/factories.ts';

import {
  createSession,
  deleteSession,
  loadSession,
  purgeExpiredSessions,
  sha256,
} from './sessions.ts';

const DAY = 24 * 3600 * 1000;

describe('sessions', () => {
  it('stores only the SHA-256 of a 32-byte token', async () => {
    const user = await createUser();
    const { token } = await createSession(user.id);

    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    const [row] = await db.select().from(sessions);
    expect(row?.idHash).toBe(sha256(token));
    expect(row?.idHash).not.toContain(token);
  });

  it('loads the user without a password hash, and the teacher id for scoping', async () => {
    const teacher = await createUser({ role: 'teacher' });
    const user = await createUser({ teacherId: teacher.id, level: 'B1' });
    const { token } = await createSession(user.id);

    const loaded = await loadSession(token);
    expect(loaded?.user).toMatchObject({ id: user.id, level: 'B1', teacherId: teacher.id });
    expect(JSON.stringify(loaded)).not.toContain('test-hash');
  });

  it('rejects junk, unknown and expired tokens', async () => {
    const user = await createUser();
    const { token } = await createSession(user.id);
    await db
      .update(sessions)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(sessions.idHash, sha256(token)));

    expect(await loadSession('short')).toBeNull();
    expect(await loadSession('A'.repeat(43))).toBeNull();
    expect(await loadSession(token)).toBeNull();
  });

  it('does not write on a fresh session (no extension, no last_seen update)', async () => {
    const user = await createUser();
    const { token, expiresAt } = await createSession(user.id);
    const loaded = await loadSession(token);

    expect(loaded?.slid).toBe(false);
    const [row] = await db.select().from(sessions);
    expect(row?.expiresAt.getTime()).toBe(expiresAt.getTime());
  });

  it('slides the expiry to a full 30 days once a day has passed', async () => {
    const user = await createUser();
    const { token } = await createSession(user.id);
    const aged = new Date(Date.now() + SESSION_TTL_MS - 2 * DAY);
    await db.update(sessions).set({ expiresAt: aged });

    const loaded = await loadSession(token);
    expect(loaded?.slid).toBe(true);
    const [row] = await db.select().from(sessions);
    expect(row!.expiresAt.getTime()).toBeGreaterThan(Date.now() + SESSION_TTL_MS - 5000);
  });

  it('touches last_seen_at at most once an hour', async () => {
    const user = await createUser();
    const { token } = await createSession(user.id);
    const recent = new Date(Date.now() - 10 * 60 * 1000);
    await db.update(users).set({ lastSeenAt: recent }).where(eq(users.id, user.id));
    await loadSession(token);
    const [a] = await db.select().from(users).where(eq(users.id, user.id));
    expect(a?.lastSeenAt.getTime()).toBe(recent.getTime());

    const stale = new Date(Date.now() - 2 * 3600 * 1000);
    await db.update(users).set({ lastSeenAt: stale }).where(eq(users.id, user.id));
    await loadSession(token);
    const [b] = await db.select().from(users).where(eq(users.id, user.id));
    expect(b!.lastSeenAt.getTime()).toBeGreaterThan(Date.now() - 5000);
  });

  it('deletes a session and purges expired ones', async () => {
    const user = await createUser();
    const live = await createSession(user.id);
    const old = await createSession(user.id);
    await db
      .update(sessions)
      .set({ expiresAt: new Date(Date.now() - 1000) })
      .where(eq(sessions.idHash, sha256(old.token)));

    expect(await purgeExpiredSessions()).toBe(1);
    await deleteSession(live.token);
    expect(await db.select().from(sessions)).toHaveLength(0);
  });
});
