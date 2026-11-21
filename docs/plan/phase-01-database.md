# Phase 1 — Database schema, migrations, test harness, seed

Goal: the data model from `01-data-model.md` as Drizzle schema + SQL migrations, a fast test harness,
and an idempotent seed of made-up lessons and learners.

## Step 1.1 — Drizzle client, env validation, base migration
- `config/env.ts` (Zod, fail fast; empty string = unset), `db/client.ts`, `drizzle.config.ts`.
- Migration 0000: `citext`, `pgcrypto` (if needed for `gen_random_uuid` on PG16: built in), `set_updated_at()`.
- Commit: `feat(api): add drizzle client, env validation and base migration`

## Step 1.2 — shared Arabic text helpers
- `packages/shared/src/arabic.ts`: `stripHarakat`, `normalizeArabic` (harakat, tatweel, alef forms,
  alef maqsura → ya, ta marbuta → ha for matching), `tokenizeArabic`, `isArabic`, `harakatRatio`,
  `hasLatin`. Thorough unit tests with real words.
- Learn / explain: Unicode combining marks (U+064B–U+0652, U+0670), why matching folds letters.
- Commit: `feat(shared): add arabic text normalisation helpers`

## Step 1.3 — users, sessions, invites
- Schema + migration 0001; repo-level test (cascade on user delete).
- Commit: `feat(api): add users, sessions and invites tables`

## Step 1.4 — lessons and vocab
- Migration 0002. Test: duplicate `arabic_plain` in one lesson rejected.
- Commit: `feat(api): add lessons and vocabulary tables`

## Step 1.5 — conversations, messages, corrections, mistakes, vocab cards, ai calls
- Migration 0003. Test: box check constraint; correction unique per message.
- Commit: `feat(api): add practice, review and ai usage tables`

## Step 1.6 — test harness
- `src/test/setup.ts`: `globalSetup` migrates `DATABASE_URL_TEST` once (guard: name must end in `_test`);
  before each test, DELETE from tables that have rows, in FK order read from `pg_constraint`.
  Factories (`createUser`, `createLesson`, `createConversation`) with a placeholder password hash.
- Commit: `test(api): add fast database test harness and factories`

## Step 1.7 — seed
- `db/seed/`: demo teacher (read-only, `demo-teacher@arabic-practice.test`), a dev teacher login for
  local work, **12 made-up MSA lessons** A1 → B2 (greetings, family, café order, directions, daily
  routine, shopping, weather, at the doctor, travel plans, hobbies, work and study, news headlines),
  each with goals, grammar focus, scenario, opening line and 8–12 vocab items with full harakat.
  4 made-up learners of the demo teacher with conversations, corrections and mistakes, so the teacher view has data.
- Lesson content is written once as data (`db/seed/lessons.ts`) and checked with Zod at seed time.
- Idempotent upserts (`slug`, `email`); `pnpm db:reset` (local only).
- Commit: `feat(api): add idempotent seed with lessons and demo class`

Phase 1 done when `pnpm db:reset` gives the full demo data, and table tests pass in seconds.
