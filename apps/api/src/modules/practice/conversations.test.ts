import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { conversations, corrections, messages, mistakes } from '../../db/schema/index.ts';
import { makeTestApp } from '../../test/app.ts';
import { signedIn, api } from '../../test/auth.ts';
import {
  createConversation,
  createLesson,
  createMessage,
  createTeacher,
} from '../../test/factories.ts';
import { bodyOf, errorOf } from '../../test/http.ts';

const { get, post } = api(makeTestApp());

interface StartBody {
  conversation: { id: string; turnCount: number; lessonId: string };
  messages: { role: string; text: string; levelMetrics: unknown }[];
}
interface DetailBody {
  conversation: { id: string };
  lesson: { id: string; slug: string; title: string; level: string };
  messages: {
    id: string;
    role: string;
    text: string;
    correction: { isCorrect: boolean; mistakes: { type: string }[] } | null;
  }[];
}

async function classroom() {
  const teacher = await createTeacher();
  const learner = await signedIn({ teacherId: teacher.id });
  const lesson = await createLesson({
    teacherId: teacher.id,
    slug: 'greetings',
    level: 'A1',
    openingLine: 'مَرْحَبًا! مَا اسْمُكَ؟',
  });
  return { teacher, learner, lesson };
}

describe('POST /conversations', () => {
  it('requires a session and a valid lesson id', async () => {
    const { learner, lesson } = await classroom();
    expect((await post('/conversations', { lessonId: lesson.id })).status).toBe(401);
    expect((await post('/conversations', { lessonId: 'nope' }, learner.cookie)).status).toBe(400);
  });

  it('creates the conversation with the opening line as the first partner message', async () => {
    const { learner, lesson } = await classroom();
    const res = await post('/conversations', { lessonId: lesson.id }, learner.cookie);
    expect(res.status).toBe(201);
    const body = bodyOf<StartBody>(res);
    expect(body.conversation).toMatchObject({ turnCount: 0, lessonId: lesson.id });
    expect(body.messages).toHaveLength(1);
    expect(body.messages[0]).toMatchObject({
      role: 'partner',
      text: 'مَرْحَبًا! مَا اسْمُكَ؟',
      levelMetrics: null,
    });
    const rows = await db.select().from(conversations);
    expect(rows).toHaveLength(1);
    expect(rows[0]?.userId).toBe(learner.user.id);
  });

  it('answers the same 404 for unknown, draft and foreign lessons', async () => {
    const { teacher, learner } = await classroom();
    const draft = await createLesson({ teacherId: teacher.id, status: 'draft' });
    const foreign = await createLesson();
    const ids = [crypto.randomUUID(), draft.id, foreign.id];
    const results = await Promise.all(
      ids.map((lessonId) => post('/conversations', { lessonId }, learner.cookie)),
    );
    for (const res of results) {
      expect(res.status).toBe(404);
      expect(errorOf(res)).toEqual(errorOf(results[0]!));
    }
    expect(await db.select().from(conversations)).toHaveLength(0);
  });

  it('refuses the read-only demo teacher', async () => {
    const teacher = await signedIn({ role: 'teacher', readOnly: true });
    const lesson = await createLesson({ teacherId: teacher.user.id });
    const res = await post('/conversations', { lessonId: lesson.id }, teacher.cookie);
    expect(res.status).toBe(403);
    expect(errorOf(res).code).toBe('DEMO_READ_ONLY');
  });
});

describe('GET /conversations/:id', () => {
  it('returns the conversation, the lesson summary and messages in order with their corrections', async () => {
    const { learner, lesson } = await classroom();
    const c = await createConversation({ userId: learner.user.id, lessonId: lesson.id });
    const t = (n: number) => new Date(Date.UTC(2026, 0, 1, 0, 0, n));
    await createMessage(c.id, { role: 'partner', text: 'p1', createdAt: t(1) });
    const l1 = await createMessage(c.id, { role: 'learner', text: 'l1', createdAt: t(2) });
    await createMessage(c.id, { role: 'partner', text: 'p2', createdAt: t(3) });
    const [corr] = await db
      .insert(corrections)
      .values({ messageId: l1.id, isCorrect: false, corrected: 'fixed' })
      .returning();
    await db.insert(mistakes).values({
      correctionId: corr!.id,
      userId: learner.user.id,
      lessonId: lesson.id,
      type: 'grammar',
      original: 'a',
      correction: 'b',
      explanation: 'why',
    });

    const res = await get(`/conversations/${c.id}`, learner.cookie);
    expect(res.status).toBe(200);
    const body = bodyOf<DetailBody>(res);
    expect(body.lesson).toMatchObject({ id: lesson.id, slug: 'greetings', level: 'A1' });
    expect(body.messages.map((m) => m.text)).toEqual(['p1', 'l1', 'p2']);
    expect(body.messages[1]?.correction).toMatchObject({
      isCorrect: false,
      mistakes: [{ type: 'grammar' }],
    });
    expect(body.messages[0]?.correction).toBeNull();
    expect(JSON.stringify(res.body)).not.toMatch(/scenario|openingLine|userId/);
  });

  it('404s for someone elses conversation exactly like for a missing one', async () => {
    const { learner, lesson } = await classroom();
    const other = await signedIn();
    const theirs = await createConversation({ userId: other.user.id, lessonId: lesson.id });
    await createMessage(theirs.id);
    const a = await get(`/conversations/${theirs.id}`, learner.cookie);
    const b = await get(`/conversations/${crypto.randomUUID()}`, learner.cookie);
    expect(a.status).toBe(404);
    expect(errorOf(a)).toEqual(errorOf(b));
    expect((await get(`/conversations/${theirs.id}`)).status).toBe(401);
    expect((await get('/conversations/not-a-uuid', learner.cookie)).status).toBe(400);
    expect(await db.select().from(messages)).toHaveLength(1);
  });
});

describe('POST /conversations daily cap', () => {
  const capped = api(makeTestApp({ config: { conversationsPerDay: { guest: 2, learner: 3 } } }));

  it('refuses the next conversation with 429 CONVERSATION_LIMIT, and a guest gets the smaller cap', async () => {
    const teacher = await createTeacher();
    const lesson = await createLesson({ teacherId: teacher.id });
    const guest = await signedIn({ teacherId: teacher.id, isGuest: true });
    const learner = await signedIn({ teacherId: teacher.id });

    for (let i = 0; i < 2; i++) {
      expect(
        (await capped.post('/conversations', { lessonId: lesson.id }, guest.cookie)).status,
      ).toBe(201);
    }
    const refused = await capped.post('/conversations', { lessonId: lesson.id }, guest.cookie);
    expect(refused.status).toBe(429);
    expect(errorOf(refused).code).toBe('CONVERSATION_LIMIT');

    for (let i = 0; i < 3; i++) {
      expect(
        (await capped.post('/conversations', { lessonId: lesson.id }, learner.cookie)).status,
      ).toBe(201);
    }
    expect(
      (await capped.post('/conversations', { lessonId: lesson.id }, learner.cookie)).status,
    ).toBe(429);
    expect(await db.select().from(conversations)).toHaveLength(5);
  });

  it('holds under parallel requests, and yesterday’s conversations do not count', async () => {
    const teacher = await createTeacher();
    const lesson = await createLesson({ teacherId: teacher.id });
    const learner = await signedIn({ teacherId: teacher.id });
    await createConversation({
      userId: learner.user.id,
      lessonId: lesson.id,
      createdAt: new Date(Date.now() - 36 * 3600 * 1000),
    });
    const results = await Promise.all(
      Array.from({ length: 6 }, () =>
        capped.post('/conversations', { lessonId: lesson.id }, learner.cookie),
      ),
    );
    expect(results.filter((r) => r.status === 201)).toHaveLength(3);
    expect(results.filter((r) => r.status === 429)).toHaveLength(3);
  });
});
