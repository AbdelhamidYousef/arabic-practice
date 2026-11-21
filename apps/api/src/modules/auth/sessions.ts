import { createHash, randomBytes } from 'node:crypto';

import type { CefrLevel } from '@arabic/shared';
import { and, eq, gt, lt, ne } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import { sessions, users } from '../../db/schema/index.ts';
import { SESSION_TTL_MS } from '../../lib/cookies.ts';

// Sliding expiry and "last seen" are writes. Doing them on every request would turn each page view
// into an UPDATE, so a session is extended at most once a day and the user's last_seen_at is
// touched at most once an hour.
export const SESSION_SLIDE_INTERVAL_MS = 24 * 3600 * 1000;
export const LAST_SEEN_INTERVAL_MS = 3600 * 1000;

// The cookie carries a token; the database only holds its SHA-256, so a leaked database contains no
// usable session ids. The token is 256 bits of randomness, so a fast hash is enough: there is
// nothing to brute-force, unlike a password.
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/; // 32 bytes in base64url, unpadded

export const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

export interface AuthUser {
  id: string;
  email: string | null;
  displayName: string;
  role: 'learner' | 'teacher';
  level: CefrLevel;
  isGuest: boolean;
  readOnly: boolean;
  /** Internal only (lessons are scoped by it); never part of the user DTO. */
  teacherId: string | null;
}

export async function createSession(userId: string): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await db.insert(sessions).values({ idHash: sha256(token), userId, expiresAt });
  return { token, expiresAt };
}

export interface LoadedSession {
  user: AuthUser;
  /** True when this call extended the session, so the caller can refresh the cookie's maxAge too. */
  slid: boolean;
}

// Null for anything that is not a live session: wrong shape, unknown, expired.
export async function loadSession(token: string): Promise<LoadedSession | null> {
  if (!TOKEN_PATTERN.test(token)) return null;
  const idHash = sha256(token);
  const now = Date.now();

  const [row] = await db
    .select({
      expiresAt: sessions.expiresAt,
      lastSeenAt: users.lastSeenAt,
      // Explicit columns: the password hash must never travel upward by accident.
      user: {
        id: users.id,
        email: users.email,
        displayName: users.displayName,
        role: users.role,
        level: users.level,
        isGuest: users.isGuest,
        readOnly: users.readOnly,
        teacherId: users.teacherId,
      },
    })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    // Expiry is checked in the query so an expired row is never even returned.
    .where(and(eq(sessions.idHash, idHash), gt(sessions.expiresAt, new Date(now))));
  if (!row) return null;

  // The remaining lifetime tells us when we last slid: it is below the full TTL by the time passed.
  const sinceSlide = SESSION_TTL_MS - (row.expiresAt.getTime() - now);
  let slid = false;
  if (sinceSlide >= SESSION_SLIDE_INTERVAL_MS) {
    await db
      .update(sessions)
      .set({ expiresAt: new Date(now + SESSION_TTL_MS) })
      .where(eq(sessions.idHash, idHash));
    slid = true;
  }
  if (now - row.lastSeenAt.getTime() >= LAST_SEEN_INTERVAL_MS) {
    await db
      .update(users)
      .set({ lastSeenAt: new Date(now) })
      .where(eq(users.id, row.user.id));
  }
  return { user: row.user, slid };
}

export async function deleteSession(token: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.idHash, sha256(token)));
}

// Cron-less cleanup (the free tier has no scheduler): every sign-in deletes whatever has expired.
// The expires_at index makes it cheap.
export async function purgeExpiredSessions(): Promise<number> {
  const deleted = await db
    .delete(sessions)
    .where(lt(sessions.expiresAt, new Date()))
    .returning({ idHash: sessions.idHash });
  return deleted.length;
}

// Every session of a user except one (the caller's own): after a password change the other devices
// must sign in again. Pass null to end all of them (a password reset).
export async function deleteSessionsOf(
  userId: string,
  exceptToken: string | null,
): Promise<number> {
  const deleted = await db
    .delete(sessions)
    .where(
      and(
        eq(sessions.userId, userId),
        ...(exceptToken ? [ne(sessions.idHash, sha256(exceptToken))] : []),
      ),
    )
    .returning({ idHash: sessions.idHash });
  return deleted.length;
}
