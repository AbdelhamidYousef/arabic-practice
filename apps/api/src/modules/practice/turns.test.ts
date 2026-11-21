import { request as httpRequest, type IncomingMessage } from 'node:http';
import type { AddressInfo } from 'node:net';

import { asc, eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { aiCalls, conversations, corrections, messages, mistakes } from '../../db/schema/index.ts';
import { makeTestAi, makeTestApp, TEST_ORIGIN } from '../../test/app.ts';
import { api, signedIn } from '../../test/auth.ts';
import {
  createConversation,
  createLesson,
  createMessage,
  createTeacher,
} from '../../test/factories.ts';
import { errorOf } from '../../test/http.ts';
import { eventNames, eventsOf, parseTurnEvents } from '../../test/sse.ts';

import { ScriptedProvider } from './scripted-provider.ts';

// A learner sentence the fake corrector flags (a noun after "this" lacks ال before an ال adjective).
const WRONG = 'هذا كتاب الجديد';
const RIGHT = 'أَنَا طَالِبٌ';

type Limits = Parameters<typeof makeTestAi>[0];

function setup(limits: Limits = {}, config: Parameters<typeof makeTestApp>[0] = {}) {
  const { fake, runtime } = makeTestAi(limits, new ScriptedProvider());
  const app = makeTestApp({ ...config, ai: runtime });
  return { fake, app, ...api(app) };
}

async function started(opts: { level?: 'A1' | 'B1' } = {}) {
  const teacher = await createTeacher();
  const learner = await signedIn({ teacherId: teacher.id });
  const lesson = await createLesson({
    teacherId: teacher.id,
    level: opts.level ?? 'A1',
    openingLine: 'مَرْحَبًا! مَا اسْمُكَ؟',
  });
  const conversation = await createConversation({ userId: learner.user.id, lessonId: lesson.id });
  const opening = await createMessage(conversation.id, {
    role: 'partner',
    text: lesson.openingLine,
  });
  return { teacher, learner, lesson, conversation, opening };
}

const rowsOf = (conversationId: string) =>
  db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));

describe('POST /conversations/:id/turns', () => {
  it('streams learner, deltas, the correction and done, in that order, and stores everything', async () => {
    const { fake, post } = setup();
    const { learner, lesson, conversation } = await started();
    const before = (await db.select().from(conversations))[0]!;

    const res = await post(
      `/conversations/${conversation.id}/turns`,
      { text: `  ${WRONG}  ` },
      learner.cookie,
    );

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('text/event-stream; charset=utf-8');
    expect(res.headers['cache-control']).toBe('no-cache, no-transform');
    expect(res.headers['x-accel-buffering']).toBe('no');
    expect(res.headers['connection']).toBe('keep-alive');

    const events = parseTurnEvents(res.text);
    const names = eventNames(events);
    expect(names[0]).toBe('learner');
    expect(names.at(-1)).toBe('done');
    expect(names.filter((n) => n === 'correction')).toHaveLength(1);
    expect(names.filter((n) => n === 'delta').length).toBeGreaterThan(1);
    expect(names).not.toContain('error');

    const streamed = eventsOf(events, 'delta')
      .map((e) => e.data.text)
      .join('');
    const rows = await rowsOf(conversation.id);
    expect(rows.map((m) => m.role)).toEqual(['partner', 'learner', 'partner']);
    expect(rows[1]?.text).toBe(WRONG);
    expect(rows[2]?.text).toBe(streamed.trim());
    expect(rows[2]?.levelMetrics).toMatchObject({ latinChars: 0 });
    expect(rows[2]?.levelMetrics?.words).toBeGreaterThan(0);

    const done = eventsOf(events, 'done')[0]!;
    expect(done.data.message.id).toBe(rows[2]?.id);
    expect(done.data.message.levelMetrics).toEqual(rows[2]?.levelMetrics);
    expect(done.data.usage.model).toBe('fake-reply');

    const correction = eventsOf(events, 'correction')[0]!;
    expect(correction.data.messageId).toBe(rows[1]?.id);
    expect(correction.data.correction.isCorrect).toBe(false);
    const savedMistakes = await db.select().from(mistakes);
    expect(savedMistakes).toHaveLength(correction.data.correction.mistakes.length);
    expect(savedMistakes[0]).toMatchObject({
      userId: learner.user.id,
      lessonId: lesson.id,
      type: 'grammar',
    });
    expect(await db.select().from(corrections)).toHaveLength(1);

    const after = (await db.select().from(conversations))[0]!;
    expect(after.turnCount).toBe(1);
    expect(after.lastMessageAt.getTime()).toBeGreaterThan(before.lastMessageAt.getTime());

    const ledger = await db.select().from(aiCalls);
    expect(ledger.map((c) => c.purpose).sort()).toEqual(['correction', 'reply']);
    expect(ledger.every((c) => c.status === 'ok' && c.conversationId === conversation.id)).toBe(
      true,
    );

    // The reply prompt got the opening line and the new text as chat turns, never as instructions.
    const replyRequest = fake.requests.find((r) => r.purpose === 'reply')!;
    expect(replyRequest.messages.at(-1)).toEqual({ role: 'user', text: WRONG });
    expect(
      replyRequest.messages.some((m) => m.text === lesson.openingLine && m.role === 'model'),
    ).toBe(true);
    expect(replyRequest.system).not.toContain(WRONG);
  });

  it('stores a correct sentence as isCorrect with no mistakes', async () => {
    const { post } = setup();
    const { learner, conversation } = await started();
    const res = await post(
      `/conversations/${conversation.id}/turns`,
      { text: RIGHT },
      learner.cookie,
    );
    const correction = eventsOf(parseTurnEvents(res.text), 'correction')[0]!;
    expect(correction.data.correction).toMatchObject({ isCorrect: true, mistakes: [] });
    expect(await db.select().from(mistakes)).toHaveLength(0);
    expect(await db.select().from(corrections)).toHaveLength(1);
  });

  it('delivers a slow correction after the reply and still ends with done', async () => {
    const { fake, post } = setup();
    fake.correctionDelayMs = 80;
    const { learner, conversation } = await started();
    const res = await post(
      `/conversations/${conversation.id}/turns`,
      { text: WRONG },
      learner.cookie,
    );
    const names = eventNames(parseTurnEvents(res.text));
    expect(names.indexOf('correction')).toBeGreaterThan(names.lastIndexOf('delta'));
    expect(names.at(-1)).toBe('done');
  });

  it('sends the next turn the whole history, oldest first', async () => {
    const { fake, post } = setup();
    const { learner, conversation } = await started();
    await post(`/conversations/${conversation.id}/turns`, { text: RIGHT }, learner.cookie);
    await post(`/conversations/${conversation.id}/turns`, { text: WRONG }, learner.cookie);
    const second = fake.requests.filter((r) => r.purpose === 'reply')[1]!;
    expect(second.messages.map((m) => m.role)).toEqual(['user', 'model', 'user', 'model', 'user']);
    expect(second.messages[2]?.text).toBe(RIGHT);
    expect((await db.select().from(conversations))[0]?.turnCount).toBe(2);
    const rows = await rowsOf(conversation.id);
    expect(rows.map((m) => m.role)).toEqual([
      'partner',
      'learner',
      'partner',
      'learner',
      'partner',
    ]);
  });

  describe('failures inside the stream', () => {
    it('reports a failed correction and still delivers the reply', async () => {
      const { fake, post } = setup();
      fake.correctionFault = 'bad-output';
      const { learner, conversation } = await started();
      const res = await post(
        `/conversations/${conversation.id}/turns`,
        { text: WRONG },
        learner.cookie,
      );
      const events = parseTurnEvents(res.text);
      expect(res.status).toBe(200);
      expect(eventsOf(events, 'error')).toEqual([
        {
          event: 'error',
          data: {
            code: 'AI_FAILED',
            message: 'The AI gave an unusable answer',
            scope: 'correction',
          },
        },
      ]);
      expect(eventNames(events)).not.toContain('correction');
      expect(eventNames(events).at(-1)).toBe('done');
      expect((await rowsOf(conversation.id)).map((m) => m.role)).toEqual([
        'partner',
        'learner',
        'partner',
      ]);
      expect(await db.select().from(corrections)).toHaveLength(0);
    });

    it('maps a provider 429 on the correction to AI_BUSY', async () => {
      const { fake, post } = setup();
      fake.correctionFault = 'rate-limit';
      const { learner, conversation } = await started();
      const res = await post(
        `/conversations/${conversation.id}/turns`,
        { text: WRONG },
        learner.cookie,
      );
      const error = eventsOf(parseTurnEvents(res.text), 'error')[0]!;
      expect(error.data).toMatchObject({ code: 'AI_BUSY', scope: 'correction' });
    });

    it('does not save a half reply when the stream fails, and still delivers the correction', async () => {
      const { fake, post } = setup();
      fake.replyFaultAfterFirstDelta = 'fail';
      const { learner, conversation } = await started();
      const res = await post(
        `/conversations/${conversation.id}/turns`,
        { text: WRONG },
        learner.cookie,
      );
      const events = parseTurnEvents(res.text);
      const names = eventNames(events);
      expect(names).toContain('delta');
      expect(names).toContain('correction');
      expect(names).not.toContain('done');
      expect(eventsOf(events, 'error')[0]?.data).toMatchObject({
        code: 'AI_FAILED',
        scope: 'reply',
      });
      expect((await rowsOf(conversation.id)).map((m) => m.role)).toEqual(['partner', 'learner']);
      expect(await db.select().from(corrections)).toHaveLength(1);
      const replyRow = (await db.select().from(aiCalls)).find((c) => c.purpose === 'reply');
      expect(replyRow?.status).toBe('error');
    });

    it('maps a provider 429 in the middle of the reply to AI_BUSY', async () => {
      const { fake, post } = setup();
      fake.replyFaultAfterFirstDelta = 'rate-limit';
      const { learner, conversation } = await started();
      const res = await post(
        `/conversations/${conversation.id}/turns`,
        { text: RIGHT },
        learner.cookie,
      );
      const error = eventsOf(parseTurnEvents(res.text), 'error')[0]!;
      expect(error.data).toMatchObject({ code: 'AI_BUSY', scope: 'reply' });
    });
  });

  describe('refusals before the stream opens', () => {
    it('answers JSON 503 AI_BUSY on a provider 429 and saves nothing', async () => {
      const { fake, post } = setup();
      fake.rateLimitNext();
      const { learner, conversation } = await started();
      const res = await post(
        `/conversations/${conversation.id}/turns`,
        { text: WRONG },
        learner.cookie,
      );
      expect(res.status).toBe(503);
      expect(res.headers['content-type']).toMatch(/application\/json/);
      expect(errorOf(res).code).toBe('AI_BUSY');
      expect((await rowsOf(conversation.id)).map((m) => m.role)).toEqual(['partner']);
      expect((await db.select().from(conversations))[0]?.turnCount).toBe(0);
      expect(await db.select().from(corrections)).toHaveLength(0);
    });

    it('answers JSON 502 AI_FAILED when the provider fails to start, and saves nothing', async () => {
      const { fake, post } = setup();
      fake.failNext();
      const { learner, conversation } = await started();
      const res = await post(
        `/conversations/${conversation.id}/turns`,
        { text: WRONG },
        learner.cookie,
      );
      expect(res.status).toBe(502);
      expect(errorOf(res).code).toBe('AI_FAILED');
      expect(await rowsOf(conversation.id)).toHaveLength(1);
    });

    it('answers 429 AI_LIMIT_USER once the daily turns are used, without a second learner message', async () => {
      const { post } = setup({ AI_DAILY_TURNS_LEARNER: 1 });
      const { learner, conversation } = await started();
      const url = `/conversations/${conversation.id}/turns`;
      expect((await post(url, { text: RIGHT }, learner.cookie)).status).toBe(200);
      const res = await post(url, { text: RIGHT }, learner.cookie);
      expect(res.status).toBe(429);
      expect(errorOf(res).code).toBe('AI_LIMIT_USER');
      expect((await rowsOf(conversation.id)).filter((m) => m.role === 'learner')).toHaveLength(1);
      expect((await db.select().from(conversations))[0]?.turnCount).toBe(1);
    });

    it('answers 429 AI_LIMIT_GLOBAL when the model cap is reached', async () => {
      const { post } = setup({ AI_DAILY_CALLS_PER_MODEL: 1 });
      const { learner, conversation } = await started();
      const url = `/conversations/${conversation.id}/turns`;
      // The first turn makes one reply call and one correction call; the correction model is its own
      // model, so only the reply model's cap of 1 is full afterwards.
      expect((await post(url, { text: RIGHT }, learner.cookie)).status).toBe(200);
      const res = await post(url, { text: RIGHT }, learner.cookie);
      expect(res.status).toBe(429);
      expect(errorOf(res).code).toBe('AI_LIMIT_GLOBAL');
    });

    it('answers 503 AI_DISABLED when the kill switch is off', async () => {
      const { fake, post } = setup({ AI_ENABLED: false });
      const { learner, conversation } = await started();
      const res = await post(
        `/conversations/${conversation.id}/turns`,
        { text: RIGHT },
        learner.cookie,
      );
      expect(res.status).toBe(503);
      expect(errorOf(res).code).toBe('AI_DISABLED');
      expect(fake.requests).toHaveLength(0);
      expect(await rowsOf(conversation.id)).toHaveLength(1);
    });
  });

  describe('validation and ownership', () => {
    it.each([
      ['empty text', ''],
      ['whitespace only', '   \n '],
      ['501 characters', 'ا'.repeat(501)],
    ])('rejects %s with 400 and saves nothing', async (_name, text) => {
      const { fake, post } = setup();
      const { learner, conversation } = await started();
      const res = await post(`/conversations/${conversation.id}/turns`, { text }, learner.cookie);
      expect(res.status).toBe(400);
      expect(errorOf(res).code).toBe('VALIDATION_ERROR');
      expect(await rowsOf(conversation.id)).toHaveLength(1);
      expect(fake.requests).toHaveLength(0);
    });

    it('accepts exactly 500 characters, and rejects a missing or non-string text', async () => {
      const { post } = setup();
      const { learner, conversation } = await started();
      const url = `/conversations/${conversation.id}/turns`;
      expect((await post(url, { text: 'ا'.repeat(500) }, learner.cookie)).status).toBe(200);
      expect((await post(url, {}, learner.cookie)).status).toBe(400);
      expect((await post(url, { text: 5 }, learner.cookie)).status).toBe(400);
    });

    it('rejects a body over 16 kB', async () => {
      const { post } = setup();
      const { learner, conversation } = await started();
      const res = await post(
        `/conversations/${conversation.id}/turns`,
        { text: 'ا'.repeat(20_000) },
        learner.cookie,
      );
      // The body parser refuses it before any route runs; same error envelope as every 4xx.
      expect(res.status).toBe(413);
      expect(errorOf(res).code).toBe('VALIDATION_ERROR');
    });

    it('answers the same 404 for a missing and a foreign conversation, and never calls the AI', async () => {
      const { fake, post } = setup();
      const { learner } = await started();
      const other = await started();
      const foreign = await post(
        `/conversations/${other.conversation.id}/turns`,
        { text: RIGHT },
        learner.cookie,
      );
      const missing = await post(
        `/conversations/${crypto.randomUUID()}/turns`,
        { text: RIGHT },
        learner.cookie,
      );
      expect(foreign.status).toBe(404);
      expect(errorOf(foreign)).toEqual(errorOf(missing));
      expect(fake.requests).toHaveLength(0);
      expect(await rowsOf(other.conversation.id)).toHaveLength(1);
    });

    it('requires a session and refuses the read-only demo teacher', async () => {
      const { post } = setup();
      const { conversation } = await started();
      expect((await post(`/conversations/${conversation.id}/turns`, { text: RIGHT })).status).toBe(
        401,
      );
      const demo = await signedIn({ role: 'teacher', readOnly: true });
      const res = await post(
        `/conversations/${conversation.id}/turns`,
        { text: RIGHT },
        demo.cookie,
      );
      expect(res.status).toBe(403);
      expect(errorOf(res).code).toBe('DEMO_READ_ONLY');
    });
  });

  it('rate limits turns per learner, on top of the daily caps', async () => {
    const { post } = setup({}, { config: { turnRateLimit: { windowMs: 60_000, limit: 2 } } });
    const { learner, conversation } = await started();
    const other = await started();
    const url = `/conversations/${conversation.id}/turns`;
    expect((await post(url, { text: RIGHT }, learner.cookie)).status).toBe(200);
    expect((await post(url, { text: RIGHT }, learner.cookie)).status).toBe(200);
    const limited = await post(url, { text: RIGHT }, learner.cookie);
    expect(limited.status).toBe(429);
    expect(errorOf(limited).code).toBe('RATE_LIMITED');
    // Another learner has their own bucket.
    const ok = await post(
      `/conversations/${other.conversation.id}/turns`,
      { text: RIGHT },
      other.learner.cookie,
    );
    expect(ok.status).toBe(200);
  });

  it('measures the partner reply against the lesson level and vocabulary', async () => {
    const { post } = setup();
    const { learner, conversation } = await started({ level: 'B1' });
    const res = await post(
      `/conversations/${conversation.id}/turns`,
      { text: RIGHT },
      learner.cookie,
    );
    const done = eventsOf(parseTurnEvents(res.text), 'done')[0]!;
    expect(done.data.message.levelMetrics).toMatchObject({ withinLevel: true, violations: [] });
  });
});

// Disconnects need a real socket: Supertest waits for the whole response, so these tests open the
// server on a port and talk to it with node:http, then destroy the connection.
describe('client disconnect', () => {
  async function withServer<T>(
    app: ReturnType<typeof makeTestApp>,
    run: (port: number) => Promise<T>,
  ): Promise<T> {
    const server = app.listen(0, '127.0.0.1');
    await new Promise((r) => server.once('listening', r));
    try {
      return await run((server.address() as AddressInfo).port);
    } finally {
      server.closeAllConnections();
      await new Promise((r) => server.close(r));
    }
  }

  function startTurn(port: number, path: string, cookie: string, text: string) {
    return new Promise<{ response: IncomingMessage; destroy: () => void }>((resolve, reject) => {
      const body = JSON.stringify({ text });
      const req = httpRequest(
        {
          host: '127.0.0.1',
          port,
          path: `/api/v1${path}`,
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'content-length': Buffer.byteLength(body),
            origin: TEST_ORIGIN,
            cookie,
          },
        },
        (response) => resolve({ response, destroy: () => req.destroy() }),
      );
      req.on('error', (e) => {
        if ((e as NodeJS.ErrnoException).code !== 'ECONNRESET') reject(e);
      });
      req.end(body);
    });
  }

  const until = async (check: () => Promise<boolean>) => {
    for (let i = 0; i < 100; i += 1) {
      if (await check()) return;
      await new Promise((r) => setTimeout(r, 25));
    }
    throw new Error('condition not reached in time');
  };

  it('aborts both provider calls mid-stream and leaves no partner message or correction', async () => {
    const { fake, app } = setup();
    fake.replyStallMs = 5_000;
    fake.correctionDelayMs = 5_000;
    const { learner, conversation } = await started();

    await withServer(app, async (port) => {
      const { response, destroy } = await startTurn(
        port,
        `/conversations/${conversation.id}/turns`,
        learner.cookie,
        WRONG,
      );
      expect(response.statusCode).toBe(200);
      // Wait for the first delta, then leave.
      await new Promise<void>((resolve) => {
        let seen = '';
        response.on('data', (chunk: Buffer) => {
          seen += chunk.toString();
          if (seen.includes('event: delta')) resolve();
        });
      });
      destroy();
      await until(() => Promise.resolve(fake.replyAborted));
    });

    // The two ledger rows are written once each call has noticed the abort.
    await until(async () => (await db.select().from(aiCalls)).length === 2);
    expect((await rowsOf(conversation.id)).map((m) => m.role)).toEqual(['partner', 'learner']);
    expect(await db.select().from(corrections)).toHaveLength(0);
    expect((await db.select().from(aiCalls)).every((c) => c.status === 'error')).toBe(true);
    expect((await db.select().from(conversations))[0]?.turnCount).toBe(1);
  });

  it('saves nothing when the learner leaves before the reply has even started', async () => {
    const { fake, app } = setup();
    fake.delay(5_000);
    const { learner, conversation } = await started();

    await withServer(app, async (port) => {
      const body = JSON.stringify({ text: WRONG });
      await new Promise<void>((resolve) => {
        const req = httpRequest(
          {
            host: '127.0.0.1',
            port,
            path: `/api/v1/conversations/${conversation.id}/turns`,
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              'content-length': Buffer.byteLength(body),
              origin: TEST_ORIGIN,
              cookie: learner.cookie,
            },
          },
          () => undefined,
        );
        req.on('error', () => undefined);
        req.end(body);
        // Give the server time to reach the provider call, then hang up.
        setTimeout(() => {
          req.destroy();
          resolve();
        }, 150);
      });
      await until(async () => (await db.select().from(aiCalls)).length === 1);
    });

    expect(await rowsOf(conversation.id)).toHaveLength(1);
    expect((await db.select().from(conversations))[0]?.turnCount).toBe(0);
  });
});
