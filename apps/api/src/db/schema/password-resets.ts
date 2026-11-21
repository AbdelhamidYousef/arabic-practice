import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { createdAt, id } from './columns.ts';
import { users } from './users.ts';

// A teacher-issued, one-time link that lets a learner choose a new password (there is no email
// sender, so the teacher passes the link on by chat). Like sessions and invites, only the SHA-256 of
// the token is stored: the token is 256 random bits, so nothing needs slowing and a leaked
// database holds no usable link. Using it is one conditional UPDATE (`used_at is null and
// expires_at > now()`), so two requests cannot both spend it.
export const passwordResets = pgTable(
  'password_resets',
  {
    id: id(),
    tokenHash: text('token_hash').notNull().unique(),
    // The learner whose password the link changes. The rows go with the account.
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // The teacher who made it, for the record; set null if that teacher is deleted.
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    usedAt: timestamp('used_at', { withTimezone: true }),
    createdAt: createdAt(),
  },
  (t) => [
    index('password_resets_user_id_idx').on(t.userId),
    index('password_resets_expires_at_idx').on(t.expiresAt),
  ],
);
