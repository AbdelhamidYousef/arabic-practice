import { createHmac, randomBytes } from 'node:crypto';

import { ErrorCode } from '@arabic/shared';
import { and, count, eq, gt, gte, inArray, lt, sql } from 'drizzle-orm';
import { ipKeyGenerator } from 'express-rate-limit';

import { db } from '../../db/client.ts';
import { invites, users } from '../../db/schema/index.ts';
import { DEMO_TEACHER } from '../../db/seed/users.ts';
import { uniqueViolation } from '../../lib/db-errors.ts';
import {
  AppError,
  conflict,
  demoUnavailable,
  unauthenticated,
  unprocessable,
} from '../../lib/errors.ts';
import { hash, verify, verifyAgainstDummy } from '../../lib/password.ts';

import {
  createSession,
  deleteSession,
  purgeExpiredSessions,
  sha256,
  type AuthUser,
} from './sessions.ts';

export interface Issued {
  user: AuthUser;
  token: string;
}

// Session fixation: if an attacker plants a known session id in the victim's browser and the app
// keeps it across sign-in, the attacker is signed in too. So every sign-in deletes the session that
// arrived with the request and issues a brand new id.
export async function issueFreshSession(
  user: AuthUser,
  previousToken: string | null,
): Promise<Issued> {
  if (previousToken) await deleteSession(previousToken);
  // Cheap housekeeping on a rare, already-slow path (there is no cron on the free tier).
  await purgeExpiredSessions();
  const { token } = await createSession(user.id);
  return { user, token };
}

export const userColumns = {
  id: users.id,
  email: users.email,
  displayName: users.displayName,
  role: users.role,
  level: users.level,
  isGuest: users.isGuest,
  readOnly: users.readOnly,
  teacherId: users.teacherId,
};

// One generic message for every credential failure, and one argon2 verification whichever way it
// fails (a dummy hash when the email is unknown or the account has no password), so neither the
// body nor the timing tells an attacker which emails have accounts.
export async function login(
  input: { email: string; password: string },
  previousToken: string | null,
): Promise<Issued> {
  const [row] = await db
    .select({ user: userColumns, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, input.email));
  const ok = row?.passwordHash
    ? await verify(row.passwordHash, input.password)
    : await verifyAgainstDummy(input.password);
  if (!row || !ok) throw unauthenticated('Invalid email or password');
  return issueFreshSession(row.user, previousToken);
}

export async function logout(token: string | null): Promise<void> {
  if (token) await deleteSession(token);
}

const DAY_MS = 24 * 3600 * 1000;
export const GUEST_TTL_MS = 7 * 24 * 3600 * 1000;
// A request must stay cheap: the cleanup deletes at most this many guests, the rest wait for the next one.
export const GUEST_CLEANUP_BATCH = 200;

export async function findDemoTeacherId(): Promise<string> {
  const [row] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, DEMO_TEACHER.email));
  if (!row) throw demoUnavailable();
  return row.id;
}

// There is no scheduler on the free tier, so the next guest sign-in sweeps the previous guests.
// Their sessions and conversations go with them (foreign keys cascade).
export async function deleteStaleGuests(now = new Date()): Promise<number> {
  const cutoff = new Date(now.getTime() - GUEST_TTL_MS);
  const stale = db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.isGuest, true), lt(users.lastSeenAt, cutoff)))
    .limit(GUEST_CLEANUP_BATCH);
  const deleted = await db
    .delete(users)
    .where(inArray(users.id, stale))
    .returning({ id: users.id });
  return deleted.length;
}

export interface GuestLimits {
  /** Guests one network (by hashed IP) may create per hour. */
  perIpPerHour: number;
  /** Guests created in the last 24 hours, in total. */
  perDay: number;
  /** Secret pepper for the IP hash (IP_HASH_SALT). */
  ipHashSalt: string;
}

// Only used where IP_HASH_SALT is unset, which the config allows outside production only.
export const DEV_IP_HASH_SALT = 'development-only-ip-hash-salt';
export const DEFAULT_GUEST_LIMITS: GuestLimits = {
  perIpPerHour: 10,
  perDay: 300,
  ipHashSalt: DEV_IP_HASH_SALT,
};

// A keyed hash (HMAC-SHA-256) of the client IP: enough to count guests per network, useless for
// finding out who visited, and useless to anyone who gets the table without the salt. IPv6 clients
// are grouped by /56 (as the rate limiter does) so rotating addresses in one network does not dodge it.
export const hashIp = (ip: string, salt: string): string =>
  createHmac('sha256', salt).update(ipKeyGenerator(ip)).digest('hex');

// Fixed key for the advisory lock that serialises guest creation (see createGuest).
const GUEST_LOCK = 7_251_001;

// The in-memory limiter on the route is only a first line: each serverless instance has its own
// memory, so the real limits live in the database, counted on the guest rows themselves.
export async function createGuest(
  previousToken: string | null,
  ip: string,
  limits: GuestLimits = DEFAULT_GUEST_LIMITS,
  now = new Date(),
): Promise<Issued> {
  const teacherId = await findDemoTeacherId();
  await deleteStaleGuests();
  const ipHash = hashIp(ip, limits.ipHashSalt);
  const user = await db.transaction(async (tx) => {
    // One lock for the count-then-insert, so parallel sign-ins cannot all pass the same count.
    await tx.execute(sql`select pg_advisory_xact_lock(${GUEST_LOCK})`);
    const [fromIp] = await tx
      .select({ n: count() })
      .from(users)
      .where(
        and(
          eq(users.isGuest, true),
          eq(users.createdIpHash, ipHash),
          gte(users.createdAt, new Date(now.getTime() - 3600_000)),
        ),
      );
    if ((fromIp?.n ?? 0) >= limits.perIpPerHour) {
      throw new AppError(
        ErrorCode.GUEST_LIMIT,
        'Too many guest sessions from this network, try again later',
      );
    }
    const [today] = await tx
      .select({ n: count() })
      .from(users)
      .where(and(eq(users.isGuest, true), gte(users.createdAt, new Date(now.getTime() - DAY_MS))));
    if ((today?.n ?? 0) >= limits.perDay) {
      throw new AppError(
        ErrorCode.GUEST_LIMIT,
        'The demo has had a lot of visitors today, try again later',
      );
    }
    const [created] = await tx
      .insert(users)
      .values({
        displayName: `Guest ${randomBytes(2).toString('hex').toUpperCase()}`,
        role: 'learner',
        isGuest: true,
        teacherId,
        level: 'A1',
        createdIpHash: ipHash,
      })
      .returning(userColumns);
    if (!created) throw new Error('guest insert returned no row');
    return created;
  });
  return issueFreshSession(user, previousToken);
}

// ---- invites -------------------------------------------------------------------------------------

// Only the SHA-256 of a code is stored; the code itself is 128 random bits, so nothing needs slowing.
export const hashInviteCode = sha256;

export async function lookupInvite(
  code: string,
): Promise<{ valid: boolean; teacherName: string | null }> {
  const [row] = await db
    .select({ teacherName: users.displayName })
    .from(invites)
    .innerJoin(users, eq(users.id, invites.teacherId))
    .where(
      and(
        eq(invites.codeHash, hashInviteCode(code)),
        gt(invites.expiresAt, new Date()),
        lt(invites.usedCount, invites.maxUses),
      ),
    );
  return row ? { valid: true, teacherName: row.teacherName } : { valid: false, teacherName: null };
}

export async function register(
  input: { code: string; email: string; password: string; displayName: string },
  previousToken: string | null,
): Promise<Issued> {
  // Hashed before the transaction opens: argon2 takes ~100 ms and must not hold a connection.
  const passwordHash = await hash(input.password);
  const user = await db.transaction(async (tx) => {
    // The single conditional UPDATE is what makes the last use un-stealable: two people racing for
    // it cannot both match `used_count < max_uses`.
    const [claimed] = await tx
      .update(invites)
      .set({ usedCount: sql`${invites.usedCount} + 1` })
      .where(
        and(
          eq(invites.codeHash, hashInviteCode(input.code)),
          lt(invites.usedCount, invites.maxUses),
          gt(invites.expiresAt, new Date()),
        ),
      )
      .returning({ teacherId: invites.teacherId });
    if (!claimed) throw unprocessable('This invite is invalid, expired or already used up');
    try {
      const [created] = await tx
        .insert(users)
        .values({
          email: input.email,
          passwordHash,
          displayName: input.displayName,
          role: 'learner',
          teacherId: claimed.teacherId,
          level: 'A1',
        })
        .returning(userColumns);
      if (!created) throw new Error('register insert returned no row');
      return created;
    } catch (err) {
      // Throwing rolls the transaction back, so a duplicate email does not burn an invite use.
      if (uniqueViolation(err) !== undefined)
        throw conflict('An account with this email already exists');
      throw err;
    }
  });
  return issueFreshSession(user, previousToken);
}

// ---- demo teacher --------------------------------------------------------------------------------

// A public endpoint must never open a writable account, so a seeded row that lost its read-only flag
// (or its role) is treated as "not set up" instead of being signed into.
export async function signInDemoTeacher(previousToken: string | null): Promise<Issued> {
  const [user] = await db
    .select(userColumns)
    .from(users)
    .where(eq(users.email, DEMO_TEACHER.email));
  if (user?.role !== 'teacher' || !user.readOnly) throw demoUnavailable();
  return issueFreshSession(user, previousToken);
}
