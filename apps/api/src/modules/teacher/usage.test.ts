import { describe, expect, it } from 'vitest';

import { makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import { createAiCall, createDemoTeacher } from '../../test/factories.ts';
import { bodyOf } from '../../test/http.ts';
import { createSession } from '../auth/sessions.ts';

import { readDailyCaps } from './caps.ts';

const { get } = api(makeTestApp());

interface Counters {
  calls: number;
  inputTokens: number;
  outputTokens: number;
  costMicroUsd: number;
}
interface UsageBody {
  days: ({ date: string; limited: number } & Counters)[];
  byPurpose: ({ purpose: string } & Counters)[];
  byModel: ({ model: string } & Counters)[];
  today: {
    date: string;
    caps: { learnerTurns: number; guestTurns: number; callsPerModel: number };
    models: { model: string; calls: number }[];
    people: { userId: string; displayName: string; isGuest: boolean; turns: number }[];
  };
}

const teacher = () => signedIn({ role: 'teacher', displayName: 'Ustadh Test' });
const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 3600 * 1000);

describe('GET /teacher/usage', () => {
  it('answers 401 to anonymous and 403 to a learner', async () => {
    const learner = await signedIn();
    expect((await get('/teacher/usage')).status).toBe(401);
    expect((await get('/teacher/usage', learner.cookie)).status).toBe(403);
  });

  it('lets the demo teacher read', async () => {
    const demo = await createDemoTeacher();
    const { token } = await createSession(demo.id);
    expect((await get('/teacher/usage', `sid=${token}`)).status).toBe(200);
  });

  it('answers 30 empty days, no groups and the configured caps when nothing was called', async () => {
    const t = await teacher();
    const body = bodyOf<UsageBody>(await get('/teacher/usage', t.cookie));
    expect(body.days).toHaveLength(30);
    expect(body.days.every((d) => d.calls === 0 && d.costMicroUsd === 0)).toBe(true);
    expect(body.days.at(-1)?.date).toBe(body.today.date);
    expect(body.byPurpose).toEqual([]);
    expect(body.byModel).toEqual([]);
    expect(body.today.caps).toEqual(readDailyCaps());
    expect(body.today.people).toEqual([]);
  });

  it('sums my class calls per day, purpose and model, and shows today against the caps', async () => {
    const t = await teacher();
    const ana = await signedIn({ teacherId: t.user.id, displayName: 'Ana' });
    const guest = await signedIn({
      teacherId: t.user.id,
      isGuest: true,
      email: null,
      passwordHash: null,
      displayName: 'Guest 4F2A',
    });
    await createAiCall({
      userId: ana.user.id,
      purpose: 'reply',
      model: 'm-reply',
      inputTokens: 100,
      outputTokens: 50,
      costMicroUsd: 7,
    });
    await createAiCall({
      userId: ana.user.id,
      purpose: 'correction',
      model: 'm-corr',
      inputTokens: 20,
      outputTokens: 5,
    });
    await createAiCall({
      userId: guest.user.id,
      purpose: 'reply',
      model: 'm-reply',
      inputTokens: 10,
      outputTokens: 10,
    });
    await createAiCall({ userId: t.user.id, purpose: 'eval', model: 'm-corr' });
    await createAiCall({
      userId: ana.user.id,
      purpose: 'reply',
      model: 'm-reply',
      status: 'limited',
    });
    await createAiCall({
      userId: ana.user.id,
      purpose: 'reply',
      model: 'm-reply',
      createdAt: daysAgo(3),
      inputTokens: 1,
    });
    await createAiCall({
      userId: ana.user.id,
      purpose: 'reply',
      model: 'm-old',
      createdAt: daysAgo(40),
      inputTokens: 999,
    });

    const body = bodyOf<UsageBody>(await get('/teacher/usage', t.cookie));
    const today = body.days.at(-1);
    expect(today).toMatchObject({
      calls: 4,
      limited: 1,
      inputTokens: 130,
      outputTokens: 65,
      costMicroUsd: 7,
    });
    expect(body.days.at(-4)).toMatchObject({ calls: 1, inputTokens: 1 });
    expect(body.byPurpose.find((p) => p.purpose === 'reply')).toMatchObject({
      calls: 3,
      inputTokens: 111,
    });
    expect(body.byPurpose.map((p) => p.purpose)).toEqual(['reply', 'correction', 'eval']);
    expect(body.byModel.map((m) => m.model)).toEqual(['m-reply', 'm-corr']);
    expect(body.today.models).toContainEqual({ model: 'm-reply', calls: 2 });
    // Guests are counted in the totals but never listed: their ids must not reach the demo teacher.
    expect(body.today.people).toEqual([
      expect.objectContaining({ displayName: 'Ana', isGuest: false, turns: 1 }),
    ]);
  });

  it("leaves out other teachers' learners, a learner with no teacher and orphaned ledger rows", async () => {
    const t = await teacher();
    const other = await teacher();
    const theirs = await signedIn({ teacherId: other.user.id });
    const loner = await signedIn();
    await createAiCall({ userId: theirs.user.id });
    await createAiCall({ userId: loner.user.id });
    await createAiCall({ userId: null });

    const body = bodyOf<UsageBody>(await get('/teacher/usage', t.cookie));
    expect(body.days.every((d) => d.calls === 0)).toBe(true);
    expect(body.byModel).toEqual([]);
    expect(body.today.people).toEqual([]);
  });

  it('counts a per-model cap over everyone on the server', async () => {
    const t = await teacher();
    const other = await teacher();
    const theirs = await signedIn({ teacherId: other.user.id });
    await createAiCall({ userId: theirs.user.id, model: 'shared-model' });
    const body = bodyOf<UsageBody>(await get('/teacher/usage', t.cookie));
    expect(body.today.models).toEqual([{ model: 'shared-model', calls: 1 }]);
    expect(body.byModel).toEqual([]);
  });
});
