import { pino } from 'pino';

// drizzle-orm wraps every failed query in a DrizzleQueryError that carries the SQL parameters
// (`params`) AND repeats them in its message ("Failed query: ...\nparams: a@b.com,<hash>"); the
// postgres driver error underneath (`cause`) has `parameters`, and a unique violation's `detail`
// reads "Key (email)=(a@b.com) already exists". Emails and hashes must never reach a log aggregator,
// so errors are scrubbed of all of that before they are serialised. The SQL text itself keeps only
// $1, $2 placeholders, so it stays: it is what makes the error debuggable.
const PRIVATE_KEYS = new Set(['params', 'parameters', 'detail']);
const MAX_CAUSE_DEPTH = 5;

// The message line that starts with "params:" runs to the stack frames (or the end).
const dropParamsLine = (text: string): string =>
  text.replace(/\nparams:[\s\S]*?(?=\n\s+at |$)/g, '');

export function scrubError(err: unknown, depth = 0): unknown {
  if (!(err instanceof Error)) return err;
  const out: Record<string, unknown> = {
    ...(pino.stdSerializers.err(err) as unknown as Record<string, unknown>),
  };
  for (const key of PRIVATE_KEYS) delete out[key];
  if (typeof out.message === 'string') out.message = dropParamsLine(out.message);
  if (typeof out.stack === 'string') out.stack = dropParamsLine(out.stack);
  // pino's serializer already walks `cause`; replace it with our own scrubbed walk.
  delete out.cause;
  if (err.cause !== undefined && depth < MAX_CAUSE_DEPTH) {
    out.cause = scrubError(err.cause, depth + 1);
  }
  return out;
}
