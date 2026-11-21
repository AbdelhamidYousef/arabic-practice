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
- **4.3 Guest learners.** `POST /auth/guest` creates `Guest XXXX` (4 hex) on the demo teacher at A1, signs in, and
  deletes up to 200 guests unseen for 7 days in the same request; per-IP limit of 10 an hour. A missing demo
  teacher answers 503 `DEMO_UNAVAILABLE`. Learn: cleanup without a scheduler is "whoever arrives next sweeps", so
  it must be bounded or one unlucky visitor pays for everyone.
- **4.4 Invites and registration.** Invite codes are 16 random bytes in base64url, stored as SHA-256. Register claims a
  use with one `UPDATE ... WHERE used_count < max_uses AND expires_at > now() RETURNING` inside the same
  transaction that inserts the user, so a duplicate email rolls the use back and four parallel sign-ups for the last
  use produce exactly one account. Closed (the default) is 403 `INVITES_CLOSED`. Learn: "check then update" races;
  a conditional UPDATE lets the database decide who got the last seat.
- **4.5 Demo teacher.** `POST /auth/demo-teacher` signs a visitor into the seeded teacher (per-IP limit). It refuses
  with 503 if that row is missing, not a teacher or no longer read-only, so a public button can never open a writable
  account. `forbidReadOnly` (403 `DEMO_READ_ONLY`) is tested on an example route and must go on every teacher
  mutation in phase 10. Learn: a public sign-in endpoint is a privilege escalation if the account it points at can
  change; check the property you rely on every time, not once at seed time.

### Quiz (phase 4)
1. Why does the database store the SHA-256 of the session id, and why is a fast hash enough here when passwords need argon2?
2. Two people use the last use of an invite at the same moment. Which single statement decides who wins, and what happens to the loser's use count if their email is already taken?
3. Why does login verify against a dummy hash when the email is unknown, and what would an attacker learn without it?

## Phase 5 (lane auth) — Lessons API
- **5.2 Learner lessons API.** `GET /lessons` lists the published lessons of my teacher grouped by level with my
  conversation count (a LEFT JOIN whose condition holds both the lesson and my user id, so lessons nobody has
  practised show 0 and other learners' conversations never count). `GET /lessons/:slug` adds the vocabulary in
  position order and my five latest conversations. Missing, draft and other teachers' lessons are one 404.
  Learn: put a filter on the joined table in the JOIN condition, not the WHERE, or the LEFT JOIN quietly becomes
  an INNER JOIN and untouched lessons vanish from the list.
## Phase 7 — Web foundation (lane web)

- **7.1 Tokens and fonts.** `styles/tokens.css` holds every colour, radius, shadow, font and weight as a CSS
  variable; Tailwind only points at them. The contrast test parses the CSS file itself, so it checks what ships.
  Learn: AA means 4.5:1 for normal text. Amber is too light to be text on sand, so correction text uses a dark
  amber (`accent-strong`) and the bright amber is only ever a fill behind ink text.
- **7.2 UI kit.** Button, Input, Textarea, Card, Badge, Alert, Spinner, Dialog (native `<dialog>`), Tabs,
  EmptyState and `ArabicText`. Learn: `lang="ar" dir="rtl"` is not decoration; it tells screen readers which
  voice to use and keeps punctuation on the correct side. The tall line-height (2) exists so the marks above
  and below a line do not touch the next one.
- **7.3 Dictionary.** Typed keys from the English object, `t()` for strings and `tn()` for plurals through
  `Intl.PluralRules`. A guard test fails on English written into JSX, including text Prettier wraps onto its own
  line, and tests its own matcher. Learn: a guard that cannot be shown to fail is not a guard.
- **7.4 API client, auth state, SSE.** One `apiFetch` with credentials, typed errors and Zod-parsed responses;
  `['me']` treats a 401 as "anonymous"; a 401 while signed in clears every other cache. `readSse` rebuilds events
  from a byte stream that may be cut anywhere, tested by splitting at every position and one byte at a time.
  Learn: chunk boundaries are arbitrary; a parser that works only when each chunk is one event works until production.
- **7.5 Layout and routes.** One route table with a lazy chunk per page, role-aware header, honest footer line,
  skip link, focus moved to `<main>` on navigation, a "server is waking up" notice and a 404. Learn: after a
  client-side navigation nothing tells a screen reader the page changed unless focus moves.

### Quiz (phase 7)
1. Why is the contrast test fed by `tokens.css` itself rather than a copy of the colours inside the test?
2. A network chunk ends between the `\r` and `\n` of a line ending. What does `readSse` do, and why?
3. Why does a 401 from `/auth/me` become `null` while a 401 from any other call, for a signed-in person, clears the caches?

## Phase 8 (lane learner-ui: steps 8.1, 8.2, 8.4)

### 8.1 Landing, login, invite registration
What/why: landing with the pitch, an illustrated example turn built from the real components (Badge, Card, ArabicText) and three actions; login and register forms validated with the shared Zod schemas before any request. Signed-in visitors skip the landing.
Learn: validating in the browser with the same schema the server uses gives instant feedback and can never disagree about the rules.

### 8.2 Lessons
What/why: list grouped by level, lesson page with a harakat toggle that only changes how `ArabicText` renders (`hideHarakat`), and a start button that creates the conversation then navigates. `LoadState` is the one place for loading, error and 401 handling.
Learn: a card that is one big click target is a normal link whose `::after` covers the card, so it stays a real link for keyboards and screen readers.

### 8.4 Arabic keyboard
What/why: a standalone component that types into any field ref, not wired to a chat yet. Every key is a button; marks are named by English labels.
Learn: setting a field's value from code does not tell React; writing with `setRangeText` and firing an `input` event does, so the controlled state stays in sync.

### Quiz (phase 8, steps 8.1-8.4 so far)
1. Why does the keyboard dispatch an `input` event after changing the textarea?
2. Why does the register page call the invite lookup before showing the form?
3. What stops a keyboard key press from taking focus away from the textarea on a phone?
