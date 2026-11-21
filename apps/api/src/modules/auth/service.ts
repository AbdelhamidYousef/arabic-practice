import { eq } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import { users } from '../../db/schema/index.ts';
import { unauthenticated } from '../../lib/errors.ts';
import { verify, verifyAgainstDummy } from '../../lib/password.ts';

import { createSession, deleteSession, purgeExpiredSessions, type AuthUser } from './sessions.ts';

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
