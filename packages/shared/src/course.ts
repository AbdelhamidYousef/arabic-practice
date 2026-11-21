import { z } from 'zod';

import { cefrLevelSchema } from './cefr.ts';

// The course model, shared by the API, the content files and the web player. A lesson is
// words -> practice (exercises, no AI) -> grammar -> culture -> talk (the AI partner, optional).

export const LESSON_STEPS = ['words', 'practice', 'grammar', 'culture', 'talk'] as const;
export const lessonStepSchema = z.enum(LESSON_STEPS);
export type LessonStep = z.infer<typeof lessonStepSchema>;

export const LESSON_KINDS = ['letters', 'lesson', 'review'] as const;
export const lessonKindSchema = z.enum(LESSON_KINDS);
export type LessonKind = z.infer<typeof lessonKindSchema>;

const options = z.array(z.string().min(1)).min(2).max(4);

// Exercises. `answer` is an index into `options`; answers ship to the browser (practice, not an exam).
export const chooseExerciseSchema = z.object({
  type: z.literal('choose'),
  prompt: z.string().min(1),
  promptArabic: z.string().min(1).optional(),
  options,
  answer: z.number().int().min(0),
});

export const matchExerciseSchema = z.object({
  type: z.literal('match'),
  prompt: z.string().min(1),
  pairs: z
    .array(z.object({ arabic: z.string().min(1), english: z.string().min(1) }))
    .min(3)
    .max(5),
});

export const buildExerciseSchema = z.object({
  type: z.literal('build'),
  prompt: z.string().min(1),
  english: z.string().min(1),
  // The Arabic words in the correct order.
  words: z.array(z.string().min(1)).min(2).max(8),
  distractors: z.array(z.string().min(1)).max(3),
});

export const gapExerciseSchema = z.object({
  type: z.literal('gap'),
  prompt: z.string().min(1),
  before: z.string(),
  after: z.string(),
  english: z.string().min(1),
  options,
  answer: z.number().int().min(0),
});

export const listenExerciseSchema = z.object({
  type: z.literal('listen'),
  prompt: z.string().min(1),
  // The Arabic the browser voice reads aloud.
  audio: z.string().min(1),
  options,
  answer: z.number().int().min(0),
});

const answerInRange = (e: { options: string[]; answer: number }) => e.answer < e.options.length;
const answerMessage = { message: 'answer must be an index into options', path: ['answer'] };

export const ExerciseSchema = z.discriminatedUnion('type', [
  chooseExerciseSchema.refine(answerInRange, answerMessage),
  matchExerciseSchema,
  buildExerciseSchema,
  gapExerciseSchema.refine(answerInRange, answerMessage),
  listenExerciseSchema.refine(answerInRange, answerMessage),
]);
export type Exercise = z.infer<typeof ExerciseSchema>;
export const EXERCISE_TYPES = ['choose', 'match', 'build', 'gap', 'listen'] as const;

export const GrammarBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('p'), text: z.string().min(1) }),
  z.object({
    type: z.literal('example'),
    arabic: z.string().min(1),
    translit: z.string().min(1),
    english: z.string().min(1),
  }),
  z.object({
    type: z.literal('table'),
    head: z.array(z.string()).min(1),
    rows: z.array(z.array(z.string())).min(1),
  }),
]);
export type GrammarBlock = z.infer<typeof GrammarBlockSchema>;

export const CultureTipSchema = z.object({ title: z.string().min(1), body: z.string().min(1) });
export type CultureTip = z.infer<typeof CultureTipSchema>;

// --- progress ---

// The learner's local date as the browser sees it.
export const localDaySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD');

export const LessonProgressRequestSchema = z.object({
  step: lessonStepSchema,
  score: z.number().int().min(0).max(100).optional(),
  day: localDaySchema,
});
export type LessonProgressRequest = z.infer<typeof LessonProgressRequestSchema>;

export const LessonProgressResponseSchema = z.object({
  xpGained: z.number().int().nonnegative(),
  xpToday: z.number().int().nonnegative(),
  streak: z.number().int().nonnegative(),
});
export type LessonProgressResponse = z.infer<typeof LessonProgressResponseSchema>;

// What the caller has done in one lesson.
export const LessonProgressStateSchema = z.object({
  stepsDone: z.array(lessonStepSchema),
  practiceScore: z.number().int().min(0).max(100).nullable(),
});
export type LessonProgressState = z.infer<typeof LessonProgressStateSchema>;

// --- GET /course ---

export const CourseLessonSchema = z.object({
  slug: z.string(),
  title: z.string(),
  kind: lessonKindSchema,
  position: z.number().int(),
  stepsDone: z.array(lessonStepSchema),
  practiceScore: z.number().int().min(0).max(100).nullable(),
});
export type CourseLesson = z.infer<typeof CourseLessonSchema>;

export const CourseUnitSchema = z.object({
  code: z.string(),
  title: z.string(),
  summary: z.string(),
  position: z.number().int(),
  lessons: z.array(CourseLessonSchema),
});
export type CourseUnit = z.infer<typeof CourseUnitSchema>;

export const CourseStatsSchema = z.object({
  streak: z.number().int().nonnegative(),
  xpToday: z.number().int().nonnegative(),
  xpTotal: z.number().int().nonnegative(),
  wordsLearned: z.number().int().nonnegative(),
});
export type CourseStats = z.infer<typeof CourseStatsSchema>;

export const CourseResponseSchema = z.object({
  levels: z.array(z.object({ level: cefrLevelSchema, units: z.array(CourseUnitSchema) })),
  // Slug of the first lesson (in course order) that is not finished; null when all are.
  nextUp: z.string().nullable(),
  stats: CourseStatsSchema,
});
export type CourseResponse = z.infer<typeof CourseResponseSchema>;
