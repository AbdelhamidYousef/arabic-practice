import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, primaryKey, timestamp, uuid } from 'drizzle-orm/pg-core';

import { lessonVocab } from './lesson-vocab.ts';
import { users } from './users.ts';

// Spaced repetition in Leitner boxes: a right answer moves the card up one box (longer wait), a
// wrong one sends it back to box 1. Intervals: box 1 = 1 day, 2 = 2, 3 = 4, 4 = 8, 5 = 16.
export const vocabCards = pgTable(
  'vocab_cards',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    vocabId: uuid('vocab_id')
      .notNull()
      .references(() => lessonVocab.id, { onDelete: 'cascade' }),
    box: integer('box').notNull().default(1),
    dueAt: timestamp('due_at', { withTimezone: true }).notNull().defaultNow(),
    reviews: integer('reviews').notNull().default(0),
    lapses: integer('lapses').notNull().default(0),
    lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.vocabId] }),
    index('vocab_cards_user_due_idx').on(t.userId, t.dueAt),
    index('vocab_cards_vocab_id_idx').on(t.vocabId),
    check('vocab_cards_box_range', sql`${t.box} between 1 and 5`),
  ],
);
