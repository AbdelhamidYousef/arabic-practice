# Build journal

What was built per step and why, for the owner to read; three quiz questions at the end of each phase.

## Phase 0 — Repo bootstrap, tooling, gates, CI

- **0.1 node version and editor config.** `.nvmrc` pins Node 22 and `.editorconfig` keeps every editor
  on the same whitespace rules. Learn: `.env.*` is ignored by `.gitignore` but `.env.example` is
  re-included with `!.env.example`, so the documented template is tracked while real values never are.
- **0.2 pnpm workspace and base tsconfig.** `pnpm-workspace.yaml` lists `apps/*` and `packages/*`; the
  root `package.json` holds the scripts and dev tools, and `tsconfig.base.json` the strict settings every
  workspace extends. Learn: pnpm's `node_modules` is strict (a package can only import what it declares),
  `workspace:*` links a sibling package instead of downloading it, and `tsc -b` follows project
  references so the whole repo type-checks in dependency order.
- **0.3 `@arabic/shared`.** The error codes (with their HTTP statuses) and the CEFR levels live in one
  package that both the API and the web import. Learn: a code is a stable name the browser can switch
  on; the message is only for humans.
- **0.4 API skeleton.** `createApp()` builds the Express app without listening, so Supertest can call it
  without a port. Learn: separating "build" from "listen" is what makes the API testable.
- **0.5 web skeleton.** Vite + React + Tailwind. The dev server proxies `/api` to the API, so the browser
  only ever talks to one origin and cookies need no CORS tricks. Learn: `strictPort` makes Vite fail
  instead of silently moving to another port, which would break the proxy and the Origin check.
- **0.6 lint, format, hooks.** ESLint (type-aware), Prettier, and a pre-commit hook that runs both on
  staged files. The files landed earlier (steps 0.2/0.3) because the gates needed them from the start.
  Learn: a hook is the last cheap line of defence; CI is the one that cannot be skipped.
- **0.7 docker compose.** Postgres 16 on `127.0.0.1:5434` with `fsync` off, plus a second database
  `arabic_test`. Learn: fsync forces every write to disk before answering. That is what protects real
  data after a crash, and it is pure waste for a database you can rebuild from the seed in seconds.
- **0.8 CI.** Parallel `check` and `test` jobs, cached pnpm store, older runs cancelled, and a gitleaks
  scan of the full history. Learn: a secret deleted in a later commit is still in history, so the scan
  reads history, not just the tip.
- **0.9 README stub.** The commands to run it.

### Quiz (phase 0)
1. Why does the Vite dev server proxy `/api` instead of the browser calling port 3002 directly?
2. What does `workspace:*` in a `package.json` mean, and why does pnpm refuse imports a package has not declared?
3. Why is `fsync=off` acceptable in `docker-compose.yml` but never in production?

## Phase 1 — Database schema, migrations, test harness, seed

- **1.1 Drizzle client, env validation, base migration.** `config/env.ts` reads the one `.env` at the repo
  root and validates it with Zod at boot; `db/client.ts` is one connection pool; migration 0000 installs
  `citext` and the `set_updated_at()` trigger function. Learn: an empty value in `.env` counts as unset
  (a copied `.env.example` has many empty lines), and the API refuses to start with a bad value instead
  of failing at the first request that needs it.
- **1.2 Arabic helpers.** `stripHarakat`, `normalizeArabic`, `tokenizeArabic`, `isArabic`, `harakatRatio`,
  `hasLatin`. Learn: harakat are separate combining characters (U+064B to U+0652, plus U+0670 for the
  superscript alef) placed after the letter, so a word can be written with or without them. Matching folds
  the differences learners make without changing the word (alef with hamza, ى/ي, ة/ه) but keeps ؤ and ئ,
  because dropping those would merge different words.
- **1.3 users, sessions, invites.** Migration 0001. Learn: the cookie holds a random value and the database
  keeps only its SHA-256, so a leaked table cannot be replayed as logins; an invite is claimed with one
  conditional `UPDATE ... WHERE used_count < max_uses`, so two people cannot take the last use.
- **1.4 lessons and vocab.** Migration 0002. `arabic_plain` is computed in code by `normalizeArabic`, and
  a unique `(lesson_id, arabic_plain)` stops two spellings of one word in a lesson.
- **1.5 practice, review and AI usage tables.** Migration 0003: conversations, messages, corrections
  (one per message), mistakes, vocab cards (Leitner box 1 to 5, a check constraint) and the `ai_calls`
  ledger. Learn: money is stored as integer millionths of a dollar so sums never drift.
- **1.6 test harness.** Tests share one real Postgres database. Before each test only the tables that hold
  rows are emptied, with DELETE in foreign-key order read from the database itself. Learn: TRUNCATE
  rebuilds indexes and was the slow part in Pawsome; DELETE of a few rows is milliseconds.
- **1.7 seed.** Twelve made-up lessons (A1 to B2), each with goals, grammar focus, a scenario for the AI
  partner, an opening line and 8 to 12 vocabulary items with full harakat; four made-up learners with
  conversations, corrections and mistakes; a read-only demo teacher and a local dev teacher. Learn: a
  typo in a vowel mark is invisible to a program that checks types, so the lesson data goes through a
  structural check (a mark needs a letter, one vowel per letter, tanwin only at the word end, ة and ى only
  at the end) before it is written. It cannot prove the Arabic right: **the Arabic needs the teacher's read.**

### Quiz (phase 1)
1. Why does matching use `normalizeArabic()` on both sides instead of comparing strings directly, and why are ؤ and ئ left unfolded?
2. Why does the test harness read the foreign keys from `pg_constraint` and delete in that order, instead of keeping a hard-coded list?
3. An invite has `max_uses = 1` and two people submit the sign-up at the same moment. Which single SQL statement decides who wins, and why is checking `used_count` first in code not enough?

## Phase 2 — API foundation

- **2.1 App factory, errors, request logging.** `createApp({ config, db, logger, ai })` takes everything
  it uses as arguments. `AppError(code, message)` is the only error services throw; the error middleware is
  the only place it becomes an HTTP response, in one JSON shape `{ error: { code, message, details? } }`.
  The request id is accepted from the caller only if it looks like an id, then goes on every log line.
  Learn: a log line is text an attacker can influence, so anything that reaches it (a header) is validated first.
- **2.2 Security middleware.** helmet headers, a 16 kB JSON limit, an Origin check on every mutation, a
  general rate limit per IP, and helpers for stricter limits (per IP + email, per IP). Learn: SameSite
  cookies already withhold the cookie from a cross-site POST; the Origin check is a second, independent layer,
  and a lookalike origin (`http://localhost:5175.evil.example`) is refused because origins are compared whole.
- **2.3 Health with a database ping.** `GET /api/v1/health` answers 503 when the database is down or hangs,
  and always reports which AI adapter is configured and whether AI is switched on. Learn: a probe that
  only reads the status code must see "not ok" as a status, not as a 200 with a sad message.
- **2.4 Production rules.** The environment schema refuses to boot in production with: a non-https
  `WEB_ORIGIN`, a local database, `AI_PROVIDER=fake`, no Gemini key while AI is on, or
  `INVITES_ENABLED=true` on the free tier. Everywhere it refuses `AI_PROVIDER=gemini` without a key and the
  paid tier without a monthly budget. Learn: turning a promise ("real students never touch the free tier")
  into a boot failure means a mistake in a hosting dashboard cannot quietly break it. The fake provider is
  chosen by `NODE_ENV=test` only, never by a flag production could set.

### Quiz (phase 2)
1. Why is the request id validated before it is logged or echoed back in a response header?
2. A hosting dashboard has `INVITES_ENABLED=true` and `AI_TIER=free` in production. What happens at boot, and which promise does that protect?
3. Why does `/health` answer 503 for a database outage instead of 200 with `"db": "down"`, and why is it exempt from the rate limit?

## Phase 4 — Auth

- **4.1 Sessions and passwords.** `sid` cookie holds 32 random bytes, the database stores their SHA-256, expiry slides
  to 30 days at most once a day, `last_seen_at` moves at most once an hour. `requireUser`, `requireRole`,
  `forbidReadOnly` (403 `DEMO_READ_ONLY`) are exported for later phases. Learn: a sliding session that
  writes on every request turns every page view into an UPDATE; compare timestamps first and write only when due.
- **4.2 Login, logout, me.** `POST /auth/login` is rate-limited per IP + email (before validation, so malformed
  attempts count), verifies against a dummy hash when the email is unknown or the account has no password, and
  replaces any session that arrived with the request. `GET /auth/me` returns the user DTO from a Zod schema in
  `packages/shared`, built by an allow-list. Learn: "wrong password" and "no such user" must look identical in the
  body and in the time taken, otherwise login becomes a way to list who has an account.
