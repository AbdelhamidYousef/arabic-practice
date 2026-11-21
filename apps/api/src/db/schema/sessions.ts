import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { createdAt } from './columns.ts';
import { users } from './users.ts';

// The cookie holds a random value; only its SHA-256 is stored, so a leaked database cannot be
// replayed as logins.
export const sessions = pgTable(
  'sessions',
  {
    idHash: text('id_hash').primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    index('sessions_user_id_idx').on(t.userId),
    index('sessions_expires_at_idx').on(t.expiresAt),
  ],
);
