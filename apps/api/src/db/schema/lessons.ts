import type { CultureTip, GrammarBlock } from '@arabic/shared';
import { index, integer, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { createdAt, id, updatedAt } from './columns.ts';
import { cefrLevel, lessonKind, lessonStatus } from './enums.ts';
import { units } from './units.ts';
import { users } from './users.ts';

export const lessons = pgTable(
  'lessons',
  {
    id: id(),
    // Restrict, not cascade: deleting a teacher must never silently wipe lessons, and through them
    // every learner's conversations. Hand the lessons over first.
    teacherId: uuid('teacher_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    level: cefrLevel('level').notNull(),
    topic: text('topic').notNull(),
    summary: text('summary').notNull(),
    goals: text('goals').array().notNull().default([]),
    grammarFocus: text('grammar_focus').notNull().default(''),
    // What the AI partner plays, written for the model in English ("You are a shopkeeper...").
    scenario: text('scenario').notNull(),
    // The partner's first message, written by the teacher with full harakat.
    openingLine: text('opening_line').notNull(),
    // Course lessons belong to a unit; teacher-made lessons have none. A deleted unit orphans its
    // lessons instead of deleting them (and every learner's conversations with them).
    unitId: uuid('unit_id').references(() => units.id, { onDelete: 'set null' }),
    kind: lessonKind('kind').notNull().default('lesson'),
    grammarNote: jsonb('grammar_note').$type<GrammarBlock[]>().notNull().default([]),
    cultureTip: jsonb('culture_tip').$type<CultureTip | null>(),
    status: lessonStatus('status').notNull().default('draft'),
    position: integer('position').notNull().default(0),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index('lessons_unit_id_idx').on(t.unitId),
    index('lessons_teacher_status_level_position_idx').on(
      t.teacherId,
      t.status,
      t.level,
      t.position,
    ),
  ],
);
