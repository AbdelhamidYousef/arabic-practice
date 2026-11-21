import { normalizeArabic } from '@arabic/shared';
import { and, eq, notInArray } from 'drizzle-orm';

import { contentLessons, contentUnits } from '../../content/index.ts';
import { assertValidContent } from '../../content/validate.ts';
import { db } from '../client.ts';
import { lessonExercises, lessons, lessonVocab, units } from '../schema/index.ts';

export interface CourseSeedSummary {
  units: number;
  lessons: number;
  vocab: number;
  exercises: number;
}

// Loads the content files: units and lessons are upserted by code and slug, owned by the given
// teacher and published. A lesson's words are upserted by their plain form (never deleted and
// re-inserted: learners' review cards point at the word rows), and its exercises are replaced as a
// whole (nothing points at them). Run as often as you like.
export async function seedCourse(teacherId: string): Promise<CourseSeedSummary> {
  // Checked before anything is written: a bad edit fails here, not half-way.
  assertValidContent(contentLessons, contentUnits);

  const unitIds = new Map<string, string>();
  for (const u of contentUnits) {
    const values = {
      level: u.level,
      position: u.position,
      code: u.code,
      title: u.title,
      summary: u.summary,
    };
    const [row] = await db
      .insert(units)
      .values(values)
      .onConflictDoUpdate({ target: units.code, set: values })
      .returning({ id: units.id });
    if (!row) throw new Error(`seed: unit ${u.code} upsert returned no row`);
    unitIds.set(u.code, row.id);
  }

  const nextPosition = new Map<string, number>();
  let vocabCount = 0;
  let exerciseCount = 0;
  for (const lesson of contentLessons) {
    const unit = contentUnits.find((u) => u.code === lesson.unit);
    const unitId = unitIds.get(lesson.unit);
    if (!unit || !unitId) throw new Error(`seed: lesson ${lesson.slug} has no unit ${lesson.unit}`);
    const position = (nextPosition.get(lesson.unit) ?? 0) + 1;
    nextPosition.set(lesson.unit, position);

    const values = {
      teacherId,
      slug: lesson.slug,
      title: lesson.title,
      level: unit.level,
      topic: lesson.topic,
      summary: lesson.summary,
      goals: lesson.goals,
      grammarFocus: lesson.grammarFocus,
      scenario: lesson.scenario,
      openingLine: lesson.openingLine,
      status: 'published' as const,
      position,
      unitId,
      kind: lesson.kind,
      grammarNote: lesson.grammarNote,
      cultureTip: lesson.cultureTip,
    };
    const [row] = await db
      .insert(lessons)
      .values(values)
      .onConflictDoUpdate({ target: lessons.slug, set: values })
      .returning({ id: lessons.id });
    if (!row) throw new Error(`seed: lesson ${lesson.slug} upsert returned no row`);

    const vocabRows = lesson.vocab.map((v, i) => ({
      lessonId: row.id,
      arabic: v.arabic,
      arabicPlain: normalizeArabic(v.arabic),
      translit: v.translit,
      english: v.english,
      note: v.note ?? null,
      position: i + 1,
    }));
    for (const v of vocabRows) {
      await db
        .insert(lessonVocab)
        .values(v)
        .onConflictDoUpdate({
          target: [lessonVocab.lessonId, lessonVocab.arabicPlain],
          set: {
            arabic: v.arabic,
            translit: v.translit,
            english: v.english,
            note: v.note,
            position: v.position,
          },
        });
    }
    await db.delete(lessonVocab).where(
      and(
        eq(lessonVocab.lessonId, row.id),
        notInArray(
          lessonVocab.arabicPlain,
          vocabRows.map((v) => v.arabicPlain),
        ),
      ),
    );
    vocabCount += vocabRows.length;

    await db.transaction(async (tx) => {
      await tx.delete(lessonExercises).where(eq(lessonExercises.lessonId, row.id));
      await tx.insert(lessonExercises).values(
        lesson.exercises.map((data, i) => ({
          lessonId: row.id,
          position: i + 1,
          type: data.type,
          data,
        })),
      );
    });
    exerciseCount += lesson.exercises.length;
  }

  return {
    units: contentUnits.length,
    lessons: contentLessons.length,
    vocab: vocabCount,
    exercises: exerciseCount,
  };
}
