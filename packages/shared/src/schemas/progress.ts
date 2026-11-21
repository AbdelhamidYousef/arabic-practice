import { z } from 'zod';

// Same values as the `mistake_type` database enum (apps/api/src/db/schema/enums.ts).
export const MISTAKE_TYPES = [
  'grammar',
  'vocabulary',
  'harakat',
  'spelling',
  'word_order',
  'register',
] as const;
export const mistakeTypeSchema = z.enum(MISTAKE_TYPES);
export type MistakeType = z.infer<typeof mistakeTypeSchema>;

export const MistakeTypeCountSchema = z.object({
  type: mistakeTypeSchema,
  count: z.number().int().nonnegative(),
});
export type MistakeTypeCount = z.infer<typeof MistakeTypeCountSchema>;

// One mistake as shown in lists: what was written, the fix, why, and which lesson it came from.
export const RecentMistakeSchema = z.object({
  id: z.string(),
  type: mistakeTypeSchema,
  original: z.string(),
  correction: z.string(),
  explanation: z.string(),
  createdAt: z.string(),
  lessonTitle: z.string(),
});
export type RecentMistake = z.infer<typeof RecentMistakeSchema>;

export const ProgressWeekSchema = z.object({
  // The Monday (UTC) that starts the ISO week, as YYYY-MM-DD.
  weekStart: z.string(),
  turns: z.number().int().nonnegative(),
  mistakes: z.number().int().nonnegative(),
  // mistakes / turns, 0 when there were no turns.
  mistakesPerTurn: z.number().nonnegative(),
});
export type ProgressWeek = z.infer<typeof ProgressWeekSchema>;

// `GET /progress`
export const ProgressResponseSchema = z.object({
  totals: z.object({
    conversations: z.number().int().nonnegative(),
    turns: z.number().int().nonnegative(),
    mistakes: z.number().int().nonnegative(),
  }),
  // Only types with at least one mistake, most frequent first.
  mistakesByType: z.array(MistakeTypeCountSchema),
  // Always 8 entries, oldest first, the last one being the current week.
  weeks: z.array(ProgressWeekSchema),
  recentMistakes: z.array(RecentMistakeSchema),
});
export type ProgressResponse = z.infer<typeof ProgressResponseSchema>;
