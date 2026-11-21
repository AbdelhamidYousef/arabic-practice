import { describe, expect, it } from 'vitest';

import { FakeProvider } from '../ai/fake.ts';
import { LlmFailed, LlmRateLimited, type JsonRequest, type TextRequest } from '../ai/provider.ts';
import { seedLessons } from '../db/seed/lessons.ts';

import { renderReport, reportFileName, scoreRun } from './report.ts';
import { caseFilePath, loadCases, runEval, takeSpread, type Pacing } from './run.ts';

// The runner on the fake provider: covers the case loading, the real prompt path, pacing, the
// scorer wiring and the report writer without a key. It tests the harness, not a model.

describe('case set', () => {
  it('loads, and every case refers to a seed lesson', () => {
    const cases = loadCases();
    const slugs = new Set(seedLessons.map((l) => l.slug));
    expect(cases.corrections.length).toBeGreaterThanOrEqual(40);
    expect(cases.replies.length).toBeGreaterThanOrEqual(10);
    for (const c of [...cases.corrections, ...cases.replies])
      expect(slugs.has(c.lessonSlug)).toBe(true);
    const ids = [...cases.corrections, ...cases.replies].map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('takeSpread', () => {
  it('spreads evenly and keeps everything when the limit is large', () => {
    expect(takeSpread([0, 1, 2, 3, 4, 5], 3)).toEqual([0, 2, 4]);
    expect(takeSpread([0, 1, 2], 10)).toEqual([0, 1, 2]);
    expect(takeSpread([0, 1, 2], undefined)).toEqual([0, 1, 2]);
    expect(takeSpread([0, 1, 2], 0)).toEqual([]);
  });
});

describe('runEval on the fake', () => {
  it('retries a busy model (HTTP 503) like a 429', async () => {
    const provider = new FakeProvider();
    const real = provider.generateJson.bind(provider);
    let calls = 0;
    provider.generateJson = ((req: JsonRequest<unknown>) => {
      calls += 1;
      if (calls === 1) return Promise.reject(new LlmFailed('HTTP_503', 'UNAVAILABLE: high demand'));
      return real(req);
    }) as typeof provider.generateJson;
    const run = await runEval({
      provider,
      correctionModel: 'c',
      replyModel: 'r',
      only: 'corrections',
      limit: 1,
      pacing: { minGapMs: 0, retryWaitMs: 1, maxRetries: 3 },
      sleep: () => Promise.resolve(),
    });
    expect(run.corrections[0]?.result).toBeDefined();
    expect(calls).toBe(2);
  });

  it('runs every case through the app prompts and writes a report', async () => {
    const provider = new FakeProvider();
    const run = await runEval({ provider, correctionModel: 'fake-c', replyModel: 'fake-r' });
    const cases = loadCases();
    expect(run.corrections).toHaveLength(cases.corrections.length);
    expect(run.replies).toHaveLength(cases.replies.length);
    expect(run.corrections.every((o) => o.result && !o.error)).toBe(true);

    // The real prompt builders were used: lesson context in the system prompt, opening line first.
    const jsonReq = provider.requests.find((r) => 'schema' in r) as JsonRequest<unknown>;
    expect(jsonReq.purpose).toBe('eval');
    expect(jsonReq.model).toBe('fake-c');
    expect(jsonReq.system).toContain('LESSON:');
    expect(jsonReq.messages[0]?.text).toContain('Learner message to grade:');
    const textReq = provider.requests.find((r) => !('schema' in r)) as TextRequest;
    expect(textReq.model).toBe('fake-r');
    expect(textReq.messages.at(-1)?.role).toBe('user');

    const scored = scoreRun(run);
    expect(scored.corrections).toHaveLength(cases.corrections.length);
    const md = renderReport(run, '2026-11-21');
    expect(md).toContain('# Eval report 2026-11-21: fake');
    expect(md).toContain('Run on the FAKE provider');
    expect(md).toContain('## Corrections: summary');
    expect(md).toContain('### By level');
    expect(md).toContain('### Failed cases (');
    expect(md).toContain('### Reply samples (up to 3 per level)');
  });

  it('honours --only and --limit', async () => {
    const run = await runEval({
      provider: new FakeProvider(),
      correctionModel: 'c',
      replyModel: 'r',
      only: 'corrections',
      limit: 5,
    });
    expect(run.corrections).toHaveLength(5);
    expect(run.replies).toHaveLength(0);
    expect(reportFileName(run, '2026-11-21')).toBe('2026-11-21-fake-c__none.md');
    const md = renderReport(run, '2026-11-21');
    expect(md).not.toContain('## Replies: summary');
    expect(md).toContain('Reply model: not run');
  });

  it('runs the held-out set, names its report apart and says so in it', async () => {
    const run = await runEval({
      provider: new FakeProvider(),
      correctionModel: 'c',
      replyModel: 'r',
      set: 'held-out',
    });
    const heldOut = loadCases(caseFilePath('held-out'));
    expect(run.set).toBe('held-out');
    expect(run.corrections).toHaveLength(heldOut.corrections.length);
    expect(run.replies).toHaveLength(heldOut.replies.length);
    expect(reportFileName(run, '2026-11-21')).toBe('2026-11-21-fake-c__r-held-out.md');
    expect(renderReport(run, '2026-11-21')).toContain('Case set: held-out');
  });

  it('keeps the held-out set apart from the tuning set', () => {
    const main = loadCases();
    const heldOut = loadCases(caseFilePath('held-out'));
    expect(heldOut.corrections.length + heldOut.replies.length).toBe(20);
    const mainTexts = new Set([
      ...main.corrections.map((c) => c.text),
      ...main.replies.map((r) => r.learnerText),
    ]);
    for (const c of heldOut.corrections) expect(mainTexts.has(c.text)).toBe(false);
    for (const r of heldOut.replies) expect(mainTexts.has(r.learnerText)).toBe(false);
  });

  it('waits between calls to the same model and retries a 429 up to the limit', async () => {
    const pacing: Pacing = { minGapMs: 4500, retryWaitMs: 30_000, maxRetries: 3 };
    let clock = 0;
    const sleeps: number[] = [];
    const provider = new FakeProvider();
    provider.rateLimitNext();
    const run = await runEval({
      provider,
      correctionModel: 'c',
      replyModel: 'r',
      only: 'corrections',
      limit: 2,
      pacing,
      now: () => clock,
      sleep: (ms) => {
        sleeps.push(ms);
        clock += ms;
        return Promise.resolve();
      },
    });
    expect(run.corrections.every((o) => o.result)).toBe(true);
    expect(sleeps[0]).toBe(30_000);
    expect(sleeps).toContain(4500);
  });

  it('records an error after the retries run out and keeps going', async () => {
    const provider = new FakeProvider();
    const real = provider.generateJson.bind(provider);
    let calls = 0;
    provider.generateJson = (async (req: JsonRequest<unknown>) => {
      calls += 1;
      if (calls <= 4) throw new LlmRateLimited('busy');
      return real(req);
    }) as typeof provider.generateJson;
    const run = await runEval({
      provider,
      correctionModel: 'c',
      replyModel: 'r',
      only: 'corrections',
      limit: 2,
      pacing: { minGapMs: 0, retryWaitMs: 1, maxRetries: 3 },
      sleep: () => Promise.resolve(),
    });
    expect(run.corrections[0]?.error).toContain('LlmRateLimited');
    expect(run.corrections[1]?.result).toBeDefined();
    const md = renderReport(run, '2026-11-21');
    expect(md).toContain('1 errors');
    expect(md).toContain('### Correction calls that errored');
  });
});
