import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';

import { citext, createdAt, id, updatedAt } from './columns.ts';
import { cefrLevel, userRole } from './enums.ts';

export const users = pgTable(
  'users',
  {
    id: id(),
    // Null for guests, who have no login. citext makes "A@x.com" and "a@x.com" one account.
    email: citext('email').unique(),
    // argon2id, null for guests.
    passwordHash: text('password_hash'),
    displayName: text('display_name').notNull(),
    role: userRole('role').notNull().default('learner'),
    // A learner's teacher; guests point at the demo teacher. Set null if the teacher is deleted,
    // so a learner's own history is never lost with them.
    teacherId: uuid('teacher_id').references((): AnyPgColumn => users.id, {
      onDelete: 'set null',
    }),
    level: cefrLevel('level').notNull().default('A1'),
    isGuest: boolean('is_guest').notNull().default(false),
    // The demo teacher: every mutation answers 403.
    readOnly: boolean('read_only').notNull().default(false),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index('users_teacher_id_idx').on(t.teacherId),
    // Guest cleanup scans by last_seen_at.
    index('users_guest_last_seen_idx')
      .on(t.lastSeenAt)
      .where(sql`${t.isGuest}`),
    // Everyone except a guest can log in, so needs an email and a password hash.
    check(
      'users_login_shape',
      sql`${t.isGuest} or (${t.email} is not null and ${t.passwordHash} is not null)`,
    ),
  ],
);
