import { z } from 'zod';

import { cefrLevelSchema } from '../cefr.ts';
import { exerciseTypeSchema, lessonKindSchema } from '../course.ts';

export const lessonStatusSchema = z.enum(['draft', 'published']);
export type LessonStatus = z.infer<typeof lessonStatusSchema>;

const line = (max: number) => z.string().trim().min(1).max(max);

export const TeacherVocabInputSchema = z.strictObject({
  // With harakat, as the teacher wants it shown.
  arabic: line(100),
  english: line(200),
  note: z
    .string()
    .trim()
    .max(300)
    .nullish()
    .transform((v) => (v ? v : null)),
});
export type TeacherVocabInput = z.input<typeof TeacherVocabInputSchema>;

// The body of `POST /teacher/lessons` and `PUT /teacher/lessons/:id`: the whole lesson, vocab included.
// A PUT replaces the vocab list as a whole, so a missing word means "remove it".
export const TeacherLessonInputSchema = z.strictObject({
  title: line(120),
  level: cefrLevelSchema,
  topic: line(120),
  summary: line(500),
  goals: z.array(line(200)).max(10).default([]),
  grammarFocus: z.string().trim().max(300).default(''),
  // Written for the model, in English.
  scenario: line(2000),
  openingLine: line(500),
  status: lessonStatusSchema.default('draft'),
  position: z.number().int().min(0).max(9999).default(0),
  vocab: z.array(TeacherVocabInputSchema).max(100).default([]),
});
export type TeacherLessonInput = z.input<typeof TeacherLessonInputSchema>;

export const TeacherLessonSummarySchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  level: cefrLevelSchema,
  topic: z.string(),
  status: lessonStatusSchema,
  position: z.number().int(),
  vocabCount: z.number().int().nonnegative(),
  conversationCount: z.number().int().nonnegative(),
  updatedAt: z.string(),
});
export type TeacherLessonSummary = z.infer<typeof TeacherLessonSummarySchema>;

// `GET /teacher/lessons`: the teacher's own lessons, drafts included, by level then position.
export const TeacherLessonListResponseSchema = z.object({
  lessons: z.array(TeacherLessonSummarySchema),
});
export type TeacherLessonListResponse = z.infer<typeof TeacherLessonListResponseSchema>;

export const TeacherLessonDetailSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  level: cefrLevelSchema,
  topic: z.string(),
  summary: z.string(),
  goals: z.array(z.string()),
  grammarFocus: z.string(),
  scenario: z.string(),
  openingLine: z.string(),
  status: lessonStatusSchema,
  position: z.number().int(),
  updatedAt: z.string(),
  vocab: z.array(
    z.object({
      id: z.string(),
      arabic: z.string(),
      // Empty for teacher-made words (the form has no transliteration field).
      translit: z.string(),
      english: z.string(),
      note: z.string().nullable(),
      position: z.number().int(),
    }),
  ),
  // The course parts, read-only here: course lessons come from content files (the seed overwrites
  // edits), teacher-made lessons have none of them.
  course: z.object({
    unit: z.object({ code: z.string(), title: z.string() }).nullable(),
    kind: lessonKindSchema,
    exercises: z.array(z.object({ type: exerciseTypeSchema, count: z.number().int().positive() })),
    grammarBlocks: z.number().int().nonnegative(),
    cultureTitle: z.string().nullable(),
  }),
});
export type TeacherLessonDetail = z.infer<typeof TeacherLessonDetailSchema>;

// Answer of GET, POST (201) and PUT.
export const TeacherLessonResponseSchema = z.object({ lesson: TeacherLessonDetailSchema });
export type TeacherLessonResponse = z.infer<typeof TeacherLessonResponseSchema>;
