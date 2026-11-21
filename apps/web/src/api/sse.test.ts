import { describe, expect, it } from 'vitest';

import { readSse, type SseEvent } from './sse';

const enc = new TextEncoder();

function streamOf(chunks: (string | Uint8Array)[]): ReadableStream<Uint8Array> {
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      const next = chunks[i++];
      if (next === undefined) controller.close();
      else controller.enqueue(typeof next === 'string' ? enc.encode(next) : next);
    },
  });
}

async function collect(iter: AsyncIterable<SseEvent>): Promise<SseEvent[]> {
  const out: SseEvent[] = [];
  for await (const e of iter) out.push(e);
  return out;
}

const WIRE =
  'event: learner\ndata: {"message":{"id":"m1"}}\n\n' +
  'event: delta\ndata: {"text":"مَرْحَبًا"}\n\n' +
  'event: done\ndata: {"ok":true}\n\n';
const EXPECTED: SseEvent[] = [
  { event: 'learner', data: { message: { id: 'm1' } } },
  { event: 'delta', data: { text: 'مَرْحَبًا' } },
  { event: 'done', data: { ok: true } },
];

describe('readSse', () => {
  it('reads events delivered one per chunk', async () => {
    const chunks = WIRE.split('\n\n')
      .filter(Boolean)
      .map((b) => `${b}\n\n`);
    expect(await collect(readSse(streamOf(chunks)))).toEqual(EXPECTED);
  });

  it('reads the same events when the bytes are cut at every possible position', async () => {
    const bytes = enc.encode(WIRE);
    for (let cut = 1; cut < bytes.length; cut++) {
      const result = await collect(readSse(streamOf([bytes.slice(0, cut), bytes.slice(cut)])));
      expect(result).toEqual(EXPECTED);
    }
  });

  it('reads the same events one byte at a time (splits inside Arabic characters)', async () => {
    const bytes = enc.encode(WIRE);
    const singles = Array.from(bytes, (b) => new Uint8Array([b]));
    expect(await collect(readSse(streamOf(singles)))).toEqual(EXPECTED);
  });

  it('handles several events in one chunk', async () => {
    expect(await collect(readSse(streamOf([WIRE])))).toEqual(EXPECTED);
  });

  it('accepts CRLF line endings, even when the CR and LF arrive in different chunks', async () => {
    const crlf = 'event: delta\r\ndata: {"text":"a"}\r\n\r\nevent: done\r\ndata: {}\r\n\r\n';
    const expected = [
      { event: 'delta', data: { text: 'a' } },
      { event: 'done', data: {} },
    ];
    expect(await collect(readSse(streamOf([crlf])))).toEqual(expected);
    for (let cut = 1; cut < crlf.length; cut++) {
      expect(await collect(readSse(streamOf([crlf.slice(0, cut), crlf.slice(cut)])))).toEqual(
        expected,
      );
    }
  });

  it('joins multi-line data, skips comments, and names data-only events "message"', async () => {
    const wire = ': keep-alive\n\ndata: {"a":\ndata: 1}\n\n';
    expect(await collect(readSse(streamOf([wire])))).toEqual([
      { event: 'message', data: { a: 1 } },
    ]);
  });

  it('emits a final event the server did not terminate with a blank line', async () => {
    expect(await collect(readSse(streamOf(['event: done\ndata: {"x":1}\n'])))).toEqual([
      { event: 'done', data: { x: 1 } },
    ]);
  });

  it('yields nothing for an empty stream', async () => {
    expect(await collect(readSse(streamOf([])))).toEqual([]);
  });

  it('throws a typed error for a payload that is not JSON', async () => {
    await expect(
      collect(readSse(streamOf(['event: delta\ndata: nope\n\n']))),
    ).rejects.toMatchObject({
      code: 'BAD_RESPONSE',
    });
  });

  it('stops with an AbortError when the signal aborts mid-stream, and cancels the stream', async () => {
    const controller = new AbortController();
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(enc.encode('event: delta\ndata: {"text":"a"}\n\n'));
      },
      cancel() {
        cancelled = true;
      },
    });
    const seen: SseEvent[] = [];
    await expect(
      (async () => {
        for await (const e of readSse(stream, controller.signal)) {
          seen.push(e);
          controller.abort();
        }
      })(),
    ).rejects.toMatchObject({ name: 'AbortError' });
    expect(seen).toHaveLength(1);
    expect(cancelled).toBe(true);
  });

  it('throws at once when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(collect(readSse(streamOf([WIRE]), controller.signal))).rejects.toMatchObject({
      name: 'AbortError',
    });
  });

  it('cancels the stream when the consumer stops early', async () => {
    let cancelled = false;
    const stream = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(enc.encode(WIRE));
      },
      cancel() {
        cancelled = true;
      },
    });
    for await (const e of readSse(stream)) {
      expect(e.event).toBe('learner');
      break;
    }
    expect(cancelled).toBe(true);
  });
});
