import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { messages, users } from '../../db/schema/index.ts';
import { makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import {
  createConversation,
  createDemoTeacher,
  createLesson,
  createMessage,
  createMistake,
  createUser,
} from '../../test/factories.ts';
import { bodyOf, errorOf } from '../../test/http.ts';
import { createSession } from '../auth/sessions.ts';

const { get, patch } = api(makeTestApp());

interface ListBody {
  learners: {
    id: string;
    displayName: string;
    level: string;
    lastActivityAt: string | null;
    turnsThisWeek: number;
    topMistakeTypes: { type: string; count: number }[];
  }[];
}
interface DetailBody {
  learner: { id: string; level: string };
  conversations: { id: string; lessonTitle: string }[];
  mistakesByType: { type: string; count: number }[];
  recentMistakes: { id: string }[];
}
interface TranscriptBody {
  conversation: { id: string; lessonTitle: string; learner: { displayName: string } };
  messages: {
    role: string;
    text: string;
    correction: { isCorrect: boolean; mistakes: { type: string }[] } | null;
  }[];
}

const teacher = () => signedIn({ role: 'teacher', displayName: 'Ustadh Test' });
const NOBODY = '00000000-0000-4000-8000-000000000000';

async function demoCookie() {
  const demo = await createDemoTeacher();
  const { token } = await createSession(demo.id);
  return { demo, cookie: `sid=${token}` };
}

describe('teacher learners: access', () => {
  it.each([
    ['get', '/teacher/learners'],
    ['get', `/teacher/learners/${NOBODY}`],
    ['patch', `/teacher/learners/${NOBODY}`],
    ['get', `/teacher/conversations/${NOBODY}`],
  ] as const)('%s %s: 401 anonymous, 403 learner', async (method, path) => {
    const client = api(makeTestApp());
    const call = (cookie?: string) =>
      method === 'get' ? client.get(path, cookie) : client.patch(path, { level: 'B1' }, cookie);
    expect((await call()).status).toBe(401);
    const learner = await signedIn();
    const res = await call(learner.cookie);
    expect(res.status).toBe(403);
    expect(errorOf(res).code).toBe('FORBIDDEN');
  });

  it('PATCH answers 403 DEMO_READ_ONLY to the demo teacher, before looking at the body', async () => {
    const { cookie } = await demoCookie();
    const res = await patch(`/teacher/learners/${NOBODY}`, { level: 'nonsense' }, cookie);
    expect(res.status).toBe(403);
    expect(errorOf(res).code).toBe('DEMO_READ_ONLY');
  });
});

describe('GET /teacher/learners', () => {
  it('lists my learners with last activity, turns this week and top mistake types', async () => {
    const t = await teacher();
    const ana = await signedIn({ teacherId: t.user.id, displayName: 'Ana' });
    await signedIn({ teacherId: t.user.id, displayName: 'Bo' });
    const lesson = await createLesson({ teacherId: t.user.id });
    const conv = await createConversation({ userId: ana.user.id, lessonId: lesson.id });
    const old = new Date(Date.now() - 30 * 24 * 3600 * 1000);
    await createMessage(conv.id, { createdAt: old });
    for (const type of [
      'grammar',
      'grammar',
      'harakat',
      'spelling',
      'register',
      'register',
    ] as const) {
      await createMistake(conv.id, { userId: ana.user.id, lessonId: lesson.id, type });
    }

    const body = bodyOf<ListBody>(await get('/teacher/learners', t.cookie));
    expect(body.learners.map((l) => l.displayName)).toEqual(['Ana', 'Bo']);
    const [first, second] = body.learners;
    // Six learner messages from createMistake are this week; the old one is not.
    expect(first?.turnsThisWeek).toBe(6);
    expect(first?.lastActivityAt).not.toBeNull();
    expect(first?.topMistakeTypes).toEqual([
      { type: 'grammar', count: 2 },
      { type: 'register', count: 2 },
      { type: 'harakat', count: 1 },
    ]);
    expect(second).toMatchObject({
      lastActivityAt: null,
      turnsThisWeek: 0,
      topMistakeTypes: [],
    });
  });

  it("leaves out other teachers' learners, guests and other teachers", async () => {
    const t = await teacher();
    await signedIn({ teacherId: t.user.id, displayName: 'Mine' });
    await signedIn({ teacherId: t.user.id, isGuest: true, email: null, passwordHash: null });
    await signedIn(); // a learner with no teacher
    const other = await teacher();
    await signedIn({ teacherId: other.user.id, displayName: 'Theirs' });

    const body = bodyOf<ListBody>(await get('/teacher/learners', t.cookie));
    expect(body.learners.map((l) => l.displayName)).toEqual(['Mine']);
  });

  it('is an empty list for a teacher without learners', async () => {
    const t = await teacher();
    expect(bodyOf<ListBody>(await get('/teacher/learners', t.cookie))).toEqual({ learners: [] });
  });
});

describe('PATCH /teacher/learners/:id', () => {
  it('changes the level of my learner', async () => {
    const t = await teacher();
    const learner = await signedIn({ teacherId: t.user.id });
    const res = await patch(`/teacher/learners/${learner.user.id}`, { level: 'B2' }, t.cookie);
    expect(res.status).toBe(200);
    expect(bodyOf<{ learner: { level: string } }>(res).learner.level).toBe('B2');
    const [row] = await db.select().from(users).where(eq(users.id, learner.user.id));
    expect(row?.level).toBe('B2');
  });

  it("answers 404 for another teacher's learner and changes nothing", async () => {
    const t = await teacher();
    const other = await teacher();
    const theirs = await signedIn({ teacherId: other.user.id });
    const res = await patch(`/teacher/learners/${theirs.user.id}`, { level: 'C1' }, t.cookie);
    expect(res.status).toBe(404);
    const [row] = await db.select().from(users).where(eq(users.id, theirs.user.id));
    expect(row?.level).toBe('A1');
  });

  it('answers 404 when the id is a teacher, not a learner of mine', async () => {
    const t = await teacher();
    const res = await patch(`/teacher/learners/${t.user.id}`, { level: 'C1' }, t.cookie);
    expect(res.status).toBe(404);
  });

  it('rejects an unknown level, extra fields and a malformed id with 400', async () => {
    const t = await teacher();
    const learner = await signedIn({ teacherId: t.user.id });
    const path = `/teacher/learners/${learner.user.id}`;
    expect((await patch(path, { level: 'D1' }, t.cookie)).status).toBe(400);
    expect((await patch(path, {}, t.cookie)).status).toBe(400);
    expect((await patch(path, { level: 'B1', role: 'teacher' }, t.cookie)).status).toBe(400);
    expect((await patch('/teacher/learners/x', { level: 'B1' }, t.cookie)).status).toBe(400);
  });
});

describe('GET /teacher/learners/:id', () => {
  it('shows the learner, conversations, mistakes by type and recent mistakes', async () => {
    const t = await teacher();
    const learner = await signedIn({ teacherId: t.user.id });
    const lesson = await createLesson({ teacherId: t.user.id, title: 'At the bakery' });
    const conv = await createConversation({ userId: learner.user.id, lessonId: lesson.id });
    await createMistake(conv.id, { userId: learner.user.id, lessonId: lesson.id, type: 'grammar' });
    await createMistake(conv.id, { userId: learner.user.id, lessonId: lesson.id, type: 'grammar' });

    const body = bodyOf<DetailBody>(await get(`/teacher/learners/${learner.user.id}`, t.cookie));
    expect(body.learner.id).toBe(learner.user.id);
    expect(body.conversations).toEqual([
      expect.objectContaining({ id: conv.id, lessonTitle: 'At the bakery' }),
    ]);
    expect(body.mistakesByType).toEqual([{ type: 'grammar', count: 2 }]);
    expect(body.recentMistakes).toHaveLength(2);
  });

  it('answers 404 for another teacher learner, an unknown id and a teacher id; 400 for a malformed one', async () => {
    const t = await teacher();
    const other = await teacher();
    const theirs = await signedIn({ teacherId: other.user.id });
    expect((await get(`/teacher/learners/${theirs.user.id}`, t.cookie)).status).toBe(404);
    expect((await get(`/teacher/learners/${NOBODY}`, t.cookie)).status).toBe(404);
    expect((await get(`/teacher/learners/${other.user.id}`, t.cookie)).status).toBe(404);
    expect((await get('/teacher/learners/abc', t.cookie)).status).toBe(400);
  });

  it('lets the demo teacher read', async () => {
    const { demo, cookie } = await demoCookie();
    const learner = await signedIn({ teacherId: demo.id });
    expect((await get(`/teacher/learners/${learner.user.id}`, cookie)).status).toBe(200);
  });
});

describe('GET /teacher/conversations/:id', () => {
  it('returns the transcript in order with corrections and their mistakes', async () => {
    const t = await teacher();
    const learner = await signedIn({ teacherId: t.user.id, displayName: 'Ana' });
    const lesson = await createLesson({ teacherId: t.user.id, title: 'At the bakery' });
    const conv = await createConversation({ userId: learner.user.id, lessonId: lesson.id });
    const base = Date.now() - 60_000;
    await createMessage(conv.id, { role: 'partner', text: 'مرحبا', createdAt: new Date(base) });
    await db.insert(messages).values({
      conversationId: conv.id,
      role: 'learner',
      text: 'اسم',
      createdAt: new Date(base + 1000),
    });
    // createMistake adds its own learner message (with a correction) later than the plain one.
    await createMistake(conv.id, {
      userId: learner.user.id,
      lessonId: lesson.id,
      type: 'vocabulary',
    });

    const res = await get(`/teacher/conversations/${conv.id}`, t.cookie);
    expect(res.status).toBe(200);
    const body = bodyOf<TranscriptBody>(res);
    expect(body.conversation).toMatchObject({
      id: conv.id,
      lessonTitle: 'At the bakery',
      learner: { displayName: 'Ana' },
    });
    expect(body.messages.map((m) => m.role)).toEqual(['partner', 'learner', 'learner']);
    expect(body.messages[0]?.correction).toBeNull();
    expect(body.messages[1]?.correction).toBeNull();
    expect(body.messages[2]?.correction).toMatchObject({
      isCorrect: false,
      mistakes: [{ type: 'vocabulary' }],
    });
  });

  it("answers 404 for another teacher's learner conversation and for an unknown id", async () => {
    const t = await teacher();
    const other = await teacher();
    const theirs = await signedIn({ teacherId: other.user.id });
    const conv = await createConversation({ userId: theirs.user.id });
    expect((await get(`/teacher/conversations/${conv.id}`, t.cookie)).status).toBe(404);
    expect((await get(`/teacher/conversations/${NOBODY}`, t.cookie)).status).toBe(404);
    expect((await get('/teacher/conversations/xyz', t.cookie)).status).toBe(400);
  });

  it("answers 404 for a conversation of a learner with no teacher or a teacher's own practice", async () => {
    const t = await teacher();
    const loner = await signedIn();
    const conv = await createConversation({ userId: loner.user.id });
    expect((await get(`/teacher/conversations/${conv.id}`, t.cookie)).status).toBe(404);
  });
});

describe('teacher learners: guests stay private', () => {
  // Every guest hangs off the public demo teacher, and anyone can sign in as it. A guest's page and
  // chats must therefore be invisible to that teacher (security review, 2026-11-21).
  it('answers 404 for a guest learner page and a guest transcript, and lists no guests', async () => {
    const { demo, cookie } = await demoCookie();
    const guest = await createUser({
      isGuest: true,
      teacherId: demo.id,
      displayName: 'Guest 1A2B',
    });
    const lesson = await createLesson({ teacherId: demo.id });
    const conv = await createConversation({ userId: guest.id, lessonId: lesson.id });
    await createMessage(conv.id, { role: 'learner', text: 'اسمي سارة' });

    expect((await get(`/teacher/learners/${guest.id}`, cookie)).status).toBe(404);
    expect((await get(`/teacher/conversations/${conv.id}`, cookie)).status).toBe(404);
    const list = bodyOf<ListBody>(await get('/teacher/learners', cookie));
    expect(list.learners.map((l) => l.id)).not.toContain(guest.id);
  });
});
