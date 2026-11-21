import { describe, expect, it } from 'vitest';

import { envSchema } from './env.ts';

const base = { DATABASE_URL: 'postgres://u:p@localhost:5434/db' };

function problems(source: Record<string, string>): string[] {
  const result = envSchema.safeParse(source);
  return result.success ? [] : result.error.issues.map((i) => i.path.join('.'));
}

describe('defaults', () => {
  it('boots with only DATABASE_URL and applies the documented defaults', () => {
    const e = envSchema.parse(base);
    expect(e).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3002,
      WEB_ORIGIN: 'http://localhost:5175',
      AI_TIER: 'free',
      AI_ENABLED: true,
      AI_DAILY_TURNS_LEARNER: 60,
      AI_DAILY_TURNS_GUEST: 20,
      AI_DAILY_CALLS_GLOBAL: 400,
      AI_MONTHLY_BUDGET_USD: 0,
      INVITES_ENABLED: false,
    });
    expect(e.AI_PROVIDER).toBeUndefined();
    expect(e.GEMINI_API_KEY).toBeUndefined();
  });

  it('treats empty values (a fresh .env copied from .env.example) as unset', () => {
    const e = envSchema.parse({
      ...base,
      AI_PROVIDER: '',
      GEMINI_API_KEY: '',
      AI_TIER: '',
      AI_ENABLED: '',
      AI_DAILY_TURNS_LEARNER: '',
      AI_MONTHLY_BUDGET_USD: '',
      INVITES_ENABLED: '',
      SEED_TEACHER_PASSWORD: '',
      DATABASE_URL_TEST: '',
      PORT: '',
    });
    expect(e.AI_PROVIDER).toBeUndefined();
    expect(e.AI_TIER).toBe('free');
    expect(e.AI_ENABLED).toBe(true);
    expect(e.AI_DAILY_TURNS_LEARNER).toBe(60);
    expect(e.INVITES_ENABLED).toBe(false);
    expect(e.SEED_TEACHER_PASSWORD).toBeUndefined();
    expect(e.PORT).toBe(3002);
  });
});

describe('validation', () => {
  it('requires a database url', () => {
    expect(problems({})).toEqual(['DATABASE_URL']);
  });

  it('reduces WEB_ORIGIN to an origin', () => {
    expect(
      envSchema.parse({ ...base, WEB_ORIGIN: 'http://localhost:5175/some/path' }).WEB_ORIGIN,
    ).toBe('http://localhost:5175');
  });

  it('parses the flags and caps', () => {
    const e = envSchema.parse({
      ...base,
      AI_ENABLED: 'false',
      INVITES_ENABLED: 'true',
      AI_DAILY_CALLS_GLOBAL: '10',
      AI_MONTHLY_BUDGET_USD: '2.5',
    });
    expect(e).toMatchObject({
      AI_ENABLED: false,
      INVITES_ENABLED: true,
      AI_DAILY_CALLS_GLOBAL: 10,
      AI_MONTHLY_BUDGET_USD: 2.5,
    });
  });

  it.each([
    ['AI_PROVIDER', 'openai'],
    ['AI_TIER', 'premium'],
    ['AI_ENABLED', 'yes'],
    ['AI_DAILY_TURNS_GUEST', '-1'],
    ['AI_DAILY_TURNS_GUEST', '1.5'],
    ['AI_MONTHLY_BUDGET_USD', '-3'],
    ['GEMINI_API_KEY', 'short'],
    ['LOG_LEVEL', 'loud'],
    ['SEED_TEACHER_PASSWORD', 'short'],
  ])('rejects %s=%s', (name, value) => {
    expect(problems({ ...base, [name]: value })).toEqual([name]);
  });
});
