import { describe, expect, it } from 'vitest';

import { makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import {
  createExercise,
  createLesson,
  createTeacher,
  createUnit,
  createVocab,
} from '../../test/factories.ts';
import { bodyOf, errorOf } from '../../test/http.ts';

import { addDays, utcDay } from './days.ts';

const { get, post } = api(makeTestApp());
const today = utcDay(new Date());

interface CourseBody {
  levels: {
    level: string;
    units: {
      code: string;
      lessons: { slug: string; stepsDone: string[]; practiceScore: number | null }[];
    }[];
  }[];
  nextUp: string | null;
  stats: { streak: number; xpToday: number; xpTotal: number; wordsLearned: number };
}

async function classroom() {
  const teacher = await createTeacher();
  const learner = await signedIn({ teacherId: teacher.id });
  return { teacher, learner };
}

describe('GET /course', () => {
  it('requires a session', async () => {
    expect((await get('/course')).status).toBe(401);
  });

  it('is empty for a learner whose teacher has no course lessons', async () => {
    const { teacher, learner } = await classroom();
    await createLesson({ teacherId: teacher.id, slug: 'chat-only' });
    const body = bodyOf<CourseBody>(await get('/course', learner.cookie));
    expect(body.levels).toEqual([]);
    expect(body.nextUp).toBeNull();
    expect(body.stats).toEqual({ streak: 0, xpToday: 0, xpTotal: 0, wordsLearned: 0 });
  });

  it('lists levels, units and lessons in course order and hides drafts and other teachers', async () => {
    const { teacher, learner } = await classroom();
    const a0 = await createUnit({ level: 'A0', position: 1, code: 'A0.1' });
    const a1b = await createUnit({ level: 'A1', position: 2, code: 'A1.2' });
    const a1a = await createUnit({ level: 'A1', position: 1, code: 'A1.1' });
    const empty = await createUnit({ level: 'A2', position: 1, code: 'A2.1' });
    await createLesson({ teacherId: teacher.id, slug: 'b', unitId: a1b.id, position: 1 });
    await createLesson({ teacherId: teacher.id, slug: 'a-second', unitId: a1a.id, position: 2 });
    await createLesson({ teacherId: teacher.id, slug: 'a-first', unitId: a1a.id, position: 1 });
    await createLesson({ teacherId: teacher.id, slug: 'zero', unitId: a0.id, kind: 'letters' });
    await createLesson({ teacherId: teacher.id, slug: 'draft', unitId: empty.id, status: 'draft' });
    await createLesson({ slug: 'foreign', unitId: empty.id });

    const body = bodyOf<CourseBody>(await get('/course', learner.cookie));
    expect(body.levels.map((l) => l.level)).toEqual(['A0', 'A1']);
    expect(body.levels[1]?.units.map((u) => u.code)).toEqual(['A1.1', 'A1.2']);
    expect(body.levels[1]?.units[0]?.lessons.map((l) => l.slug)).toEqual(['a-first', 'a-second']);
    expect(body.nextUp).toBe('zero');
  });

  it('moves nextUp on once the required steps are done, and counts the stats', async () => {
    const { teacher, learner } = await classroom();
    const unit = await createUnit();
    const first = await createLesson({
      teacherId: teacher.id,
      slug: 'first',
      unitId: unit.id,
      position: 1,
      grammarNote: [{ type: 'p', text: 'x' }],
      cultureTip: { title: 't', body: 'b' },
    });
    await createLesson({ teacherId: teacher.id, slug: 'second', unitId: unit.id, position: 2 });
    await createVocab(first.id);
    await createVocab(first.id);

    const steps = ['words', 'practice', 'grammar'];
    for (const step of steps) {
      const res = await post(
        '/lessons/first/progress',
        { step, day: today, ...(step === 'practice' && { score: 80 }) },
        learner.cookie,
      );
      expect(res.status).toBe(200);
    }
    // Culture is still open on "first".
    let body = bodyOf<CourseBody>(await get(`/course?day=${today}`, learner.cookie));
    expect(body.nextUp).toBe('first');
    expect(body.levels[0]?.units[0]?.lessons[0]).toMatchObject({ practiceScore: 80 });

    await post('/lessons/first/progress', { step: 'culture', day: today }, learner.cookie);
    body = bodyOf<CourseBody>(await get(`/course?day=${today}`, learner.cookie));
    expect(body.nextUp).toBe('second');
    // 5 + 13 + 3 + 2
    expect(body.stats).toEqual({ streak: 1, xpToday: 23, xpTotal: 23, wordsLearned: 2 });
  });

  it('rejects a day far from the server date', async () => {
    const { learner } = await classroom();
    const res = await get(`/course?day=${addDays(today, 5)}`, learner.cookie);
    expect(res.status).toBe(400);
  });
});

describe('POST /lessons/:slug/progress', () => {
  it('requires a session', async () => {
    expect((await post('/lessons/x/progress', { step: 'words', day: today })).status).toBe(401);
  });

  it('returns the XP gained and answers 0 for a repeat', async () => {
    const { teacher, learner } = await classroom();
    await createLesson({ teacherId: teacher.id, slug: 'l' });
    const first = await post('/lessons/l/progress', { step: 'words', day: today }, learner.cookie);
    expect(bodyOf(first)).toEqual({ xpGained: 5, xpToday: 5, streak: 1 });
    const again = await post('/lessons/l/progress', { step: 'words', day: today }, learner.cookie);
    expect(bodyOf(again)).toEqual({ xpGained: 0, xpToday: 5, streak: 1 });
  });

  it('answers 400 for a day out of range, a bad body and a practice without a score', async () => {
    const { teacher, learner } = await classroom();
    await createLesson({ teacherId: teacher.id, slug: 'l' });
    const far = await post(
      '/lessons/l/progress',
      { step: 'words', day: addDays(today, 3) },
      learner.cookie,
    );
    expect(far.status).toBe(400);
    expect(errorOf(far).code).toBe('VALIDATION_ERROR');
    for (const body of [
      { step: 'quiz', day: today },
      { step: 'words', day: 'today' },
      { step: 'practice', day: today },
      { step: 'practice', score: 120, day: today },
    ]) {
      expect((await post('/lessons/l/progress', body, learner.cookie)).status).toBe(400);
    }
  });

  it('answers 404 for a missing, draft or foreign lesson', async () => {
    const { teacher, learner } = await classroom();
    await createLesson({ teacherId: teacher.id, slug: 'draft', status: 'draft' });
    await createLesson({ slug: 'foreign' });
    for (const slug of ['missing', 'draft', 'foreign']) {
      const res = await post(
        `/lessons/${slug}/progress`,
        { step: 'words', day: today },
        learner.cookie,
      );
      expect(res.status).toBe(404);
    }
  });

  it('answers 403 for the read-only demo teacher, whatever the body', async () => {
    const demo = await signedIn({ role: 'teacher', readOnly: true });
    await createLesson({ teacherId: demo.user.id, slug: 'l' });
    const res = await post('/lessons/l/progress', { step: 'words', day: today }, demo.cookie);
    expect(res.status).toBe(403);
    expect(errorOf(res).code).toBe('DEMO_READ_ONLY');
    expect((await post('/lessons/l/progress', { nonsense: 1 }, demo.cookie)).status).toBe(403);
  });

  it('shows the progress and the course sections on the lesson detail', async () => {
    const { teacher, learner } = await classroom();
    const unit = await createUnit({ code: 'A1.1', title: 'Greetings' });
    const lesson = await createLesson({
      teacherId: teacher.id,
      slug: 'l',
      unitId: unit.id,
      kind: 'letters',
      grammarNote: [{ type: 'p', text: 'Nouns.' }],
      cultureTip: { title: 'Salaam', body: 'Say it.' },
    });
    await createVocab(lesson.id, { translit: 'kitāb' });
    await createExercise(lesson.id, { position: 2 });
    await createExercise(lesson.id, { position: 1 });
    await post('/lessons/l/progress', { step: 'practice', score: 70, day: today }, learner.cookie);

    const body = bodyOf<{
      lesson: { unit: unknown; kind: string; grammarNote: unknown[]; cultureTip: unknown };
      vocab: { translit: string }[];
      exercises: { type: string }[];
      progress: { stepsDone: string[]; practiceScore: number };
    }>(await get('/lessons/l', learner.cookie));
    expect(body.lesson).toMatchObject({
      unit: { code: 'A1.1', title: 'Greetings' },
      kind: 'letters',
      cultureTip: { title: 'Salaam' },
    });
    expect(body.vocab[0]?.translit).toBe('kitāb');
    expect(body.exercises).toHaveLength(2);
    expect(body.progress).toEqual({ stepsDone: ['practice'], practiceScore: 70 });
  });
});
