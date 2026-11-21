import { describe, expect, it } from 'vitest';

import { parseSse } from './sse.ts';

function streamOf(chunks: Uint8Array[]): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const c of chunks) controller.enqueue(c);
      controller.close();
    },
  });
}
const enc = (s: string) => new TextEncoder().encode(s);
async function all(body: ReadableStream<Uint8Array>) {
  const out: string[] = [];
  for await (const e of parseSse(body)) out.push(e);
  return out;
}

describe('parseSse', () => {
  it('splits events on blank lines', async () => {
    expect(await all(streamOf([enc('data: {"a":1}\n\ndata: {"a":2}\n\n')]))).toEqual([
      '{"a":1}',
      '{"a":2}',
    ]);
  });

  it('handles an event split across chunks, even inside a multi-byte letter', async () => {
    const bytes = enc('data: {"t":"مرحبا"}\n\ndata: {"t":"x"}\n\n');
    // Cut in the middle of the first Arabic letter (2 bytes each).
    const cut = bytes.indexOf(0xd9) + 1;
    expect(await all(streamOf([bytes.slice(0, cut), bytes.slice(cut)]))).toEqual([
      '{"t":"مرحبا"}',
      '{"t":"x"}',
    ]);
  });

  it('accepts CRLF, comments, and a last event without the closing blank line', async () => {
    expect(await all(streamOf([enc(': ping\r\n\r\ndata: one\r\n\r\ndata: two')]))).toEqual([
      'one',
      'two',
    ]);
  });

  it('joins several data lines of one event', async () => {
    expect(await all(streamOf([enc('data: a\ndata: b\n\n')]))).toEqual(['a\nb']);
  });
});
