import { integer, pgTable, text, unique } from 'drizzle-orm/pg-core';

import { createdAt, id } from './columns.ts';
import { cefrLevel } from './enums.ts';

// A unit groups the lessons of one theme inside a level ("A1.1 Greetings"). Content, not user data.
export const units = pgTable(
  'units',
  {
    id: id(),
    level: cefrLevel('level').notNull(),
    position: integer('position').notNull(),
    // 'A1.1': unique, and what content files point at.
    code: text('code').notNull().unique(),
    title: text('title').notNull(),
    // The can-do sentence shown on the course path.
    summary: text('summary').notNull(),
    createdAt: createdAt(),
  },
  (t) => [unique('units_level_position_unique').on(t.level, t.position)],
);
