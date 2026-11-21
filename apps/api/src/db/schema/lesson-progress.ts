import { sql } from 'drizzle-orm';
import {
  check,
  date,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { lessons } from './lessons.ts';
import { users } from './users.ts';

// One row per learner, lesson and step. `step` is a LessonStep (text, validated by Zod, so a new
// step is not a migration). Re-posting a step keeps the best score and the first completion time.
export const lessonProgress = pgTable(
  'lesson_progress',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    step: text('step').notNull(),
    score: integer('score'),
    completedAt: timestamp('completed_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.lessonId, t.step] }),
    index('lesson_progress_lesson_id_idx').on(t.lessonId),
    check('lesson_progress_score_range', sql`${t.score} is null or ${t.score} between 0 and 100`),
  ],
);

// XP per learner per local day (the date the browser sent), which also gives the streak.
export const activityDays = pgTable(
  'activity_days',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    day: date('day', { mode: 'string' }).notNull(),
    xp: integer('xp').notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.userId, t.day] })],
);
