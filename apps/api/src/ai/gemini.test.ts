import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { GeminiProvider, toGeminiSchema } from './gemini.ts';
import { LlmBadOutput, LlmFailed, LlmRateLimited, type StreamEvent } from './provider.ts';

// Bodies below are recorded in the shape the live API returned on 2026-11-21, with made-up text.

const schema = z.object({ answer: z.string(), n: z.number() });
const req = {
  purpose: 'correction' as const,
  model: 'gemini-3.5-flash-lite',
  system: 'sys',
  messages: [{ role: 'user' as const, text: 'hello' }],
  maxOutputTokens: 200,
  schema,
};

const jsonBody = (text: string, extra: object = {}) => ({
  candidates: [{ content: { role: 'model', parts: [{ text }] }, finishReason: 'STOP' }],
  usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5, thoughtsTokenCount: 2 },
  ...extra,
});
const respond = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), { status: 200, ...init });

function provider(...responses: (Response | Error)[]) {
  const fetchMock = vi.fn(() => {
    const next = responses.shift();
    if (!next) return Promise.reject(new Error('no more responses'));
    if (next instanceof Error) return Promise.reject(next);
    return Promise.resolve(next);
  });
  return {
    p: new GeminiProvider({ apiKey: 'test-key-123', fetch: fetchMock }),
    fetchMock,
  };
}

function sse(events: object[], chunkAt?: number): Response {
  const text = events.map((e) => `data: ${JSON.stringify(e)}\r\n\r\n`).join('');
  const bytes = new TextEncoder().encode(text);
  const cut = chunkAt ?? bytes.length;
  return new Response(
    new ReadableStream({
      start(c) {
        c.enqueue(bytes.slice(0, cut));
        if (cut < bytes.length) c.enqueue(bytes.slice(cut));
        c.close();
      },
    }),
    { status: 200 },
  );
}
async function collect(it: AsyncIterable<StreamEvent>) {
  const out: StreamEvent[] = [];
  for await (const e of it) out.push(e);
  return out;
}

interface Sent {
  systemInstruction: { parts: { text: string }[] };
  contents: unknown;
  generationConfig: Record<string, unknown> & { responseJsonSchema: { type: string } };
}
const sentOf = (call: unknown): Sent =>
  JSON.parse((call as [string, RequestInit])[1].body as string) as Sent;

describe('toGeminiSchema', () => {
  it('drops $schema and keeps the shape', () => {
    const s = toGeminiSchema(schema);
    expect(s).not.toHaveProperty('$schema');
    expect(s).toMatchObject({ type: 'object', required: ['answer', 'n'] });
  });
});

describe('generateJson', () => {
  it('sends the key in a header, the schema and minimal thinking; no sampling params', async () => {
    const { p, fetchMock } = provider(respond(jsonBody('{"answer":"ok","n":1}')));
    const { data, usage } = await p.generateJson(req);
    expect(data).toEqual({ answer: 'ok', n: 1 });
    // Thinking tokens count as output.
    expect(usage).toMatchObject({ inputTokens: 10, outputTokens: 7, model: req.model });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent',
    );
    expect(url).not.toContain('key');
    expect((init.headers as Record<string, string>)['x-goog-api-key']).toBe('test-key-123');
    const sent = sentOf(fetchMock.mock.calls[0]);
    expect(sent.generationConfig).toMatchObject({
      maxOutputTokens: 200,
      responseMimeType: 'application/json',
      thinkingConfig: { thinkingLevel: 'MINIMAL' },
    });
    expect(sent.generationConfig.responseJsonSchema.type).toBe('object');
    expect(sent.generationConfig).not.toHaveProperty('temperature');
    expect(sent.systemInstruction.parts[0]?.text).toBe('sys');
    expect(sent.contents).toEqual([{ role: 'user', parts: [{ text: 'hello' }] }]);
  });

  it('does not ask a non-lite model for minimal thinking', async () => {
    const { p, fetchMock } = provider(respond(jsonBody('{"answer":"ok","n":1}')));
    await p.generateJson({ ...req, model: 'gemini-3.6-flash' });
    const sent = sentOf(fetchMock.mock.calls[0]);
    expect(sent.generationConfig).not.toHaveProperty('thinkingConfig');
  });

  it('retries once on a schema miss and sums the tokens of both attempts', async () => {
    const { p, fetchMock } = provider(
      respond(jsonBody('{"answer":1}')),
      respond(jsonBody('{"answer":"fixed","n":2}')),
    );
    const { data, usage } = await p.generateJson(req);
    expect(data.answer).toBe('fixed');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(usage.inputTokens).toBe(20);
  });

  it('throws LlmBadOutput after two misses', async () => {
    const { p } = provider(respond(jsonBody('not json')), respond(jsonBody('{"answer":1}')));
    await expect(p.generateJson(req)).rejects.toBeInstanceOf(LlmBadOutput);
  });

  it('skips thought parts and empty parts', async () => {
    const body = {
      candidates: [
        {
          content: {
            parts: [
              { text: '', thoughtSignature: 'abc' },
              { text: 'thinking...', thought: true },
              { text: '{"answer":"a","n":3}' },
            ],
          },
          finishReason: 'STOP',
        },
      ],
    };
    const { p } = provider(respond(body));
    expect((await p.generateJson(req)).data.n).toBe(3);
  });

  it('maps 429 to LlmRateLimited (retry-after optional) and other errors to LlmFailed', async () => {
    const err = (code: number, status: string) => ({ error: { code, message: 'm', status } });
    const a = provider(
      respond(err(429, 'RESOURCE_EXHAUSTED'), { status: 429, headers: { 'retry-after': '7' } }),
    );
    await expect(a.p.generateJson(req)).rejects.toMatchObject({
      name: 'LlmRateLimited',
      retryAfterMs: 7000,
    });
    const b = provider(respond(err(429, 'RESOURCE_EXHAUSTED'), { status: 429 }));
    await expect(b.p.generateJson(req)).rejects.toMatchObject({ retryAfterMs: undefined });
    const c = provider(respond(err(404, 'NOT_FOUND'), { status: 404 }));
    await expect(c.p.generateJson(req)).rejects.toMatchObject({
      name: 'LlmFailed',
      code: 'HTTP_404',
    });
    const d = provider(new TypeError('fetch failed'));
    await expect(d.p.generateJson(req)).rejects.toMatchObject({ code: 'NETWORK' });
  });

  it('treats SAFETY and a blocked prompt as failed calls', async () => {
    const safety = { candidates: [{ finishReason: 'SAFETY' }] };
    await expect(provider(respond(safety)).p.generateJson(req)).rejects.toMatchObject({
      code: 'FINISH_SAFETY',
    });
    const blocked = { promptFeedback: { blockReason: 'OTHER' } };
    await expect(provider(respond(blocked)).p.generateJson(req)).rejects.toMatchObject({
      code: 'BLOCKED',
    });
  });

  it('times out with a clear code', async () => {
    const fetchMock = vi.fn(
      (_u: string, init: RequestInit) =>
        new Promise<Response>((_res, rej) => {
          init.signal?.addEventListener('abort', () => rej(new Error('aborted')));
        }),
    );
    const p = new GeminiProvider({
      apiKey: 'test-key-123',
      fetch: fetchMock as unknown as typeof fetch,
      jsonTimeoutMs: 20,
    });
    await expect(p.generateJson(req)).rejects.toMatchObject({ code: 'TIMEOUT' });
  });
});

describe('streamText', () => {
  const textReq = { ...req, purpose: 'reply' as const };
  const chunk = (text: string, extra: object = {}) => ({
    candidates: [{ content: { role: 'model', parts: [{ text }] }, ...extra }],
  });

  it('yields deltas, skips empty parts, and finishes with the last chunk usage', async () => {
    const events = [
      chunk('مَرْحَبًا'),
      { candidates: [{ content: { parts: [{ text: '', thoughtSignature: 'x' }] } }] },
      {
        ...chunk(' بِكَ', { finishReason: 'STOP' }),
        usageMetadata: { promptTokenCount: 30, candidatesTokenCount: 4, thoughtsTokenCount: 1 },
      },
    ];
    const { p, fetchMock } = provider(sse(events, 40));
    const out = await collect(p.streamText(textReq));
    expect(
      out
        .filter((e) => e.type === 'delta')
        .map((e) => (e as { text: string }).text)
        .join(''),
    ).toBe('مَرْحَبًا بِكَ');
    expect(out.at(-1)).toMatchObject({ type: 'done', usage: { inputTokens: 30, outputTokens: 5 } });
    const url = (fetchMock.mock.calls[0] as unknown as [string])[0];
    expect(url).toContain(':streamGenerateContent?alt=sse');
  });

  it('fails when the stream closes without a finishReason', async () => {
    const { p } = provider(sse([chunk('half')]));
    await expect(collect(p.streamText(textReq))).rejects.toMatchObject({
      code: 'TRUNCATED_STREAM',
    });
  });

  it('fails on SAFETY at the end and on an error event inside the stream', async () => {
    const safety = provider(sse([chunk('x', { finishReason: 'SAFETY' })]));
    await expect(collect(safety.p.streamText(textReq))).rejects.toMatchObject({
      code: 'FINISH_SAFETY',
    });
    const inStream = provider(
      sse([{ error: { code: 429, message: 'slow down', status: 'RESOURCE_EXHAUSTED' } }]),
    );
    await expect(collect(inStream.p.streamText(textReq))).rejects.toBeInstanceOf(LlmRateLimited);
  });

  it('maps an HTTP error before the stream starts', async () => {
    const { p } = provider(
      respond({ error: { code: 500, message: 'boom', status: 'INTERNAL' } }, { status: 500 }),
    );
    await expect(collect(p.streamText(textReq))).rejects.toBeInstanceOf(LlmFailed);
  });
});
