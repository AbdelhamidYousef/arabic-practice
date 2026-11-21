import { z } from 'zod';

import { cefrLevelSchema } from '../cefr.ts';

import { MistakeTypeCountSchema, RecentMistakeSchema, mistakeTypeSchema } from './progress.ts';

export const TeacherLearnerSummarySchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string().nullable(),
  level: cefrLevelSchema,
  // Newest conversation activity, null when the learner has not practised yet.
  lastActivityAt: z.string().nullable(),
  // Learner messages sent since Monday 00:00 UTC.
  turnsThisWeek: z.number().int().nonnegative(),
  // Up to three, most frequent first.
  topMistakeTypes: z.array(MistakeTypeCountSchema),
});
export type TeacherLearnerSummary = z.infer<typeof TeacherLearnerSummarySchema>;

// `GET /teacher/learners`: my learners (signed-up students, not guests), by name.
export const TeacherLearnerListResponseSchema = z.object({
  learners: z.array(TeacherLearnerSummarySchema),
});
export type TeacherLearnerListResponse = z.infer<typeof TeacherLearnerListResponseSchema>;

// `PATCH /teacher/learners/:id`
export const UpdateLearnerRequestSchema = z.strictObject({ level: cefrLevelSchema });
export type UpdateLearnerRequest = z.infer<typeof UpdateLearnerRequestSchema>;

export const TeacherLearnerSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string().nullable(),
  level: cefrLevelSchema,
  createdAt: z.string(),
  lastSeenAt: z.string(),
});
export type TeacherLearner = z.infer<typeof TeacherLearnerSchema>;

export const UpdateLearnerResponseSchema = z.object({ learner: TeacherLearnerSchema });
export type UpdateLearnerResponse = z.infer<typeof UpdateLearnerResponseSchema>;

export const TeacherConversationItemSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  lessonTitle: z.string(),
  turnCount: z.number().int().nonnegative(),
  lastMessageAt: z.string(),
  createdAt: z.string(),
});
export type TeacherConversationItem = z.infer<typeof TeacherConversationItemSchema>;

// `GET /teacher/learners/:id`
export const TeacherLearnerDetailResponseSchema = z.object({
  learner: TeacherLearnerSchema,
  conversations: z.array(TeacherConversationItemSchema),
  mistakesByType: z.array(MistakeTypeCountSchema),
  recentMistakes: z.array(RecentMistakeSchema),
});
export type TeacherLearnerDetailResponse = z.infer<typeof TeacherLearnerDetailResponseSchema>;

export const TranscriptMistakeSchema = z.object({
  id: z.string(),
  type: mistakeTypeSchema,
  original: z.string(),
  correction: z.string(),
  explanation: z.string(),
});

export const TranscriptMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['learner', 'partner']),
  text: z.string(),
  glossEn: z.string().nullable(),
  createdAt: z.string(),
  // Learner messages only, once the correction call has finished.
  correction: z
    .object({
      isCorrect: z.boolean(),
      corrected: z.string(),
      praise: z.string().nullable(),
      mistakes: z.array(TranscriptMistakeSchema),
    })
    .nullable(),
});
export type TranscriptMessage = z.infer<typeof TranscriptMessageSchema>;

// `GET /teacher/conversations/:id`
export const TeacherTranscriptResponseSchema = z.object({
  conversation: z.object({
    id: z.string(),
    lessonTitle: z.string(),
    learner: z.object({ id: z.string(), displayName: z.string() }),
    turnCount: z.number().int().nonnegative(),
    createdAt: z.string(),
  }),
  messages: z.array(TranscriptMessageSchema),
});
export type TeacherTranscriptResponse = z.infer<typeof TeacherTranscriptResponseSchema>;

// `POST /teacher/learners/:id/reset-link`: the token is in this one response and never again.
export const CreateResetLinkResponseSchema = z.object({
  // Path on the web app, e.g. `/reset/<token>`; the web adds its own origin.
  resetPath: z.string(),
  expiresAt: z.string(),
});
export type CreateResetLinkResponse = z.infer<typeof CreateResetLinkResponseSchema>;
