import { describe, expect, it } from 'vitest';

import { makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import {
  createConversation,
  createLesson,
  createTeacher,
  createVocab,
} from '../../test/factories.ts';
import { bodyOf, errorOf } from '../../test/http.ts';

const { get } = api(makeTestApp());

interface ListBody {
  levels: { level: string; lessons: { slug: string; conversationCount: number }[] }[];
}
interface DetailBody {
  lesson: { slug: string; conversationCount: number };
  vocab: { arabic: string; position: number }[];
  conversations: { id: string }[];
}

async function classroom() {
  const teacher = await createTeacher();
  const learner = await signedIn({ teacherId: teacher.id });
  return { teacher, learner };
}

describe('GET /lessons', () => {
  it('requires a session', async () => {
    const res = await get('/lessons');
    expect(res.status).toBe(401);
    expect(errorOf(res).code).toBe('UNAUTHENTICATED');
  });

  it('groups my teacher published lessons by level in CEFR order, ordered by position', async () => {
    const { teacher, learner } = await classroom();
    await createLesson({ teacherId: teacher.id, slug: 'b1-news', level: 'B1', position: 1 });
    await createLesson({ teacherId: teacher.id, slug: 'a1-second', level: 'A1', position: 2 });
    await createLesson({ teacherId: teacher.id, slug: 'a1-first', level: 'A1', position: 1 });

    const body = bodyOf<ListBody>(await get('/lessons', learner.cookie));
    expect(body.levels.map((g) => g.level)).toEqual(['A1', 'B1']);
    expect(body.levels[0]?.lessons.map((l) => l.slug)).toEqual(['a1-first', 'a1-second']);
  });

  it('hides drafts and other teachers lessons', async () => {
    const { teacher, learner } = await classroom();
    await createLesson({ teacherId: teacher.id, slug: 'mine' });
    await createLesson({ teacherId: teacher.id, slug: 'draft', status: 'draft' });
    await createLesson({ slug: 'someone-elses' });

    const body = bodyOf<ListBody>(await get('/lessons', learner.cookie));
    expect(body.levels.flatMap((g) => g.lessons.map((l) => l.slug))).toEqual(['mine']);
  });

  it('counts only my conversations per lesson, with zero for untouched lessons', async () => {
    const { teacher, learner } = await classroom();
    const other = await signedIn({ teacherId: teacher.id });
    const practised = await createLesson({ teacherId: teacher.id, slug: 'practised', position: 1 });
    await createLesson({ teacherId: teacher.id, slug: 'fresh', position: 2 });
    await createConversation({ userId: learner.user.id, lessonId: practised.id });
    await createConversation({ userId: learner.user.id, lessonId: practised.id });
    await createConversation({ userId: other.user.id, lessonId: practised.id });

    const body = bodyOf<ListBody>(await get('/lessons', learner.cookie));
    const counts = Object.fromEntries(
      body.levels.flatMap((g) => g.lessons).map((l) => [l.slug, l.conversationCount]),
    );
    expect(counts).toEqual({ practised: 2, fresh: 0 });
  });

  it('is empty for a learner without a teacher, and a teacher sees their own lessons', async () => {
    const orphan = await signedIn({ teacherId: null });
    expect(bodyOf<ListBody>(await get('/lessons', orphan.cookie))).toEqual({ levels: [] });

    const teacher = await signedIn({ role: 'teacher' });
    await createLesson({ teacherId: teacher.user.id, slug: 'own' });
    const body = bodyOf<ListBody>(await get('/lessons', teacher.cookie));
    expect(body.levels.flatMap((g) => g.lessons.map((l) => l.slug))).toEqual(['own']);
  });

  it('does not expose the scenario, opening line or any teacher id', async () => {
    const { teacher, learner } = await classroom();
    await createLesson({ teacherId: teacher.id });
    const text = JSON.stringify((await get('/lessons', learner.cookie)).body);
    expect(text).not.toMatch(/scenario|openingLine|teacherId|status/);
  });
});

describe('GET /lessons/:slug', () => {
  it('requires a session', async () => {
    expect((await get('/lessons/anything')).status).toBe(401);
  });

  it('returns the lesson, its vocab ordered by position, and my 5 most recent conversations', async () => {
    const { teacher, learner } = await classroom();
    const other = await signedIn({ teacherId: teacher.id });
    const lesson = await createLesson({ teacherId: teacher.id, slug: 'cafe' });
    await createVocab(lesson.id, { arabic: 'ثَالِثٌ', english: 'third', position: 3 });
    await createVocab(lesson.id, { arabic: 'أَوَّلُ', english: 'first', position: 1 });
    await createVocab(lesson.id, { arabic: 'ثَانٍ', english: 'second', position: 2 });
    const ids: string[] = [];
    for (let i = 0; i < 7; i++) {
      const c = await createConversation({
        userId: learner.user.id,
        lessonId: lesson.id,
        lastMessageAt: new Date(Date.UTC(2026, 0, 1 + i)),
      });
      ids.push(c.id);
    }
    await createConversation({ userId: other.user.id, lessonId: lesson.id });

    const res = await get('/lessons/cafe', learner.cookie);
    expect(res.status).toBe(200);
    const body = bodyOf<DetailBody>(res);
    expect(body.lesson).toMatchObject({ slug: 'cafe', conversationCount: 7 });
    expect(body.vocab.map((v) => v.position)).toEqual([1, 2, 3]);
    expect(body.conversations.map((c) => c.id)).toEqual(ids.slice(2).reverse());
    expect(JSON.stringify(res.body)).not.toMatch(/arabicPlain|scenario|openingLine/);
  });

  it('answers the same 404 for unknown, draft and another teachers lessons', async () => {
    const { teacher, learner } = await classroom();
    await createLesson({ teacherId: teacher.id, slug: 'draft', status: 'draft' });
    await createLesson({ slug: 'foreign' });

    const results = await Promise.all(
      ['missing', 'draft', 'foreign'].map((s) => get(`/lessons/${s}`, learner.cookie)),
    );
    for (const res of results) {
      expect(res.status).toBe(404);
      expect(errorOf(res)).toEqual(errorOf(results[0]!));
    }
  });

  it('404s for a learner without a teacher and rejects an over-long slug with 400', async () => {
    const orphan = await signedIn({ teacherId: null });
    await createLesson({ slug: 'any' });
    expect((await get('/lessons/any', orphan.cookie)).status).toBe(404);
    expect((await get(`/lessons/${'a'.repeat(121)}`, orphan.cookie)).status).toBe(400);
  });

  it('lets a teacher open their own lesson', async () => {
    const teacher = await signedIn({ role: 'teacher' });
    await createLesson({ teacherId: teacher.user.id, slug: 'own' });
    const res = await get('/lessons/own', teacher.cookie);
    expect(res.status).toBe(200);
    expect(bodyOf<DetailBody>(res).lesson.conversationCount).toBe(0);
  });
});
