import { CEFR_LEVELS, LESSON_KINDS } from '@arabic/shared';
import { pgEnum } from 'drizzle-orm/pg-core';

// The values come from @arabic/shared so the database, the API's Zod schemas and the web all list
// the same levels in the same order.
export const cefrLevel = pgEnum('cefr_level', CEFR_LEVELS);

export const userRole = pgEnum('user_role', ['learner', 'teacher']);

export const lessonStatus = pgEnum('lesson_status', ['draft', 'published']);

export const lessonKind = pgEnum('lesson_kind', LESSON_KINDS);

export const messageRole = pgEnum('message_role', ['learner', 'partner']);

export const mistakeType = pgEnum('mistake_type', [
  'grammar',
  'vocabulary',
  'harakat',
  'spelling',
  'word_order',
  'register',
]);

export const aiPurpose = pgEnum('ai_purpose', ['correction', 'reply', 'gloss', 'eval']);

// `limited` is a call we refused ourselves (a cap or the kill switch), recorded so the usage page
// can show it; `error` is a provider failure; `pending` is written BEFORE the provider is called (so
// parallel calls see each other in the caps) and updated when the call ends. A pending row older than
// 5 minutes is a call whose instance died: it still counts towards the caps and is shown as an error.
export const aiCallStatus = pgEnum('ai_call_status', ['ok', 'error', 'limited', 'pending']);
