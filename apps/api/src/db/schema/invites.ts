import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { createdAt, id } from './columns.ts';
import { users } from './users.ts';

// A teacher's sign-up link for real students. Only the SHA-256 of the code is stored (the code is
// shown once, when it is created). A sign-up claims a use with a single conditional UPDATE
// (`used_count < max_uses and expires_at > now()`), so two people cannot take the last use.
export const invites = pgTable(
  'invites',
  {
    id: id(),
    codeHash: text('code_hash').notNull().unique(),
    teacherId: uuid('teacher_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // For the teacher's own memory, e.g. "Preply, Tuesday group".
    note: text('note').notNull().default(''),
    maxUses: integer('max_uses').notNull().default(1),
    usedCount: integer('used_count').notNull().default(0),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    index('invites_teacher_id_idx').on(t.teacherId),
    check('invites_max_uses_positive', sql`${t.maxUses} > 0`),
    check('invites_used_within_max', sql`${t.usedCount} >= 0 and ${t.usedCount} <= ${t.maxUses}`),
  ],
);
