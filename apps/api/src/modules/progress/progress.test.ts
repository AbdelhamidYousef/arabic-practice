import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { messages } from '../../db/schema/index.ts';
import { makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import {
  createConversation,
  createLesson,
  createMessage,
  createMistake,
  createTeacher,
} from '../../test/factories.ts';
import { bodyOf, errorOf } from '../../test/http.ts';

const { get } = api(makeTestApp());

interface ProgressBody {
  totals: { conversations: number; turns: number; mistakes: number };
  mistakesByType: { type: string; count: number }[];
  weeks: { weekStart: string; turns: number; mistakes: number; mistakesPerTurn: number }[];
  recentMistakes: {
    id: string;
    type: string;
    lessonTitle: string;
    lessonSlug: string;
    createdAt: string;
  }[];
}

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 3600 * 1000);

describe('GET /progress', () => {
  it('requires a session', async () => {
    const res = await get('/progress');
    expect(res.status).toBe(401);
    expect(errorOf(res).code).toBe('UNAUTHENTICATED');
  });

  it('answers zeros and eight empty weeks for a learner who has not practised', async () => {
    const teacher = await createTeacher();
    const learner = await signedIn({ teacherId: teacher.id });
    const body = bodyOf<ProgressBody>(await get('/progress', learner.cookie));
    expect(body.totals).toEqual({ conversations: 0, turns: 0, mistakes: 0 });
    expect(body.mistakesByType).toEqual([]);
    expect(body.recentMistakes).toEqual([]);
    expect(body.weeks).toHaveLength(8);
    expect(body.weeks.every((w) => w.turns === 0 && w.mistakesPerTurn === 0)).toBe(true);
  });

  it('counts totals, groups mistakes by type and computes mistakes per turn for this week', async () => {
    const teacher = await createTeacher();
    const learner = await signedIn({ teacherId: teacher.id });
    const lesson = await createLesson({ teacherId: teacher.id, title: 'At the bakery' });
    const conv = await createConversation({ userId: learner.user.id, lessonId: lesson.id });
    await createMessage(conv.id, { role: 'partner' });
    await createMessage(conv.id);
    await createMistake(conv.id, { userId: learner.user.id, lessonId: lesson.id, type: 'grammar' });
    await createMistake(conv.id, { userId: learner.user.id, lessonId: lesson.id, type: 'grammar' });
    await createMistake(conv.id, { userId: learner.user.id, lessonId: lesson.id, type: 'harakat' });

    const body = bodyOf<ProgressBody>(await get('/progress', learner.cookie));
    // createMistake adds one learner message each: 1 + 3 learner turns, the partner message is not a turn.
    expect(body.totals).toEqual({ conversations: 1, turns: 4, mistakes: 3 });
    expect(body.mistakesByType).toEqual([
      { type: 'grammar', count: 2 },
      { type: 'harakat', count: 1 },
    ]);
    const current = body.weeks[7];
    expect(current).toMatchObject({ turns: 4, mistakes: 3, mistakesPerTurn: 0.75 });
    expect(body.recentMistakes).toHaveLength(3);
    expect(body.recentMistakes[0]?.lessonTitle).toBe('At the bakery');
    expect(body.recentMistakes[0]?.lessonSlug).toBe(lesson.slug);
  });

  it('puts older activity in its own week and ignores activity older than eight weeks', async () => {
    const teacher = await createTeacher();
    const learner = await signedIn({ teacherId: teacher.id });
    const lesson = await createLesson({ teacherId: teacher.id });
    const conv = await createConversation({ userId: learner.user.id, lessonId: lesson.id });
    const old = await createMessage(conv.id, { createdAt: daysAgo(70) });
    const lastWeek = await createMessage(conv.id, { createdAt: daysAgo(7) });
    expect(old.id).not.toBe(lastWeek.id);

    const body = bodyOf<ProgressBody>(await get('/progress', learner.cookie));
    expect(body.totals.turns).toBe(2);
    expect(body.weeks.reduce((sum, w) => sum + w.turns, 0)).toBe(1);
    expect(body.weeks[6]?.turns).toBe(1);
  });

  it('returns only the 10 most recent mistakes, newest first', async () => {
    const teacher = await createTeacher();
    const learner = await signedIn({ teacherId: teacher.id });
    const lesson = await createLesson({ teacherId: teacher.id });
    const conv = await createConversation({ userId: learner.user.id, lessonId: lesson.id });
    for (let i = 0; i < 12; i++) {
      await createMistake(conv.id, {
        userId: learner.user.id,
        lessonId: lesson.id,
        createdAt: daysAgo(i),
      });
    }
    const body = bodyOf<ProgressBody>(await get('/progress', learner.cookie));
    expect(body.totals.mistakes).toBe(12);
    expect(body.recentMistakes).toHaveLength(10);
    const times = body.recentMistakes.map((m) => Date.parse(m.createdAt));
    expect(times).toEqual([...times].sort((a, b) => b - a));
  });

  it('never includes another learner data', async () => {
    const teacher = await createTeacher();
    const me = await signedIn({ teacherId: teacher.id });
    const other = await signedIn({ teacherId: teacher.id });
    const lesson = await createLesson({ teacherId: teacher.id });
    const conv = await createConversation({ userId: other.user.id, lessonId: lesson.id });
    await createMistake(conv.id, { userId: other.user.id, lessonId: lesson.id });
    await db.insert(messages).values({ conversationId: conv.id, role: 'learner', text: 'x' });

    const body = bodyOf<ProgressBody>(await get('/progress', me.cookie));
    expect(body.totals).toEqual({ conversations: 0, turns: 0, mistakes: 0 });
    expect(body.recentMistakes).toEqual([]);
  });
});
