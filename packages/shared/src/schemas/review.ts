import { z } from 'zod';

export const ReviewCardSchema = z.object({
  vocabId: z.string(),
  arabic: z.string(),
  english: z.string(),
  note: z.string().nullable(),
  lessonTitle: z.string(),
  box: z.number().int().min(1).max(5),
  dueAt: z.string(),
});
export type ReviewCard = z.infer<typeof ReviewCardSchema>;

// `GET /review/due`: at most 20 cards, most overdue first. `totalDue` counts all due cards, so the
// page can say "20 of 57 today".
export const ReviewDueResponseSchema = z.object({
  cards: z.array(ReviewCardSchema),
  totalDue: z.number().int().nonnegative(),
});
export type ReviewDueResponse = z.infer<typeof ReviewDueResponseSchema>;

export const ReviewAnswerRequestSchema = z.strictObject({ correct: z.boolean() });
export type ReviewAnswerRequest = z.infer<typeof ReviewAnswerRequestSchema>;

// `POST /review/:vocabId`: where the card went.
export const ReviewAnswerResponseSchema = z.object({
  vocabId: z.string(),
  box: z.number().int().min(1).max(5),
  dueAt: z.string(),
  reviews: z.number().int().nonnegative(),
  lapses: z.number().int().nonnegative(),
});
export type ReviewAnswerResponse = z.infer<typeof ReviewAnswerResponseSchema>;
