import type { Exercise } from '@arabic/shared';
import { integer, jsonb, pgTable, text, unique, uuid } from 'drizzle-orm/pg-core';

import { id } from './columns.ts';
import { lessons } from './lessons.ts';

export const lessonExercises = pgTable(
  'lesson_exercises',
  {
    id: id(),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    // Mirrors data.type so the type can be counted without opening the json.
    type: text('type').notNull(),
    // The whole exercise (ExerciseSchema in @arabic/shared), type included.
    data: jsonb('data').$type<Exercise>().notNull(),
  },
  (t) => [unique('lesson_exercises_lesson_position_unique').on(t.lessonId, t.position)],
);
