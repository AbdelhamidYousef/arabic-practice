import { index, integer, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';

import { createdAt, id } from './columns.ts';
import { lessons } from './lessons.ts';

export const lessonVocab = pgTable(
  'lesson_vocab',
  {
    id: id(),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    // As the teacher wrote it, with harakat.
    arabic: text('arabic').notNull(),
    // normalizeArabic(arabic) from @arabic/shared, computed in code (never by the database), so a
    // learner's unvoweled word can be matched against the lesson list.
    arabicPlain: text('arabic_plain').notNull(),
    english: text('english').notNull(),
    note: text('note'),
    position: integer('position').notNull().default(0),
    createdAt: createdAt(),
  },
  (t) => [
    // Two entries that differ only in harakat or alef shape would be the same word to a learner.
    unique('lesson_vocab_lesson_plain_unique').on(t.lessonId, t.arabicPlain),
    index('lesson_vocab_lesson_position_idx').on(t.lessonId, t.position),
  ],
);
