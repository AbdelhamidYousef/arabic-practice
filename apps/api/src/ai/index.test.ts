import { pino, type Logger } from 'pino';
import { describe, expect, it } from 'vitest';

import { db } from '../db/client.ts';

import { createAiRuntime } from './index.ts';

const base = {
  NODE_ENV: 'development' as const,
  AI_PROVIDER: undefined,
  GEMINI_API_KEY: undefined,
  AI_TIER: 'free' as const,
  AI_ENABLED: true,
  AI_MODEL_CORRECTION: 'gemini-3.5-flash-lite',
  AI_MODEL_REPLY: 'gemini-3.1-flash-lite',
  AI_MODEL_GLOSS: 'gemini-3.1-flash-lite',
  AI_DAILY_TURNS_LEARNER: 60,
  AI_DAILY_TURNS_GUEST: 20,
  AI_DAILY_GLOSS_LEARNER: 60,
  AI_DAILY_GLOSS_GUEST: 20,
  AI_DAILY_CALLS_PER_MODEL: 450,
  AI_MONTHLY_BUDGET_USD: 0,
};

function warnings(run: (logger: Logger) => void): string[] {
  const out: string[] = [];
  const logger: Logger = pino({ level: 'warn' }, { write: (s: string) => out.push(s) });
  run(logger);
  return out;
}

describe('createAiRuntime', () => {
  it('uses the fake under NODE_ENV=test, even with a key, and says nothing', () => {
    const logs = warnings((l) => {
      const r = createAiRuntime(
        { ...base, NODE_ENV: 'test', GEMINI_API_KEY: 'k'.repeat(12) },
        db,
        l,
      );
      expect(r.provider).toBe('fake');
    });
    expect(logs).toEqual([]);
  });

  it('uses gemini when a key is set', () => {
    const r = createAiRuntime({ ...base, GEMINI_API_KEY: 'k'.repeat(12) }, db);
    expect(r.provider).toBe('gemini');
  });

  it('falls back to the fake in development without a key, with a loud warning', () => {
    const logs = warnings((l) => {
      expect(createAiRuntime(base, db, l).provider).toBe('fake');
    });
    expect(logs.join('')).toContain('FAKE provider');
  });

  it('does not warn when the fake was asked for explicitly', () => {
    const logs = warnings((l) => {
      createAiRuntime({ ...base, AI_PROVIDER: 'fake' }, db, l);
    });
    expect(logs).toEqual([]);
  });

  it('exposes the model per purpose and the kill switch', () => {
    const r = createAiRuntime({ ...base, AI_ENABLED: false }, db);
    expect(r.enabled).toBe(false);
    expect(r.models).toEqual({
      correction: 'gemini-3.5-flash-lite',
      reply: 'gemini-3.1-flash-lite',
      gloss: 'gemini-3.1-flash-lite',
    });
  });
});
