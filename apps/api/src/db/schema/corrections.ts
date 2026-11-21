import { boolean, index, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { createdAt, id } from './columns.ts';
import { mistakeType } from './enums.ts';
import { lessons } from './lessons.ts';
import { messages } from './messages.ts';
import { users } from './users.ts';

// One correction per learner message (the unique constraint is also what makes a retried
// correction call safe: the second insert conflicts instead of duplicating).
export const corrections = pgTable('corrections', {
  id: id(),
  messageId: uuid('message_id')
    .notNull()
    .unique()
    .references(() => messages.id, { onDelete: 'cascade' }),
  isCorrect: boolean('is_correct').notNull(),
  corrected: text('corrected').notNull(),
  praise: text('praise'),
  createdAt: createdAt(),
});

export const mistakes = pgTable(
  'mistakes',
  {
    id: id(),
    correctionId: uuid('correction_id')
      .notNull()
      .references(() => corrections.id, { onDelete: 'cascade' }),
    // Denormalised from the conversation so progress queries need no joins.
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    type: mistakeType('type').notNull(),
    original: text('original').notNull(),
    correction: text('correction').notNull(),
    explanation: text('explanation').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    index('mistakes_user_created_idx').on(t.userId, t.createdAt.desc()),
    index('mistakes_user_type_idx').on(t.userId, t.type),
    index('mistakes_correction_id_idx').on(t.correctionId),
  ],
);
