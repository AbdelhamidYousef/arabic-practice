import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { lessonVocab, lessons, vocabCards } from '../../db/schema/index.ts';
import { makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import {
  createCard,
  createConversation,
  createDemoTeacher,
  createExercise,
  createLesson,
  createUnit,
  createVocab,
} from '../../test/factories.ts';
import { bodyOf, errorOf } from '../../test/http.ts';
import { createSession } from '../auth/sessions.ts';

const { get, post, put, delete: del } = api(makeTestApp());

interface Detail {
  id: string;
  slug: string;
  title: string;
  status: string;
  goals: string[];
  vocab: { id: string; arabic: string; english: string; note: string | null; position: number }[];
}
interface ListBody {
  lessons: {
    id: string;
    slug: string;
    status: string;
    level: string;
    vocabCount: number;
    conversationCount: number;
  }[];
}

const lessonBody = (overrides: Record<string, unknown> = {}) => ({
  title: 'Ordering at a Bakery',
  level: 'A2',
  topic: 'Food',
  summary: 'Buy bread and pastries.',
  goals: ['Ask for a price'],
  grammarFocus: 'Numbers',
  scenario: 'You are a baker. Keep sentences short.',
  openingLine: 'أَهْلًا وَسَهْلًا!',
  status: 'draft',
  vocab: [
    { arabic: 'خُبْزٌ', english: 'bread' },
    { arabic: 'حَلِيبٌ', english: 'milk', note: 'drink' },
  ],
  ...overrides,
});

const teacher = () => signedIn({ role: 'teacher', displayName: 'Ustadh Test' });
const detailOf = (res: { body: unknown }) => (res.body as { lesson: Detail }).lesson;

describe('teacher lessons: access', () => {
  const routes: [string, string][] = [
    ['get', '/teacher/lessons'],
    ['post', '/teacher/lessons'],
    ['get', '/teacher/lessons/00000000-0000-4000-8000-000000000000'],
    ['put', '/teacher/lessons/00000000-0000-4000-8000-000000000000'],
    ['delete', '/teacher/lessons/00000000-0000-4000-8000-000000000000'],
  ];
  const call = (method: string, path: string, cookie?: string) => {
    const client = api(makeTestApp());
    if (method === 'get') return client.get(path, cookie);
    if (method === 'post') return client.post(path, lessonBody(), cookie);
    if (method === 'put') return client.put(path, lessonBody(), cookie);
    return client.delete(path, cookie);
  };

  it.each(routes)('%s %s answers 401 to an anonymous caller', async (method, path) => {
    const res = await call(method, path);
    expect(res.status).toBe(401);
  });

  it.each(routes)('%s %s answers 403 to a learner', async (method, path) => {
    const learner = await signedIn();
    const res = await call(method, path, learner.cookie);
    expect(res.status).toBe(403);
    expect(errorOf(res).code).toBe('FORBIDDEN');
  });

  it.each(routes.filter(([m]) => m !== 'get'))(
    '%s %s answers 403 DEMO_READ_ONLY to the demo teacher',
    async (method, path) => {
      const demo = await createDemoTeacher();
      const { token } = await createSession(demo.id);
      const res = await call(method, path, `sid=${token}`);
      expect(res.status).toBe(403);
      expect(errorOf(res).code).toBe('DEMO_READ_ONLY');
    },
  );

  it('lets the demo teacher read its lessons', async () => {
    const demo = await createDemoTeacher();
    await createLesson({ teacherId: demo.id });
    const { token } = await createSession(demo.id);
    const body = bodyOf<ListBody>(await get('/teacher/lessons', `sid=${token}`));
    expect(body.lessons).toHaveLength(1);
  });
});

describe('POST /teacher/lessons', () => {
  it('creates a lesson with its vocab, a slug from the title and arabic_plain computed', async () => {
    const t = await teacher();
    const res = await post('/teacher/lessons', lessonBody(), t.cookie);
    expect(res.status).toBe(201);
    const lesson = detailOf(res);
    expect(lesson.slug).toBe('ordering-at-a-bakery');
    expect(lesson.status).toBe('draft');
    expect(lesson.vocab.map((v) => [v.arabic, v.position, v.note])).toEqual([
      ['خُبْزٌ', 0, null],
      ['حَلِيبٌ', 1, 'drink'],
    ]);
    const rows = await db.select().from(lessonVocab).where(eq(lessonVocab.lessonId, lesson.id));
    expect(rows.map((r) => r.arabicPlain).sort()).toEqual(['حليب', 'خبز']);
    const [row] = await db.select().from(lessons).where(eq(lessons.id, lesson.id));
    expect(row?.teacherId).toBe(t.user.id);
  });

  it('appends -2 and -3 when the title is already taken, even by another teacher', async () => {
    const a = await teacher();
    const b = await teacher();
    const slugs = [];
    for (const who of [a, a, b]) {
      slugs.push(detailOf(await post('/teacher/lessons', lessonBody(), who.cookie)).slug);
    }
    expect(slugs).toEqual([
      'ordering-at-a-bakery',
      'ordering-at-a-bakery-2',
      'ordering-at-a-bakery-3',
    ]);
  });

  it('gives parallel saves of the same title distinct slugs', async () => {
    const t = await teacher();
    const results = await Promise.all(
      Array.from({ length: 6 }, () => post('/teacher/lessons', lessonBody(), t.cookie)),
    );
    expect(results.map((r) => r.status)).toEqual(Array(6).fill(201));
    const slugs = results.map((r) => detailOf(r).slug);
    expect(new Set(slugs).size).toBe(6);
  });

  it('falls back to lesson-<short id> for an Arabic-only title', async () => {
    const t = await teacher();
    const lesson = detailOf(
      await post('/teacher/lessons', lessonBody({ title: 'في المخبز' }), t.cookie),
    );
    expect(lesson.slug).toMatch(/^lesson-[0-9a-f]{8}$/);
    expect(lesson.id.startsWith(lesson.slug.slice('lesson-'.length))).toBe(true);
  });

  it('rejects invalid bodies with 400', async () => {
    const t = await teacher();
    const bad: Record<string, unknown>[] = [
      { title: '' },
      { level: 'Z9' },
      { goals: Array(11).fill('x') },
      { vocab: [{ arabic: '', english: 'x' }] },
      { unknownField: 1 },
      { status: 'archived' },
    ];
    for (const override of bad) {
      const res = await post('/teacher/lessons', lessonBody(override), t.cookie);
      expect(res.status, JSON.stringify(override)).toBe(400);
    }
  });

  it('rejects two words that differ only in harakat with 422 and creates nothing', async () => {
    const t = await teacher();
    const res = await post(
      '/teacher/lessons',
      lessonBody({
        vocab: [
          { arabic: 'كِتَابٌ', english: 'book' },
          { arabic: 'كتاب', english: 'book again' },
        ],
      }),
      t.cookie,
    );
    expect(res.status).toBe(422);
    expect(await db.select().from(lessons)).toHaveLength(0);
  });
});

describe('GET /teacher/lessons', () => {
  it('lists only my lessons, drafts included, with vocab and conversation counts', async () => {
    const t = await teacher();
    const mineLesson = await createLesson({ teacherId: t.user.id, status: 'draft', level: 'B1' });
    await createLesson({ teacherId: t.user.id, level: 'A1' });
    await createVocab(mineLesson.id);
    await createVocab(mineLesson.id);
    await createConversation({ lessonId: mineLesson.id });
    await createLesson(); // another teacher's

    const body = bodyOf<ListBody>(await get('/teacher/lessons', t.cookie));
    expect(body.lessons.map((l) => l.level)).toEqual(['A1', 'B1']);
    const row = body.lessons.find((l) => l.id === mineLesson.id);
    expect(row).toMatchObject({ status: 'draft', vocabCount: 2, conversationCount: 1 });
  });
});

describe('GET /teacher/lessons/:id', () => {
  it('returns the full lesson with scenario and vocab', async () => {
    const t = await teacher();
    const lesson = await createLesson({ teacherId: t.user.id });
    await createVocab(lesson.id, { position: 1, english: 'second' });
    await createVocab(lesson.id, { position: 0, english: 'first' });
    const res = await get(`/teacher/lessons/${lesson.id}`, t.cookie);
    expect(res.status).toBe(200);
    const body = res.body as { lesson: Detail & { scenario: string } };
    expect(body.lesson.scenario).toContain('friendly partner');
    expect(body.lesson.vocab.map((v) => v.english)).toEqual(['first', 'second']);
  });

  it('describes the course parts of a course lesson, and none for a teacher-made one', async () => {
    const t = await teacher();
    const unit = await createUnit({ code: 'A1.1', title: 'Hello' });
    const lesson = await createLesson({
      teacherId: t.user.id,
      unitId: unit.id,
      grammarNote: [{ type: 'p', text: 'x' }],
      cultureTip: { title: 'Greetings of light', body: 'b' },
    });
    await createVocab(lesson.id, { translit: 'marḥaban' });
    await createExercise(lesson.id);
    await createExercise(lesson.id);
    await createExercise(lesson.id, {
      type: 'build',
      data: { type: 'build', prompt: 'p', english: 'e', words: ['أَنَا', 'آدَمُ'], distractors: [] },
    });
    const body = bodyOf<{
      lesson: Detail & { course: unknown; vocab: { translit: string }[] };
    }>(await get(`/teacher/lessons/${lesson.id}`, t.cookie));
    expect(body.lesson.vocab[0]?.translit).toBe('marḥaban');
    expect(body.lesson.course).toEqual({
      unit: { code: 'A1.1', title: 'Hello' },
      kind: 'lesson',
      exercises: [
        { type: 'choose', count: 2 },
        { type: 'build', count: 1 },
      ],
      grammarBlocks: 1,
      cultureTitle: 'Greetings of light',
    });

    const own = await createLesson({ teacherId: t.user.id });
    const plain = bodyOf<{ lesson: { course: unknown } }>(
      await get(`/teacher/lessons/${own.id}`, t.cookie),
    );
    expect(plain.lesson.course).toEqual({
      unit: null,
      kind: 'lesson',
      exercises: [],
      grammarBlocks: 0,
      cultureTitle: null,
    });
  });

  it("answers 404 for another teacher's lesson, an unknown id, and 400 for a malformed id", async () => {
    const t = await teacher();
    const foreign = await createLesson();
    expect((await get(`/teacher/lessons/${foreign.id}`, t.cookie)).status).toBe(404);
    expect(
      (await get('/teacher/lessons/00000000-0000-4000-8000-000000000000', t.cookie)).status,
    ).toBe(404);
    expect((await get('/teacher/lessons/nope', t.cookie)).status).toBe(400);
  });
});

describe('PUT /teacher/lessons/:id', () => {
  it('replaces the fields and the vocab as a whole, keeping the slug', async () => {
    const t = await teacher();
    const created = detailOf(await post('/teacher/lessons', lessonBody(), t.cookie));
    const res = await put(
      `/teacher/lessons/${created.id}`,
      lessonBody({
        title: 'A new title',
        status: 'published',
        goals: [],
        vocab: [{ arabic: 'مَاءٌ', english: 'water' }],
      }),
      t.cookie,
    );
    expect(res.status).toBe(200);
    const lesson = detailOf(res);
    expect(lesson).toMatchObject({ title: 'A new title', status: 'published', goals: [] });
    expect(lesson.slug).toBe(created.slug);
    expect(lesson.vocab.map((v) => v.english)).toEqual(['water']);
    const rows = await db.select().from(lessonVocab).where(eq(lessonVocab.lessonId, created.id));
    expect(rows).toHaveLength(1);
  });

  it('keeps the old vocab when the new list is invalid (one transaction)', async () => {
    const t = await teacher();
    const created = detailOf(await post('/teacher/lessons', lessonBody(), t.cookie));
    const res = await put(
      `/teacher/lessons/${created.id}`,
      lessonBody({
        vocab: [
          { arabic: 'كِتَابٌ', english: 'a' },
          { arabic: 'كتاب', english: 'b' },
        ],
      }),
      t.cookie,
    );
    expect(res.status).toBe(422);
    const rows = await db.select().from(lessonVocab).where(eq(lessonVocab.lessonId, created.id));
    expect(rows).toHaveLength(2);
  });

  it('empties the vocab with an empty list', async () => {
    const t = await teacher();
    const created = detailOf(await post('/teacher/lessons', lessonBody(), t.cookie));
    const lesson = detailOf(
      await put(`/teacher/lessons/${created.id}`, lessonBody({ vocab: [] }), t.cookie),
    );
    expect(lesson.vocab).toEqual([]);
  });

  it("answers 404 for another teacher's lesson and changes nothing", async () => {
    const t = await teacher();
    const foreign = await createLesson({ title: 'Untouched' });
    await createVocab(foreign.id);
    const res = await put(`/teacher/lessons/${foreign.id}`, lessonBody(), t.cookie);
    expect(res.status).toBe(404);
    const [row] = await db.select().from(lessons).where(eq(lessons.id, foreign.id));
    expect(row?.title).toBe('Untouched');
    expect(
      await db.select().from(lessonVocab).where(eq(lessonVocab.lessonId, foreign.id)),
    ).toHaveLength(1);
  });

  it('answers 400 for an invalid body', async () => {
    const t = await teacher();
    const lesson = await createLesson({ teacherId: t.user.id });
    const res = await put(`/teacher/lessons/${lesson.id}`, lessonBody({ title: '' }), t.cookie);
    expect(res.status).toBe(400);
  });

  it('drops flashcards of removed words (vocab replaced as a whole)', async () => {
    const t = await teacher();
    const learner = await signedIn({ teacherId: t.user.id });
    const lesson = await createLesson({ teacherId: t.user.id });
    const word = await createVocab(lesson.id);
    await createCard(learner.user.id, word.id);
    const res = await put(`/teacher/lessons/${lesson.id}`, lessonBody({ vocab: [] }), t.cookie);
    expect(res.status).toBe(200);
    expect(await db.select().from(vocabCards)).toHaveLength(0);
  });
});

describe('DELETE /teacher/lessons/:id', () => {
  it('deletes my lesson and its vocab', async () => {
    const t = await teacher();
    const lesson = await createLesson({ teacherId: t.user.id });
    await createVocab(lesson.id);
    const res = await del(`/teacher/lessons/${lesson.id}`, t.cookie);
    expect(res.status).toBe(204);
    expect(await db.select().from(lessons).where(eq(lessons.id, lesson.id))).toHaveLength(0);
    expect(
      await db.select().from(lessonVocab).where(eq(lessonVocab.lessonId, lesson.id)),
    ).toHaveLength(0);
  });

  it('refuses with 409 while learners have conversations in it, and keeps everything', async () => {
    const t = await teacher();
    const lesson = await createLesson({ teacherId: t.user.id });
    await createConversation({ lessonId: lesson.id });
    const res = await del(`/teacher/lessons/${lesson.id}`, t.cookie);
    expect(res.status).toBe(409);
    expect(errorOf(res).code).toBe('CONFLICT');
    expect(errorOf(res).details).toEqual({ conversationCount: 1 });
    expect(await db.select().from(lessons).where(eq(lessons.id, lesson.id))).toHaveLength(1);
  });

  it("answers 404 for another teacher's lesson and keeps it", async () => {
    const t = await teacher();
    const foreign = await createLesson();
    expect((await del(`/teacher/lessons/${foreign.id}`, t.cookie)).status).toBe(404);
    expect(await db.select().from(lessons).where(eq(lessons.id, foreign.id))).toHaveLength(1);
  });
});
