import { createHash, randomBytes } from 'node:crypto';

import type { CreateInviteResponse, Invite, InviteListResponse } from '@arabic/shared';
import { desc, eq } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import { invites } from '../../db/schema/index.ts';
import type { AuthUser } from '../auth/sessions.ts';

const DAY_MS = 24 * 3600 * 1000;

// Same hashing as the register check in modules/auth: SHA-256 hex of the plain code.
const hashCode = (code: string) => createHash('sha256').update(code).digest('hex');

type InviteRow = typeof invites.$inferSelect;

function toInvite(row: InviteRow, now: Date): Invite {
  const status =
    row.usedCount >= row.maxUses ? 'used_up' : row.expiresAt <= now ? 'expired' : 'active';
  return {
    id: row.id,
    note: row.note,
    maxUses: row.maxUses,
    usedCount: row.usedCount,
    expiresAt: row.expiresAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
    status,
  };
}

export async function listInvites(
  teacher: AuthUser,
  now = new Date(),
): Promise<InviteListResponse> {
  const rows = await db
    .select()
    .from(invites)
    .where(eq(invites.teacherId, teacher.id))
    .orderBy(desc(invites.createdAt), desc(invites.id));
  return { invites: rows.map((r) => toInvite(r, now)) };
}

export async function createInvite(
  teacher: AuthUser,
  input: { note: string; maxUses: number; expiresInDays: number },
  now = new Date(),
): Promise<CreateInviteResponse> {
  // 128 random bits: guessing is hopeless, which is why a fast hash is enough to store.
  const code = randomBytes(16).toString('base64url');
  const [row] = await db
    .insert(invites)
    .values({
      codeHash: hashCode(code),
      teacherId: teacher.id,
      note: input.note,
      maxUses: input.maxUses,
      expiresAt: new Date(now.getTime() + input.expiresInDays * DAY_MS),
    })
    .returning();
  if (!row) throw new Error('invite insert returned no row');
  return { invite: toInvite(row, now), code, invitePath: `/register?code=${code}` };
}
