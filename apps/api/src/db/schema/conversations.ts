import { index, integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { createdAt, id } from './columns.ts';
import { lessons } from './lessons.ts';
import { users } from './users.ts';

export const conversations = pgTable(
  'conversations',
  {
    id: id(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    // Learner messages sent so far; the daily cap and the "three turns" demo path read it.
    turnCount: integer('turn_count').notNull().default(0),
    // Set while a turn is being served (the per-conversation guard, see practice/repo.ts); a stale
    // value (a crashed serverless instance) stops counting after TURN_LOCK_SECONDS.
    turnStartedAt: timestamp('turn_started_at', { withTimezone: true }),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: createdAt(),
  },
  (t) => [
    index('conversations_user_last_message_idx').on(t.userId, t.lastMessageAt.desc()),
    index('conversations_lesson_id_idx').on(t.lessonId),
  ],
);
