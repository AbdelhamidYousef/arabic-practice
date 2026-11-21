import { ApiError, errorFromResponse, sendRequest } from './client';

// Server-Sent Events over a POST. The browser's EventSource only does GET without a body, and a
// practice turn sends the learner's text, so the stream is read by hand from fetch().
//
// Wire format: lines of `field: value`; an event ends at a blank line; `event:` names it,
// `data:` lines (possibly several) are joined with "\n" and hold JSON here; lines starting with
// ":" are comments (keep-alives) and are skipped. Chunks from the network end anywhere (mid-line,
// mid-character, between the two characters of a CRLF), so everything is buffered until a blank
// line is complete.

export interface SseEvent {
  /** The `event:` name; "message" when the server sent none. */
  event: string;
  data: unknown;
}

function parseBlock(block: string): SseEvent | null {
  let event = 'message';
  const data: string[] = [];
  for (const line of block.split('\n')) {
    if (line === '' || line.startsWith(':')) continue;
    const colon = line.indexOf(':');
    const field = colon === -1 ? line : line.slice(0, colon);
    // One optional space after the colon belongs to the syntax, not the value.
    const value = colon === -1 ? '' : line.slice(colon + 1).replace(/^ /, '');
    if (field === 'event') event = value;
    else if (field === 'data') data.push(value);
  }
  if (data.length === 0) return null; // a comment-only block, or an event with no payload
  try {
    return { event, data: JSON.parse(data.join('\n')) as unknown };
  } catch (cause) {
    throw new ApiError('BAD_RESPONSE', 200, 'The server sent an unreadable event', cause);
  }
}

/** Reads a response body as SSE. Stops quietly at the end of the stream; throws AbortError on abort. */
export async function* readSse(
  stream: ReadableStream<Uint8Array>,
  signal?: AbortSignal,
): AsyncGenerator<SseEvent, void, undefined> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const onAbort = () => void reader.cancel().catch(() => undefined);
  if (signal?.aborted) {
    onAbort();
    throw new DOMException('Aborted', 'AbortError');
  }
  signal?.addEventListener('abort', onAbort, { once: true });

  let buffer = '';
  try {
    for (;;) {
      let chunk: ReadableStreamReadResult<Uint8Array>;
      try {
        chunk = await reader.read();
      } catch (error) {
        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
        throw error;
      }
      if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

      buffer += decoder.decode(chunk.value, { stream: !chunk.done });
      // Line endings are \n, \r\n or \r. A trailing \r may be half a \r\n, so it waits for more.
      const held = !chunk.done && buffer.endsWith('\r') ? '\r' : '';
      buffer = buffer.slice(0, buffer.length - held.length).replace(/\r\n?/g, '\n') + held;

      let end: number;
      while ((end = buffer.indexOf('\n\n')) !== -1) {
        const parsed = parseBlock(buffer.slice(0, end));
        buffer = buffer.slice(end + 2);
        if (parsed) yield parsed;
      }
      if (chunk.done) {
        // A final event the server did not close with a blank line is still an event.
        const parsed = parseBlock(buffer.replace(/\r/g, '\n'));
        if (parsed) yield parsed;
        return;
      }
    }
  } finally {
    signal?.removeEventListener('abort', onAbort);
    // Also runs when the consumer stops early: close the connection instead of leaving it open.
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}

/** POSTs JSON and yields the events of the answer. A non-2xx answer (400, 429) throws its ApiError first. */
export async function* postSse(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): AsyncGenerator<SseEvent, void, undefined> {
  const res = await sendRequest(path, {
    method: 'POST',
    body,
    signal,
    accept: 'text/event-stream',
  });
  if (!res.ok) throw await errorFromResponse(res);
  if (!res.body) throw new ApiError('BAD_RESPONSE', res.status, 'The server sent no stream');
  yield* readSse(res.body, signal);
}
