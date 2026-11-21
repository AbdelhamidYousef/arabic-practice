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

export const envSchema = z.object({
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
  AI_MODEL_CORRECTION: unsetIfEmpty(z.string().trim().min(1).default('gemini-2.5-flash')),
  AI_MODEL_REPLY: unsetIfEmpty(z.string().trim().min(1).default('gemini-2.5-flash')),
  AI_MODEL_GLOSS: unsetIfEmpty(z.string().trim().min(1).default('gemini-2.5-flash-lite')),
  // Daily caps count rows in `ai_calls`; the monthly budget sums their cost.
  AI_DAILY_TURNS_LEARNER: count(60),
  AI_DAILY_TURNS_GUEST: count(20),
  AI_DAILY_CALLS_GLOBAL: count(400),
  AI_MONTHLY_BUDGET_USD: unsetIfEmpty(z.coerce.number().min(0).default(0)),

  // Invite sign-up for real students. Production refuses `true` while AI_TIER=free.
  INVITES_ENABLED: flag('false'),

  // Password of the local dev teacher (db:seed). Ignored in production, where the seed refuses to
  // create a login with a known password.
  SEED_TEACHER_PASSWORD: unsetIfEmpty(z.string().min(8).optional()),
});

export type Env = z.infer<typeof envSchema>;

// Fail at boot with a readable message instead of at the first request that needs a variable.
export const env = envSchema.parse(process.env);
