import { randomUUID } from 'node:crypto';

import {
  EXERCISE_TYPES,
  normalizeArabic,
  type ExerciseType,
  type TeacherLessonDetail,
  type TeacherLessonInput,
  type TeacherLessonListResponse,
  TeacherLessonInputSchema,
} from '@arabic/shared';
import { and, asc, count, eq, like, or, sql } from 'drizzle-orm';
import type { z } from 'zod';

import { db } from '../../db/client.ts';
import {
  conversations,
  lessonExercises,
  lessons,
  lessonVocab,
  units,
} from '../../db/schema/index.ts';
import { uniqueViolation } from '../../lib/db-errors.ts';
import { conflict, notFound, unprocessable } from '../../lib/errors.ts';
import type { AuthUser } from '../auth/sessions.ts';

import { baseSlugFor, firstFreeSlug } from './slug.ts';

type LessonInput = z.output<typeof TeacherLessonInputSchema>;
type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const SLUG_ATTEMPTS = 8;

// Ownership is `teacher_id = me` in every statement below: a lesson of another teacher is the same
// 404 as a lesson that does not exist.
const mine = (teacher: AuthUser, id: string) =>
  and(eq(lessons.id, id), eq(lessons.teacherId, teacher.id));

export async function listLessons(teacher: AuthUser): Promise<TeacherLessonListResponse> {
  const [rows, vocabCounts, conversationCounts] = await Promise.all([
    db
      .select({
        id: lessons.id,
        slug: lessons.slug,
        title: lessons.title,
        level: lessons.level,
        topic: lessons.topic,
        status: lessons.status,
        position: lessons.position,
        updatedAt: lessons.updatedAt,
      })
      .from(lessons)
      .where(eq(lessons.teacherId, teacher.id))
      // The enum sorts in CEFR order (A1 first), so grouping by level needs no CASE.
      .orderBy(asc(lessons.level), asc(lessons.position), asc(lessons.title)),
    db
      .select({ lessonId: lessonVocab.lessonId, n: count() })
      .from(lessonVocab)
      .innerJoin(lessons, eq(lessons.id, lessonVocab.lessonId))
      .where(eq(lessons.teacherId, teacher.id))
      .groupBy(lessonVocab.lessonId),
    db
      .select({ lessonId: conversations.lessonId, n: count() })
      .from(conversations)
      .innerJoin(lessons, eq(lessons.id, conversations.lessonId))
      .where(eq(lessons.teacherId, teacher.id))
      .groupBy(conversations.lessonId),
  ]);
  const vocabBy = new Map(vocabCounts.map((r) => [r.lessonId, r.n]));
  const convBy = new Map(conversationCounts.map((r) => [r.lessonId, r.n]));
  return {
    lessons: rows.map((r) => ({
      ...r,
      updatedAt: r.updatedAt.toISOString(),
      vocabCount: vocabBy.get(r.id) ?? 0,
      conversationCount: convBy.get(r.id) ?? 0,
    })),
  };
}

async function loadDetail(
  reader: Pick<typeof db, 'select'>,
  teacher: AuthUser,
  id: string,
): Promise<TeacherLessonDetail> {
  const [lesson] = await reader.select().from(lessons).where(mine(teacher, id));
  if (!lesson) throw notFound('Lesson not found');
  const [vocab, exerciseCounts, unitRows] = await Promise.all([
    reader
      .select({
        id: lessonVocab.id,
        arabic: lessonVocab.arabic,
        translit: lessonVocab.translit,
        english: lessonVocab.english,
        note: lessonVocab.note,
        position: lessonVocab.position,
      })
      .from(lessonVocab)
      .where(eq(lessonVocab.lessonId, lesson.id))
      .orderBy(asc(lessonVocab.position), asc(lessonVocab.createdAt)),
    reader
      .select({ type: lessonExercises.type, n: count() })
      .from(lessonExercises)
      .where(eq(lessonExercises.lessonId, lesson.id))
      .groupBy(lessonExercises.type),
    lesson.unitId
      ? reader
          .select({ code: units.code, title: units.title })
          .from(units)
          .where(eq(units.id, lesson.unitId))
      : Promise.resolve([]),
  ]);
  const order = (type: string) => EXERCISE_TYPES.indexOf(type as ExerciseType);
  return {
    id: lesson.id,
    slug: lesson.slug,
    title: lesson.title,
    level: lesson.level,
    topic: lesson.topic,
    summary: lesson.summary,
    goals: lesson.goals,
    grammarFocus: lesson.grammarFocus,
    scenario: lesson.scenario,
    openingLine: lesson.openingLine,
    status: lesson.status,
    position: lesson.position,
    updatedAt: lesson.updatedAt.toISOString(),
    vocab,
    course: {
      unit: unitRows[0] ?? null,
      kind: lesson.kind,
      exercises: exerciseCounts
        .filter((r) => order(r.type) >= 0)
        .sort((a, b) => order(a.type) - order(b.type))
        .map((r) => ({ type: r.type as ExerciseType, count: r.n })),
      grammarBlocks: lesson.grammarNote.length,
      cultureTitle: lesson.cultureTip?.title ?? null,
    },
  };
}

export const getLesson = (teacher: AuthUser, id: string) => loadDetail(db, teacher, id);

// Rows for lesson_vocab, with arabic_plain computed here (never by the database). Two words that
// normalise to the same plain form would break the unique index; say which ones instead of a 500.
function vocabRows(lessonId: string, vocab: LessonInput['vocab']) {
  const seen = new Map<string, number>();
  return vocab.map((word, position) => {
    const arabicPlain = normalizeArabic(word.arabic);
    if (arabicPlain === '') {
      throw unprocessable('A vocabulary word has no letters', { index: position });
    }
    const earlier = seen.get(arabicPlain);
    if (earlier !== undefined) {
      throw unprocessable('Two vocabulary words are the same word without harakat', {
        indexes: [earlier, position],
      });
    }
    seen.set(arabicPlain, position);
    return {
      lessonId,
      arabic: word.arabic,
      arabicPlain,
      english: word.english,
      note: word.note,
      position,
    };
  });
}

const lessonColumns = (input: LessonInput) => ({
  title: input.title,
  level: input.level,
  topic: input.topic,
  summary: input.summary,
  goals: input.goals,
  grammarFocus: input.grammarFocus,
  scenario: input.scenario,
  openingLine: input.openingLine,
  status: input.status,
  position: input.position,
});

async function takenSlugs(base: string): Promise<Set<string>> {
  // `_` and `%` are wildcards in LIKE; a slug never contains them, so the pattern is safe as is.
  const rows = await db
    .select({ slug: lessons.slug })
    .from(lessons)
    .where(or(eq(lessons.slug, base), like(lessons.slug, `${base}-%`)));
  return new Set(rows.map((r) => r.slug));
}

export async function createLesson(
  teacher: AuthUser,
  input: LessonInput,
): Promise<TeacherLessonDetail> {
  const id = randomUUID();
  const rows = vocabRows(id, input.vocab);
  const base = baseSlugFor(input.title, id);

  // Two teachers saving "Greetings" at once both see the name free; the unique index lets one win
  // and this loop gives the loser the next suffix. The whole insert is one transaction, so a lost
  // race leaves nothing behind.
  for (let attempt = 0; attempt < SLUG_ATTEMPTS; attempt++) {
    const slug = firstFreeSlug(base, await takenSlugs(base));
    try {
      await db.transaction(async (tx) => {
        await tx
          .insert(lessons)
          .values({ id, teacherId: teacher.id, slug, ...lessonColumns(input) });
        if (rows.length > 0) await tx.insert(lessonVocab).values(rows);
      });
      return await getLesson(teacher, id);
    } catch (err) {
      if (uniqueViolation(err) !== 'lessons_slug_unique') throw err;
    }
  }
  throw conflict('Could not find a free slug for this title, try again');
}

async function replaceVocab(tx: Tx, lessonId: string, vocab: LessonInput['vocab']) {
  const rows = vocabRows(lessonId, vocab);
  await tx.delete(lessonVocab).where(eq(lessonVocab.lessonId, lessonId));
  if (rows.length > 0) await tx.insert(lessonVocab).values(rows);
}

// The slug stays as it was when the title changes: it is the lesson's address in learners' links
// and bookmarks. The vocab list is replaced as a whole, in the same transaction as the lesson row.
// Replacing deletes the old vocab rows, and with them every learner's flashcard for those words
// (vocab_cards cascade): an edit that keeps a word keeps its text but not its review history.
export async function updateLesson(
  teacher: AuthUser,
  id: string,
  input: LessonInput,
): Promise<TeacherLessonDetail> {
  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(lessons)
      .set({ ...lessonColumns(input), updatedAt: sql`now()` })
      .where(mine(teacher, id))
      .returning({ id: lessons.id });
    if (!updated) throw notFound('Lesson not found');
    await replaceVocab(tx, id, input.vocab);
    return loadDetail(tx, teacher, id);
  });
}

// Blocked once learners have practised the lesson: deleting would cascade away their conversations,
// corrections and mistakes. The teacher can set it back to draft instead, which hides it.
export async function deleteLesson(teacher: AuthUser, id: string): Promise<void> {
  const [lesson] = await db.select({ id: lessons.id }).from(lessons).where(mine(teacher, id));
  if (!lesson) throw notFound('Lesson not found');

  const deleted = await db
    .delete(lessons)
    .where(
      and(
        mine(teacher, id),
        sql`not exists (select 1 from ${conversations} where ${conversations.lessonId} = ${lessons.id})`,
      ),
    )
    .returning({ id: lessons.id });
  if (deleted.length > 0) return;

  const [{ n } = { n: 0 }] = await db
    .select({ n: count() })
    .from(conversations)
    .where(eq(conversations.lessonId, id));
  if (n === 0) throw notFound('Lesson not found'); // deleted by someone else in between
  throw conflict('Learners have practised this lesson; set it to draft to hide it instead', {
    conversationCount: n,
  });
}

export type { TeacherLessonInput };
