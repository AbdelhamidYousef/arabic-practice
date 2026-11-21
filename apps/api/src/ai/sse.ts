// Server-Sent Events, the framing Gemini uses for streaming. The body is plain text made of events;
// an event is one or more `data: ...` lines and a BLANK LINE ends it:
//
//   data: {"candidates":[...]}
//   <blank>
//   data: {"candidates":[...]}
//   <blank>
//
// A network chunk can end anywhere (even in the middle of a line, or in the middle of a multi-byte
// Arabic letter), so we buffer: decode with a streaming TextDecoder, split on blank lines, and keep
// the unfinished tail for the next chunk. Gemini sends no `[DONE]`; the stream just closes.
export async function* parseSse(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let boundary: RegExpExecArray | null;
      while ((boundary = /\r?\n\r?\n/.exec(buffer))) {
        const raw = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        const data = dataOf(raw);
        if (data !== undefined) yield data;
      }
    }
    // The server may close without a final blank line; an event already in the buffer still counts.
    buffer += decoder.decode();
    const data = dataOf(buffer);
    if (data !== undefined) yield data;
  } finally {
    // Stops the download if the consumer quits early (learner closed the tab, abort).
    await reader.cancel().catch(() => undefined);
  }
}

// The payload of one event: its `data:` lines joined with newlines (the SSE rule). Comment lines
// (starting with `:`) and other fields are ignored.
function dataOf(rawEvent: string): string | undefined {
  const lines = rawEvent
    .split(/\r?\n/)
    .filter((l) => l.startsWith('data:'))
    .map((l) => l.slice(5).replace(/^ /, ''));
  return lines.length > 0 ? lines.join('\n') : undefined;
}
