import { z } from 'zod';

const counters = {
  calls: z.number().int().nonnegative(),
  inputTokens: z.number().int().nonnegative(),
  outputTokens: z.number().int().nonnegative(),
  // Millionths of a US dollar.
  costMicroUsd: z.number().int().nonnegative(),
};

export const UsageDaySchema = z.object({
  date: z.string(),
  limited: z.number().int().nonnegative(),
  ...counters,
});
export const UsageByPurposeSchema = z.object({ purpose: z.string(), ...counters });
export const UsageByModelSchema = z.object({ model: z.string(), ...counters });

// `GET /teacher/usage`: calls by me and my learners (guests of mine included). `calls` are provider
// calls; `limited` counts requests we refused ourselves (caps, kill switch).
export const TeacherUsageResponseSchema = z.object({
  // Always 30 entries (UTC days), oldest first, today last.
  days: z.array(UsageDaySchema),
  // Same 30-day window, most calls first.
  byPurpose: z.array(UsageByPurposeSchema),
  byModel: z.array(UsageByModelSchema),
  today: z.object({
    date: z.string(),
    caps: z.object({
      learnerTurns: z.number().int().nonnegative(),
      guestTurns: z.number().int().nonnegative(),
      callsPerModel: z.number().int().nonnegative(),
    }),
    // The per-model cap counts everyone's calls on this server, not just my class's.
    models: z.array(z.object({ model: z.string(), calls: z.number().int().nonnegative() })),
    // People in my class with at least one turn today.
    people: z.array(
      z.object({
        userId: z.string(),
        displayName: z.string(),
        isGuest: z.boolean(),
        turns: z.number().int().nonnegative(),
      }),
    ),
  }),
});
export type TeacherUsageResponse = z.infer<typeof TeacherUsageResponseSchema>;
