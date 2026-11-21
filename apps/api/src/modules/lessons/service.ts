import { CEFR_LEVELS, type LessonDetailResponse, type LessonListResponse } from '@arabic/shared';
import { and, asc, count, desc, eq } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import {
  conversations,
  lessonExercises,
  lessons,
  lessonVocab,
  units,
} from '../../db/schema/index.ts';
import { notFound } from '../../lib/errors.ts';
import type { AuthUser } from '../auth/sessions.ts';
import { progressByLesson } from '../course/state.ts';
import { visibleTeacherId } from '../course/visible.ts';

const summaryColumns = {
  id: lessons.id,
  slug: lessons.slug,
  title: lessons.title,
  level: lessons.level,
  topic: lessons.topic,
  summary: lessons.summary,
  goals: lessons.goals,
  grammarFocus: lessons.grammarFocus,
};

export async function listLessons(user: AuthUser): Promise<LessonListResponse> {
  const teacherId = visibleTeacherId(user);
  if (!teacherId) return { levels: [] };

  const rows = await db
    .select({ ...summaryColumns, conversationCount: count(conversations.id) })
    .from(lessons)
    // The join condition (not a WHERE) keeps lessons with no conversations at count 0, and counts
    // only my conversations, never another learner's.
    .leftJoin(
      conversations,
      and(eq(conversations.lessonId, lessons.id), eq(conversations.userId, user.id)),
    )
    .where(and(eq(lessons.teacherId, teacherId), eq(lessons.status, 'published')))
    .groupBy(lessons.id)
    .orderBy(asc(lessons.position), asc(lessons.title));

  return {
    levels: CEFR_LEVELS.map((level) => ({
      level,
      lessons: rows.filter((r) => r.level === level),
    })).filter((group) => group.lessons.length > 0),
  };
}

export async function getLesson(user: AuthUser, slug: string): Promise<LessonDetailResponse> {
  const teacherId = visibleTeacherId(user);
  if (!teacherId) throw notFound('Lesson not found');

  const [lesson] = await db
    .select({
      ...summaryColumns,
      kind: lessons.kind,
      grammarNote: lessons.grammarNote,
      cultureTip: lessons.cultureTip,
      unitCode: units.code,
      unitTitle: units.title,
    })
    .from(lessons)
    .leftJoin(units, eq(units.id, lessons.unitId))
    .where(
      and(
        eq(lessons.slug, slug),
        eq(lessons.teacherId, teacherId),
        eq(lessons.status, 'published'),
      ),
    );
  if (!lesson) throw notFound('Lesson not found');

  const [vocab, exercises, recent, [total], progress] = await Promise.all([
    db
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
    db
      .select({ data: lessonExercises.data })
      .from(lessonExercises)
      .where(eq(lessonExercises.lessonId, lesson.id))
      .orderBy(asc(lessonExercises.position)),
    db
      .select({
        id: conversations.id,
        turnCount: conversations.turnCount,
        lastMessageAt: conversations.lastMessageAt,
        createdAt: conversations.createdAt,
      })
      .from(conversations)
      .where(and(eq(conversations.lessonId, lesson.id), eq(conversations.userId, user.id)))
      .orderBy(desc(conversations.lastMessageAt))
      .limit(5),
    db
      .select({ n: count() })
      .from(conversations)
      .where(and(eq(conversations.lessonId, lesson.id), eq(conversations.userId, user.id))),
    progressByLesson(user.id, [lesson.id]),
  ]);
  const { unitCode, unitTitle, ...fields } = lesson;

  return {
    lesson: {
      ...fields,
      unit: unitCode && unitTitle ? { code: unitCode, title: unitTitle } : null,
      conversationCount: total?.n ?? 0,
    },
    vocab,
    exercises: exercises.map((e) => e.data),
    progress: progress.get(lesson.id) ?? { stepsDone: [], practiceScore: null },
    conversations: recent.map((c) => ({
      id: c.id,
      turnCount: c.turnCount,
      lastMessageAt: c.lastMessageAt.toISOString(),
      createdAt: c.createdAt.toISOString(),
    })),
  };
}
