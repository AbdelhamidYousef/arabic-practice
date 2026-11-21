import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { env } from '../config/env.ts';

import { GeminiProvider } from './gemini.ts';

// Hits the real API: excluded from `pnpm test`, run with `pnpm --filter @arabic/api test:live`.
// Skips LOUDLY (a visible skipped test with the reason) when there is no key, so CI never needs a secret.
// A handful of calls on one free model; the key is never printed.
const key = env.GEMINI_API_KEY;
const model = 'gemini-3.5-flash-lite';

describe.skipIf(!key)('gemini live', () => {
  const p = new GeminiProvider({ apiKey: key ?? 'x' });
  const base = { model, maxOutputTokens: 200, system: 'You are a concise Arabic teacher.' };

  it('generateJson returns schema-valid data', async () => {
    const { data, usage } = await p.generateJson({
      ...base,
      purpose: 'eval',
      messages: [{ role: 'user', text: 'Translate "book" to Arabic with full harakat.' }],
      schema: z.object({ arabic: z.string(), english: z.string() }),
    });
    console.info('live generateJson', { data, usage });
    expect(data.arabic.length).toBeGreaterThan(0);
    expect(usage.inputTokens).toBeGreaterThan(0);
  }, 30_000);

  it('streamText streams deltas and ends with usage', async () => {
    const deltas: string[] = [];
    let done: unknown;
    for await (const e of p.streamText({
      ...base,
      purpose: 'eval',
      messages: [{ role: 'user', text: 'Say hello in Arabic, one short sentence, full harakat.' }],
    })) {
      if (e.type === 'delta') deltas.push(e.text);
      else done = e.usage;
    }
    console.info('live streamText', { chunks: deltas.length, text: deltas.join(''), usage: done });
    expect(deltas.length).toBeGreaterThan(0);
    expect(done).toMatchObject({ model });
  }, 30_000);
});

if (!key) {
  console.warn('SKIPPED gemini.live.test.ts: GEMINI_API_KEY is not set');
}
