import { normalizeArabic } from '@arabic/shared';
import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import {
  createExercise,
  createLesson,
  createTeacher,
  createUnit,
  createVocab,
} from '../test/factories.ts';

import { db } from './client.ts';
import { lessonExercises, lessons, lessonVocab, units, users } from './schema/index.ts';

describe('lessons', () => {
  it('stores goals as an array and defaults to a draft at position 0', async () => {
    const lesson = await createLesson({
      goals: ['Greet someone', 'Say your name'],
      status: undefined,
    });
    expect(lesson.goals).toEqual(['Greet someone', 'Say your name']);
    expect(lesson.status).toBe('draft');
    expect(lesson.position).toBe(0);
  });

  it('keeps slugs unique', async () => {
    const teacher = await createTeacher();
    await createLesson({ teacherId: teacher.id, slug: 'greetings' });
    await expect(createLesson({ teacherId: teacher.id, slug: 'greetings' })).rejects.toThrow();
  });

  it('refuses to delete a teacher who still has lessons', async () => {
    const lesson = await createLesson();
    await expect(db.delete(users).where(eq(users.id, lesson.teacherId))).rejects.toThrow();
  });

  it('bumps updated_at on update through the trigger', async () => {
    const lesson = await createLesson();
    await new Promise((r) => setTimeout(r, 15));
    const [after] = await db
      .update(lessons)
      .set({ title: 'Renamed' })
      .where(eq(lessons.id, lesson.id))
      .returning();
    expect(after?.updatedAt.getTime()).toBeGreaterThan(lesson.updatedAt.getTime());
  });
});

describe('lesson vocabulary', () => {
  it('rejects a second entry with the same plain form in one lesson', async () => {
    const lesson = await createLesson();
    // The voweled and unvoweled spellings are one word to a learner.
    await createVocab(lesson.id, {
      arabic: 'مَدْرَسَةٌ',
      arabicPlain: normalizeArabic('مَدْرَسَةٌ'),
    });
    await expect(
      createVocab(lesson.id, { arabic: 'مَدْرَسَه', arabicPlain: normalizeArabic('مَدْرَسَه') }),
    ).rejects.toThrow();
  });

  it('allows the same word in two different lessons', async () => {
    const a = await createLesson();
    const b = await createLesson();
    await createVocab(a.id, { arabicPlain: 'كتاب' });
    await expect(createVocab(b.id, { arabicPlain: 'كتاب' })).resolves.toBeDefined();
  });

  it('deletes vocabulary with its lesson', async () => {
    const lesson = await createLesson();
    await createVocab(lesson.id);
    await db.delete(lessons).where(eq(lessons.id, lesson.id));
    expect(await db.select().from(lessonVocab).where(eq(lessonVocab.lessonId, lesson.id))).toEqual(
      [],
    );
  });

  it('defaults a lesson to kind lesson, no unit, no grammar and no culture tip', async () => {
    const lesson = await createLesson();
    expect(lesson.kind).toBe('lesson');
    expect(lesson.unitId).toBeNull();
    expect(lesson.grammarNote).toEqual([]);
    expect(lesson.cultureTip).toBeNull();
  });

  it('keeps a lesson when its unit is deleted', async () => {
    const unit = await createUnit();
    const lesson = await createLesson({ unitId: unit.id });
    await db.delete(units).where(eq(units.id, unit.id));
    const [after] = await db.select().from(lessons).where(eq(lessons.id, lesson.id));
    expect(after?.unitId).toBeNull();
  });

  it('keeps unit codes unique and exercise positions unique per lesson', async () => {
    await createUnit({ code: 'A1.9', position: 9 });
    await expect(createUnit({ code: 'A1.9', position: 10 })).rejects.toThrow();
    const lesson = await createLesson();
    await createExercise(lesson.id, { position: 1 });
    await expect(createExercise(lesson.id, { position: 1 })).rejects.toThrow();
  });

  it('deletes exercises with their lesson', async () => {
    const lesson = await createLesson();
    await createExercise(lesson.id);
    await db.delete(lessons).where(eq(lessons.id, lesson.id));
    expect(await db.select().from(lessonExercises)).toHaveLength(0);
  });

  it('defaults vocabulary transliteration to an empty string', async () => {
    const lesson = await createLesson();
    expect((await createVocab(lesson.id)).translit).toBe('');
  });
});
