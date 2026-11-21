import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import {
  activityDays,
  aiCalls,
  conversations,
  lessonProgress,
  mistakes,
  sessions,
  users,
  vocabCards,
} from '../../db/schema/index.ts';
import { hash } from '../../lib/password.ts';
import { makeTestApp } from '../../test/app.ts';
import { api } from '../../test/auth.ts';
import {
  createAiCall,
  createCard,
  createConversation,
  createDemoTeacher,
  createLesson,
  createMessage,
  createMistake,
  createTeacher,
  createUser,
  createVocab,
} from '../../test/factories.ts';
import { bodyOf, errorOf } from '../../test/http.ts';
import { createSession, loadSession } from '../auth/sessions.ts';

const PASSWORD = 'correct horse battery staple';
const app = makeTestApp();
const { get, delete: del } = api(app);

async function learnerWithData(label = 'Mine') {
  const teacher = await createTeacher();
  const user = await createUser({
    teacherId: teacher.id,
    displayName: `${label} Learner`,
    passwordHash: await hash(PASSWORD),
  });
  const { token } = await createSession(user.id);
  const lesson = await createLesson({ teacherId: teacher.id, title: `${label} lesson` });
  const vocab = await createVocab(lesson.id, { english: `${label} word` });
  const conversation = await createConversation({ userId: user.id, lessonId: lesson.id });
  await createMessage(conversation.id, { text: `${label} says hello` });
  await createMistake(conversation.id, { userId: user.id, lessonId: lesson.id });
  await createCard(user.id, vocab.id);
  await db
    .insert(lessonProgress)
    .values({ userId: user.id, lessonId: lesson.id, step: 'words', score: 90 });
  await db.insert(activityDays).values({ userId: user.id, day: '2026-11-20', xp: 12 });
  await createAiCall({
    userId: user.id,
    conversationId: conversation.id,
    costMicroUsd: 1234,
    inputTokens: 10,
  });
  return { teacher, user, token, cookie: `sid=${token}`, lesson, conversation };
}

interface ExportBody {
  profile: Record<string, unknown>;
  conversations: { lessonTitle: string; messages: { text: string; correction: unknown }[] }[];
  mistakes: { original: string }[];
  progress: {
    lessonSteps: { step: string; score: number }[];
    activityDays: { day: string; xp: number }[];
    vocabCards: { english: string }[];
  };
}

describe('GET /me/export', () => {
  it('returns my profile, chats, mistakes and progress as a JSON download', async () => {
    const mine = await learnerWithData('Mine');
    await learnerWithData('Theirs');

    const res = await get('/me/export', mine.cookie);
    expect(res.status).toBe(200);
    expect(res.headers['content-disposition']).toContain('attachment');
    expect(res.headers['cache-control']).toBe('no-store');

    const body = bodyOf<ExportBody>(res);
    expect(body.profile).toMatchObject({ id: mine.user.id, displayName: 'Mine Learner' });
    expect(body.conversations).toHaveLength(1);
    expect(body.conversations[0]?.lessonTitle).toBe('Mine lesson');
    expect(body.conversations[0]?.messages[0]?.text).toBe('Mine says hello');
    // The mistake factory adds a second, corrected message.
    const corrected = body.conversations[0]?.messages.find((m) => m.correction !== null);
    expect(corrected?.correction).toMatchObject({ isCorrect: false });
    expect(body.mistakes).toHaveLength(1);
    expect(body.progress.lessonSteps).toMatchObject([{ step: 'words', score: 90 }]);
    expect(body.progress.activityDays).toEqual([{ day: '2026-11-20', xp: 12 }]);
    expect(body.progress.vocabCards).toMatchObject([{ english: 'Mine word' }]);
  });

  it("never includes another learner's rows, a password hash, or an IP hash", async () => {
    const mine = await learnerWithData('Mine');
    await learnerWithData('Theirs');
    const text = JSON.stringify((await get('/me/export', mine.cookie)).body);
    expect(text).not.toContain('Theirs');
    expect(text).not.toMatch(/argon2|passwordHash|password_hash|createdIpHash|test-hash/);
  });

  it('works for a learner with no data at all', async () => {
    const user = await createUser();
    const { token } = await createSession(user.id);
    const res = await get('/me/export', `sid=${token}`);
    expect(res.status).toBe(200);
    expect(bodyOf<ExportBody>(res).conversations).toEqual([]);
  });

  it('needs a signed-in learner: 401 anonymous, 403 guest, teacher and the demo teacher', async () => {
    expect((await get('/me/export')).status).toBe(401);

    const guest = await createUser({ isGuest: true, email: null, passwordHash: null });
    const g = await createSession(guest.id);
    expect((await get('/me/export', `sid=${g.token}`)).status).toBe(403);

    const teacher = await createTeacher();
    const t = await createSession(teacher.id);
    expect((await get('/me/export', `sid=${t.token}`)).status).toBe(403);

    const demo = await createDemoTeacher();
    const d = await createSession(demo.id);
    expect(errorOf(await get('/me/export', `sid=${d.token}`)).code).toBe('DEMO_READ_ONLY');
  });
});

describe('DELETE /me', () => {
  it('deletes the account and all its rows, keeps ai_calls without the person, ends the session', async () => {
    const mine = await learnerWithData('Mine');
    const theirs = await learnerWithData('Theirs');

    const res = await del('/me', mine.cookie, { password: PASSWORD });
    expect(res.status).toBe(204);
    expect(String(res.headers['set-cookie'])).toContain('sid=;');

    expect(await db.select().from(users).where(eq(users.id, mine.user.id))).toHaveLength(0);
    expect(await loadSession(mine.token)).toBeNull();
    for (const table of [conversations, mistakes, vocabCards, lessonProgress, activityDays]) {
      const rows = await db.select().from(table);
      // Only the other learner's single row is left in each table.
      expect(rows).toHaveLength(1);
    }
    // The money record stays, anonymised: the cost survives, the user and conversation do not.
    const calls = await db.select().from(aiCalls);
    expect(calls).toHaveLength(2);
    const orphan = calls.find((c) => c.userId === null);
    expect(orphan).toMatchObject({ costMicroUsd: 1234, inputTokens: 10, conversationId: null });
    // The teacher, the lessons and the other learner are untouched.
    expect(await db.select().from(users).where(eq(users.id, mine.teacher.id))).toHaveLength(1);
    expect(await db.select().from(users).where(eq(users.id, theirs.user.id))).toHaveLength(1);
    expect(await db.select().from(sessions)).toHaveLength(1);
  });

  it('refuses a wrong password with WRONG_PASSWORD and deletes nothing', async () => {
    const mine = await learnerWithData();
    const res = await del('/me', mine.cookie, { password: 'not the password' });
    expect(res.status).toBe(403);
    expect(errorOf(res).code).toBe('WRONG_PASSWORD');
    expect(await db.select().from(users).where(eq(users.id, mine.user.id))).toHaveLength(1);
    expect(await loadSession(mine.token)).not.toBeNull();
  });

  it('needs the password in the body', async () => {
    const mine = await learnerWithData();
    expect((await del('/me', mine.cookie)).status).toBe(400);
    expect((await del('/me', mine.cookie, { password: '' })).status).toBe(400);
    expect(await db.select().from(users).where(eq(users.id, mine.user.id))).toHaveLength(1);
  });

  it('refuses anonymous callers, guests, teachers and the read-only demo teacher', async () => {
    expect((await del('/me', undefined, { password: PASSWORD })).status).toBe(401);

    const guest = await createUser({ isGuest: true, email: null, passwordHash: null });
    const g = await createSession(guest.id);
    expect((await del('/me', `sid=${g.token}`, { password: PASSWORD })).status).toBe(403);

    const teacher = await createTeacher({ passwordHash: await hash(PASSWORD) });
    const t = await createSession(teacher.id);
    const asTeacher = await del('/me', `sid=${t.token}`, { password: PASSWORD });
    expect(asTeacher.status).toBe(403);
    expect(await db.select().from(users).where(eq(users.id, teacher.id))).toHaveLength(1);

    const demo = await createDemoTeacher();
    const d = await createSession(demo.id);
    const asDemo = await del('/me', `sid=${d.token}`, { password: PASSWORD });
    expect(errorOf(asDemo).code).toBe('DEMO_READ_ONLY');
    expect(await db.select().from(users).where(eq(users.id, demo.id))).toHaveLength(1);
  });

  it('is rate limited per user', async () => {
    const limited = makeTestApp({ config: { authRateLimit: { windowMs: 60_000, limit: 2 } } });
    const mine = await learnerWithData();
    const attempt = () =>
      api(limited).delete('/me', mine.cookie, { password: 'wrong wrong wrong' });
    expect((await attempt()).status).toBe(403);
    expect((await attempt()).status).toBe(403);
    expect((await attempt()).status).toBe(429);
  });
});
