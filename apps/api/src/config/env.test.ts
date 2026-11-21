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
      AI_DAILY_GLOSS_LEARNER: 60,
      AI_DAILY_GLOSS_GUEST: 20,
      AI_DAILY_CALLS_PER_MODEL: 450,
      AI_MONTHLY_BUDGET_USD: 0,
      CONVERSATIONS_PER_DAY_GUEST: 10,
      CONVERSATIONS_PER_DAY_LEARNER: 40,
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

describe('guest limits config', () => {
  it('defaults GUESTS_PER_DAY to 300 and leaves IP_HASH_SALT unset outside production', () => {
    const e = envSchema.parse(base);
    expect(e.GUESTS_PER_DAY).toBe(300);
    expect(e.IP_HASH_SALT).toBeUndefined();
  });

  it('requires IP_HASH_SALT in production and rejects a short one', () => {
    const prod = {
      ...base,
      NODE_ENV: 'production',
      WEB_ORIGIN: 'https://app.example.com',
      DATABASE_URL: 'postgres://u:p@db.example.com/db',
      AI_ENABLED: 'false',
    };
    expect(problems(prod)).toEqual(['IP_HASH_SALT']);
    expect(problems({ ...prod, IP_HASH_SALT: 'too-short' })).toEqual(['IP_HASH_SALT']);
    expect(problems({ ...prod, IP_HASH_SALT: 'x'.repeat(24) })).toEqual([]);
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
      AI_DAILY_CALLS_PER_MODEL: '10',
      AI_MONTHLY_BUDGET_USD: '2.5',
    });
    expect(e).toMatchObject({
      AI_ENABLED: false,
      INVITES_ENABLED: true,
      AI_DAILY_CALLS_PER_MODEL: 10,
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

// A complete, valid production configuration; each test below breaks exactly one thing.
const production = {
  ...base,
  DATABASE_URL: 'postgres://u:p@ep-example.neon.tech/db',
  NODE_ENV: 'production',
  WEB_ORIGIN: 'https://arabic-practice.example.app',
  GEMINI_API_KEY: 'AIza-example-key-0000',
  IP_HASH_SALT: 'a-random-salt-0123456789',
};

describe('production rules', () => {
  it('boots with a complete production configuration', () => {
    expect(problems(production)).toEqual([]);
  });

  it('requires an https WEB_ORIGIN', () => {
    expect(problems({ ...production, WEB_ORIGIN: 'http://arabic-practice.example.app' })).toEqual([
      'WEB_ORIGIN',
    ]);
    expect(problems({ ...production, WEB_ORIGIN: '' })).toEqual(['WEB_ORIGIN']);
  });

  it('refuses a local database', () => {
    for (const url of ['postgres://u:p@localhost:5434/db', 'postgres://u:p@127.0.0.1/db']) {
      expect(problems({ ...production, DATABASE_URL: url })).toEqual(['DATABASE_URL']);
    }
  });

  it('refuses AI_PROVIDER=fake', () => {
    expect(problems({ ...production, AI_PROVIDER: 'fake' })).toEqual(['AI_PROVIDER']);
    expect(problems({ ...production, AI_PROVIDER: 'gemini' })).toEqual([]);
  });

  it('requires a Gemini key while AI is enabled, and only then', () => {
    const noKey = { ...production, GEMINI_API_KEY: '' }; // empty counts as unset
    expect(problems(noKey)).toEqual(['GEMINI_API_KEY']);
    expect(problems({ ...noKey, GEMINI_API_KEY: '' })).toEqual(['GEMINI_API_KEY']);
    expect(problems({ ...noKey, AI_ENABLED: 'false' })).toEqual([]);
  });

  it('refuses INVITES_ENABLED=true while AI_TIER=free', () => {
    expect(problems({ ...production, INVITES_ENABLED: 'true' })).toEqual(['INVITES_ENABLED']);
    expect(problems({ ...production, INVITES_ENABLED: 'true', AI_TIER: '' })).toEqual([
      'INVITES_ENABLED',
    ]);
  });

  it('allows invites on the paid tier, which needs a monthly budget', () => {
    const paid = { ...production, AI_TIER: 'paid', INVITES_ENABLED: 'true' };
    expect(problems(paid)).toEqual(['AI_MONTHLY_BUDGET_USD']);
    expect(problems({ ...paid, AI_MONTHLY_BUDGET_USD: '5' })).toEqual([]);
  });

  it('reports every broken rule at once', () => {
    const noKey = { ...production, GEMINI_API_KEY: '' }; // empty counts as unset
    expect(
      problems({ ...noKey, WEB_ORIGIN: 'http://x.example', INVITES_ENABLED: 'true' }).sort(),
    ).toEqual(['GEMINI_API_KEY', 'INVITES_ENABLED', 'WEB_ORIGIN']);
  });

  it('does not apply the production rules in development or test', () => {
    const local = {
      ...base,
      INVITES_ENABLED: 'true',
      WEB_ORIGIN: 'http://localhost:5175',
      AI_PROVIDER: 'fake',
    };
    expect(problems(local)).toEqual([]);
    expect(problems({ ...local, NODE_ENV: 'test' })).toEqual([]);
  });
});

describe('rules that apply everywhere', () => {
  it('requires a key when the gemini adapter is asked for explicitly', () => {
    expect(problems({ ...base, AI_PROVIDER: 'gemini' })).toEqual(['GEMINI_API_KEY']);
    expect(
      problems({ ...base, AI_PROVIDER: 'gemini', GEMINI_API_KEY: 'AIza-example-key-0000' }),
    ).toEqual([]);
  });

  it('refuses the paid tier without a spending ceiling', () => {
    expect(problems({ ...base, AI_TIER: 'paid' })).toEqual(['AI_MONTHLY_BUDGET_USD']);
    expect(problems({ ...base, AI_TIER: 'paid', AI_MONTHLY_BUDGET_USD: '0' })).toEqual([
      'AI_MONTHLY_BUDGET_USD',
    ]);
    expect(problems({ ...base, AI_TIER: 'paid', AI_MONTHLY_BUDGET_USD: '10' })).toEqual([]);
  });
});
