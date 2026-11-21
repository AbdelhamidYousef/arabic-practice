import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import { z } from 'zod';

// The single `.env` lives at the repo root so web, api and tooling share it. dotenv is imported
// only here: everything else receives config through this validated object.
dotenv.config({ path: fileURLToPath(new URL('../../../../.env', import.meta.url)), quiet: true });

// An empty value counts as unset: a copied `.env.example` carries `GEMINI_API_KEY=` and must boot.
// The inner schema then applies its default (or `.optional()`) exactly as for a missing variable.
const unsetIfEmpty = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? undefined : v), schema);

const flag = (fallback: 'true' | 'false') =>
  unsetIfEmpty(
    z
      .enum(['true', 'false'])
      .default(fallback)
      .transform((v) => v === 'true'),
  );

const count = (fallback: number) => unsetIfEmpty(z.coerce.number().int().min(0).default(fallback));

const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: unsetIfEmpty(z.coerce.number().int().positive().default(3002)),
  DATABASE_URL: z.url(),
  // Only the test harness needs it; optional so the dev server boots without it.
  DATABASE_URL_TEST: unsetIfEmpty(z.url().optional()),
  LOG_LEVEL: unsetIfEmpty(
    z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  ),
  // Reduced to an origin (scheme + host + port) because that is what browsers send in `Origin`.
  WEB_ORIGIN: unsetIfEmpty(
    z
      .url()
      .default('http://localhost:5175')
      .transform((value) => new URL(value).origin),
  ),

  // Rate limiting: a general limit per IP, and a stricter one for credential endpoints.
  RATE_LIMIT_WINDOW_MS: unsetIfEmpty(z.coerce.number().int().positive().default(60_000)),
  RATE_LIMIT_MAX: unsetIfEmpty(z.coerce.number().int().positive().default(300)),
  RATE_LIMIT_AUTH_WINDOW_MS: unsetIfEmpty(
    z.coerce
      .number()
      .int()
      .positive()
      .default(15 * 60_000),
  ),
  RATE_LIMIT_AUTH_MAX: unsetIfEmpty(z.coerce.number().int().positive().default(10)),
  // Guest and demo-teacher sign-ins per IP per hour. The e2e run raises it: every test starts
  // as a fresh guest from one address.
  RATE_LIMIT_GUEST_MAX: unsetIfEmpty(z.coerce.number().int().positive().default(10)),

  // AI. Which adapter answers: unset means "gemini if a key exists, else the fake" in development,
  // and "the fake" under NODE_ENV=test. Production refuses `fake` (see the rules below).
  AI_PROVIDER: unsetIfEmpty(z.enum(['fake', 'gemini']).optional()),
  GEMINI_API_KEY: unsetIfEmpty(
    z.string().trim().min(10, 'looks too short for an API key').optional(),
  ),
  // `free` means the provider may train on prompts: only made-up chats may go through it.
  AI_TIER: unsetIfEmpty(z.enum(['free', 'paid']).default('free')),
  // Kill switch: false makes every AI call answer AI_DISABLED without touching the provider.
  AI_ENABLED: flag('true'),
  AI_MODEL_CORRECTION: unsetIfEmpty(z.string().trim().min(1).default('gemini-3.1-flash-lite')),
  AI_MODEL_REPLY: unsetIfEmpty(z.string().trim().min(1).default('gemini-3.1-flash-lite')),
  AI_MODEL_GLOSS: unsetIfEmpty(z.string().trim().min(1).default('gemini-3.1-flash-lite')),
  // Daily caps count rows in `ai_calls`; the monthly budget sums their cost.
  AI_DAILY_TURNS_LEARNER: count(60),
  AI_DAILY_TURNS_GUEST: count(20),
  // The free quota is per model (500 requests a day each for the Flash-Lite models); 450 leaves headroom.
  AI_DAILY_CALLS_PER_MODEL: count(450),
  AI_MONTHLY_BUDGET_USD: unsetIfEmpty(z.coerce.number().min(0).default(0)),

  // Invite sign-up for real students. Production refuses `true` while AI_TIER=free.
  INVITES_ENABLED: flag('false'),

  // Password of the local dev teacher (db:seed). Ignored in production, where the seed refuses to
  // create a login with a known password.
  SEED_TEACHER_PASSWORD: unsetIfEmpty(z.string().min(8).optional()),
});

// Rules that look at several variables at once. Each one turns a promise from the plan into a
// refusal to boot, so a mistake in a hosting dashboard cannot quietly become an open door or a bill.
export const envSchema = baseSchema.superRefine((e, ctx) => {
  const fail = (path: keyof z.infer<typeof baseSchema>, message: string) =>
    ctx.addIssue({ code: 'custom', path: [path], message });
  const production = e.NODE_ENV === 'production';

  // The Origin check (CSRF) compares against it: left at the localhost default, every browser
  // request in production would be refused, and Secure cookies need https anyway.
  if (production && !e.WEB_ORIGIN.startsWith('https://')) {
    fail('WEB_ORIGIN', 'must be the https URL of the deployed web app in production');
  }
  // A production API pointed at a laptop database is a configuration slip, never a plan.
  if (production && ['localhost', '127.0.0.1', '::1'].includes(new URL(e.DATABASE_URL).hostname)) {
    fail('DATABASE_URL', 'must not point at a local database in production');
  }
  // The fake provider answers with canned text. Real learners must never get that by accident.
  if (production && e.AI_PROVIDER === 'fake') {
    fail('AI_PROVIDER', 'the fake provider is refused in production');
  }
  // With the kill switch off no call is made, so no key is needed; otherwise one is.
  if (production && e.AI_ENABLED && e.GEMINI_API_KEY === undefined) {
    fail(
      'GEMINI_API_KEY',
      'is required in production while AI_ENABLED=true (or set AI_ENABLED=false)',
    );
  }
  // The free tier lets the provider train on prompts, so real students cannot sign up on it.
  if (production && e.INVITES_ENABLED && e.AI_TIER === 'free') {
    fail(
      'INVITES_ENABLED',
      'cannot be true while AI_TIER=free: free-tier prompts may be used for training',
    );
  }

  // Wherever it runs: asking for the gemini adapter without a key, and paid spend without a ceiling.
  if (e.AI_PROVIDER === 'gemini' && e.GEMINI_API_KEY === undefined) {
    fail('GEMINI_API_KEY', 'is required when AI_PROVIDER=gemini');
  }
  if (e.AI_TIER === 'paid' && e.AI_MONTHLY_BUDGET_USD <= 0) {
    fail('AI_MONTHLY_BUDGET_USD', 'must be above 0 when AI_TIER=paid: paid use needs a hard cap');
  }
});

export type Env = z.infer<typeof envSchema>;

// Fail at boot with a readable message instead of at the first request that needs a variable.
export const env = envSchema.parse(process.env);
