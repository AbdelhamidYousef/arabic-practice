import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { aiCalls, messages } from '../../db/schema/index.ts';
import { makeTestAi, makeTestApp } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import {
  createConversation,
  createLesson,
  createMessage,
  createTeacher,
} from '../../test/factories.ts';
import { bodyOf, errorOf } from '../../test/http.ts';

type Limits = Parameters<typeof makeTestAi>[0];

function setup(limits: Limits = {}) {
  const { fake, runtime } = makeTestAi(limits);
  return { fake, ...api(makeTestApp({ ai: runtime })) };
}

async function chat() {
  const teacher = await createTeacher();
  const learner = await signedIn({ teacherId: teacher.id });
  const lesson = await createLesson({ teacherId: teacher.id });
  const conversation = await createConversation({ userId: learner.user.id, lessonId: lesson.id });
  const partner = await createMessage(conversation.id, { role: 'partner', text: 'مَرْحَبًا!' });
  const own = await createMessage(conversation.id, { role: 'learner', text: 'أَهْلًا' });
  return { learner, conversation, partner, own };
}

const gloss = (id: string) => `/messages/${id}/gloss`;

describe('POST /messages/:id/gloss', () => {
  it('translates a partner message, stores it on the row and records a gloss call', async () => {
    const { post } = setup();
    const { learner, conversation, partner } = await chat();
    const res = await post(gloss(partner.id), {}, learner.cookie);
    expect(res.status).toBe(200);
    expect(bodyOf<{ glossEn: string }>(res).glossEn).toContain('[fake translation]');
    const [row] = await db.select().from(messages).where(eq(messages.id, partner.id));
    expect(row?.glossEn).toBe(bodyOf<{ glossEn: string }>(res).glossEn);
    const ledger = await db.select().from(aiCalls);
    expect(ledger).toHaveLength(1);
    expect(ledger[0]).toMatchObject({
      purpose: 'gloss',
      userId: learner.user.id,
      conversationId: conversation.id,
      model: 'fake-gloss',
      status: 'ok',
    });
  });

  it('serves the second request from the cache without another AI call', async () => {
    const { fake, post } = setup();
    const { learner, partner } = await chat();
    const first = await post(gloss(partner.id), {}, learner.cookie);
    const second = await post(gloss(partner.id), {}, learner.cookie);
    expect(second.status).toBe(200);
    expect(bodyOf(second)).toEqual(bodyOf(first));
    expect(fake.requests).toHaveLength(1);
    expect(await db.select().from(aiCalls)).toHaveLength(1);
  });

  it('keeps the cached translation even when the AI is switched off afterwards', async () => {
    const { post } = setup({ AI_ENABLED: false });
    const { learner, partner } = await chat();
    await db.update(messages).set({ glossEn: 'Hello!' }).where(eq(messages.id, partner.id));
    const res = await post(gloss(partner.id), {}, learner.cookie);
    expect(bodyOf(res)).toEqual({ glossEn: 'Hello!' });
  });

  it('answers the same 404 for a missing, a foreign and a learner message', async () => {
    const { fake, post } = setup();
    const mine = await chat();
    const theirs = await chat();
    const results = await Promise.all([
      post(gloss(crypto.randomUUID()), {}, mine.learner.cookie),
      post(gloss(theirs.partner.id), {}, mine.learner.cookie),
      post(gloss(mine.own.id), {}, mine.learner.cookie),
    ]);
    for (const res of results) {
      expect(res.status).toBe(404);
      expect(errorOf(res)).toEqual(errorOf(results[0]));
    }
    expect(fake.requests).toHaveLength(0);
  });

  it('requires a session, a uuid and a writable account', async () => {
    const { post } = setup();
    const { learner, partner } = await chat();
    expect((await post(gloss(partner.id))).status).toBe(401);
    expect((await post('/messages/nope/gloss', {}, learner.cookie)).status).toBe(400);
    const demo = await signedIn({ role: 'teacher', readOnly: true });
    expect((await post(gloss(partner.id), {}, demo.cookie)).status).toBe(403);
  });

  it('is refused by the caps and the kill switch, and caches nothing then', async () => {
    const capped = setup({ AI_DAILY_CALLS_PER_MODEL: 0 });
    const a = await chat();
    const res = await capped.post(gloss(a.partner.id), {}, a.learner.cookie);
    expect(res.status).toBe(429);
    expect(errorOf(res).code).toBe('AI_LIMIT_GLOBAL');

    const off = setup({ AI_ENABLED: false });
    const resOff = await off.post(gloss(a.partner.id), {}, a.learner.cookie);
    expect(resOff.status).toBe(503);
    expect(errorOf(resOff).code).toBe('AI_DISABLED');
    const [row] = await db.select().from(messages).where(eq(messages.id, a.partner.id));
    expect(row?.glossEn).toBeNull();
  });

  it('maps a provider 429 to 503 AI_BUSY and a failure to 502 AI_FAILED, caching nothing', async () => {
    const { fake, post } = setup();
    const { learner, partner } = await chat();
    fake.rateLimitNext();
    const busy = await post(gloss(partner.id), {}, learner.cookie);
    expect(busy.status).toBe(503);
    expect(errorOf(busy).code).toBe('AI_BUSY');
    fake.failNext();
    const failed = await post(gloss(partner.id), {}, learner.cookie);
    expect(failed.status).toBe(502);
    const [row] = await db.select().from(messages).where(eq(messages.id, partner.id));
    expect(row?.glossEn).toBeNull();
  });
});
