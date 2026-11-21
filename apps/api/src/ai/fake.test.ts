import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { fakeCorrect, FakeProvider } from './fake.ts';
import { LlmBadOutput, LlmFailed, LlmRateLimited } from './provider.ts';

const correctionSchema = z.object({
  isCorrect: z.boolean(),
  corrected: z.string(),
  mistakes: z.array(
    z.object({
      type: z.string(),
      original: z.string(),
      correction: z.string(),
      explanation: z.string(),
    }),
  ),
  praise: z.string().optional(),
});

const base = { model: 'm', system: 'You run a cafe.', maxOutputTokens: 100 };
const user = (text: string) => [{ role: 'user' as const, text }];
const collect = async (it: AsyncIterable<{ type: string; text?: string }>) => {
  const out: { type: string; text?: string }[] = [];
  for await (const e of it) out.push(e);
  return out;
};

describe('fakeCorrect', () => {
  it('accepts a correct sentence and praises it', () => {
    const r = fakeCorrect('أنا طالب');
    expect(r.isCorrect).toBe(true);
    expect(r.mistakes).toEqual([]);
  });

  it('flags a noun missing ال after a demonstrative', () => {
    const r = fakeCorrect('هذا كتاب الجديد');
    expect(r.isCorrect).toBe(false);
    expect(r.corrected).toBe('هذا الكتاب الجديد');
    expect(r.mistakes[0]).toMatchObject({
      type: 'grammar',
      original: 'كتاب',
      correction: 'الكتاب',
    });
  });

  it('flags feminine and masculine disagreement, with or without harakat', () => {
    expect(fakeCorrect('المدرسة كبير').mistakes).toEqual([]); // definite form is not in the word list
    expect(fakeCorrect('مدرسة كبير').corrected).toBe('مدرسة كبيرة');
    expect(fakeCorrect('كِتَاب جميلة').corrected).toBe('كِتَاب جميل');
  });

  it('flags Latin letters', () => {
    expect(fakeCorrect('أنا hello').mistakes[0]).toMatchObject({
      type: 'spelling',
      original: 'hello',
    });
  });
});

describe('FakeProvider', () => {
  it('grades only the learner text of a correction prompt, not its English labels', async () => {
    const fake = new FakeProvider();
    const c = await fake.generateJson({
      ...base,
      purpose: 'correction',
      messages: user(
        'Partner said before (context only):\nمَرْحَبًا\n\nLearner message to grade:\nأنا طالب',
      ),
      schema: correctionSchema,
    });
    expect(c.data.isCorrect).toBe(true);
  });

  it('returns schema-valid JSON for corrections and a translation for gloss', async () => {
    const fake = new FakeProvider();
    const c = await fake.generateJson({
      ...base,
      purpose: 'correction',
      messages: user('مدرسة كبير'),
      schema: correctionSchema,
    });
    expect(c.data.isCorrect).toBe(false);
    expect(c.usage.model).toBe('m');
    const g = await fake.generateJson({
      ...base,
      purpose: 'gloss',
      messages: user('مرحبا'),
      schema: z.object({ translation: z.string() }),
    });
    expect(g.data.translation).toContain('مرحبا');
  });

  it('streams a scripted reply in several chunks, then done', async () => {
    const fake = new FakeProvider();
    const events = await collect(
      fake.streamText({ ...base, purpose: 'reply', messages: user('hi') }),
    );
    const deltas = events.filter((e) => e.type === 'delta');
    expect(deltas.length).toBeGreaterThan(2);
    expect(deltas.map((d) => d.text).join('')).toContain('الْمَقْهَى');
    expect(events.at(-1)?.type).toBe('done');
  });

  it('falls back to the default reply when no keyword matches', async () => {
    const fake = new FakeProvider();
    const events = await collect(
      fake.streamText({ ...base, system: 'x', purpose: 'reply', messages: user('hi') }),
    );
    expect(
      events
        .filter((e) => e.type === 'delta')
        .map((d) => d.text)
        .join(''),
    ).toContain('كَيْفَ');
  });

  it('injects a fault into the next call only', async () => {
    const fake = new FakeProvider();
    const req = {
      ...base,
      purpose: 'correction' as const,
      messages: user('x'),
      schema: correctionSchema,
    };
    fake.rateLimitNext();
    await expect(fake.generateJson(req)).rejects.toBeInstanceOf(LlmRateLimited);
    fake.failNext();
    await expect(fake.generateJson(req)).rejects.toBeInstanceOf(LlmFailed);
    fake.badOutputNext();
    await expect(fake.generateJson(req)).rejects.toBeInstanceOf(LlmBadOutput);
    await expect(fake.generateJson(req)).resolves.toBeDefined();
  });

  it('a fault in a stream throws on the first read; abort cancels a delayed call', async () => {
    const fake = new FakeProvider();
    fake.failNext();
    await expect(
      collect(fake.streamText({ ...base, purpose: 'reply', messages: user('x') })),
    ).rejects.toBeInstanceOf(LlmFailed);
    fake.delay(5000);
    const ac = new AbortController();
    const p = fake.generateJson({
      ...base,
      purpose: 'correction',
      messages: user('x'),
      schema: correctionSchema,
      signal: ac.signal,
    });
    ac.abort();
    await expect(p).rejects.toMatchObject({ code: 'ABORTED' });
  });

  it('records the requests it received', async () => {
    const fake = new FakeProvider();
    await collect(fake.streamText({ ...base, purpose: 'reply', messages: user('x') }));
    expect(fake.requests).toHaveLength(1);
  });
});
