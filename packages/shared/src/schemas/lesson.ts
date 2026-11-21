import { z } from 'zod';

import { cefrLevelSchema } from '../cefr.ts';
import {
  CultureTipSchema,
  ExerciseSchema,
  GrammarBlockSchema,
  LessonProgressStateSchema,
  lessonKindSchema,
} from '../course.ts';

// A lesson as a learner sees it in lists. The scenario (the prompt written for the model) and the
// opening line stay server-side until a conversation starts.
export const LessonSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  level: cefrLevelSchema,
  topic: z.string(),
  summary: z.string(),
  goals: z.array(z.string()),
  grammarFocus: z.string(),
  // How many conversations the signed-in person has had on this lesson.
  conversationCount: z.number().int().nonnegative(),
});
export type LessonSummary = z.infer<typeof LessonSummarySchema>;

// `GET /lessons`: only levels that have at least one lesson, in CEFR order.
export const LessonListResponseSchema = z.object({
  levels: z.array(z.object({ level: cefrLevelSchema, lessons: z.array(LessonSummarySchema) })),
});
export type LessonListResponse = z.infer<typeof LessonListResponseSchema>;

export const LessonVocabSchema = z.object({
  id: z.string(),
  arabic: z.string(),
  translit: z.string(),
  english: z.string(),
  note: z.string().nullable(),
  position: z.number().int(),
});
export type LessonVocab = z.infer<typeof LessonVocabSchema>;

export const LessonConversationSchema = z.object({
  id: z.string(),
  turnCount: z.number().int().nonnegative(),
  lastMessageAt: z.string(),
  createdAt: z.string(),
});
export type LessonConversation = z.infer<typeof LessonConversationSchema>;

// The course part of a lesson. Teacher-made lessons have no unit, no grammar note, no culture tip
// and no exercises.
export const LessonCourseSchema = z.object({
  unit: z.object({ code: z.string(), title: z.string() }).nullable(),
  kind: lessonKindSchema,
  grammarNote: z.array(GrammarBlockSchema),
  cultureTip: CultureTipSchema.nullable(),
});

export const LessonDetailResponseSchema = z.object({
  lesson: LessonSummarySchema.extend(LessonCourseSchema.shape),
  vocab: z.array(LessonVocabSchema),
  // Answers are included: this is practice, not an exam.
  exercises: z.array(ExerciseSchema),
  // What the caller has done in this lesson.
  progress: LessonProgressStateSchema,
  // The caller's five most recent conversations on this lesson, newest first.
  conversations: z.array(LessonConversationSchema),
});
export type LessonDetailResponse = z.infer<typeof LessonDetailResponseSchema>;
