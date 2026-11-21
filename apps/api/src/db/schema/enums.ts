import { CEFR_LEVELS } from '@arabic/shared';
import { pgEnum } from 'drizzle-orm/pg-core';

// The values come from @arabic/shared so the database, the API's Zod schemas and the web all list
// the same levels in the same order.
export const cefrLevel = pgEnum('cefr_level', CEFR_LEVELS);

export const userRole = pgEnum('user_role', ['learner', 'teacher']);

export const lessonStatus = pgEnum('lesson_status', ['draft', 'published']);
