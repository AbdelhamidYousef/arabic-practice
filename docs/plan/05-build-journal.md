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
## Phase 3 — AI layer (lane `ai`)
- **3.1 The interface.** `ai/provider.ts`: `LlmProvider` with `generateJson` and `streamText`, request types carrying a `purpose`, and three error classes (rate limited, bad output, failed). Learn: an interface and not an SDK because the SDK's types and network behaviour would spread through every route; with an interface, tests inject a fake and switching vendors touches one file. `createApp(deps)` receives the AI layer instead of importing it (dependency injection), so a test can hand it the fake.
- **3.2 The fake.** Scripted replies chosen by a keyword in the system prompt, a rule-based corrector (missing ال after a demonstrative, gender agreement on a small word list, Latin letters) and fault injection that fires on the next call only. Learn: a fake is only useful if it runs the same Zod parse as the real adapter, so a test against the fake also checks the schema.
- **3.3 The Gemini adapter.** Plain `fetch`, key in the `x-goog-api-key` header (never in the URL, so it cannot reach an access log), `responseJsonSchema` derived from the Zod schema, minimal thinking on Flash-Lite, SSE parsed by hand (`sse.ts`). Learn: SSE framing is `data:` lines with a blank line ending each event, and a network chunk can end mid-line or mid-letter, so the parser buffers and uses a streaming decoder. Our own Zod parse is still needed because the response schema steers the model but guarantees nothing.
- **3.4 Ledger and prices.** Every call writes one `ai_calls` row (tokens, latency, status, cost). Prices are USD per million tokens, which equals micro-USD per token, so cost is a multiplication with no division; the 3.6 and 3.8 Flash prices double on 2027-01-01 and the date rule lives in the table. Learn: integer micro-USD so sums never drift; round up so money is never under-counted.
- **3.5 Budget guard.** Kill switch, turns per user per UTC day (count of `reply` rows), calls per model per day, and the monthly cost on the paid tier; refusals are recorded as `limited` rows that no count includes. Learn: caps are the hard spend limit, and counting rows we wrote beats trusting the provider dashboard because ours is instant, per user and can refuse.
- **3.6 Selection.** `createAiRuntime(env, db, logger)` picks the provider and wraps it (guard over ledger over provider); `makeTestAi()` does the same around the fake. A laptop without a key gets the fake and a loud warning. The default models moved to the Flash-Lite pair and `AI_DAILY_CALLS_GLOBAL` became `AI_DAILY_CALLS_PER_MODEL` (450).
- **Live run (gemini-3.5-flash-lite, today, 4 calls: two accidental runs before the end, one final run, all passing).** `generateJson`: 713 ms, 19 in / 23 out tokens, valid `{arabic, english}` with harakat. `streamText`: 513 ms, 2 chunks, 21 in / 11 out. Note: that stream answered with fatha/damma marks but not on every letter, which is why the reply prompt is blunt about harakat.

### Quiz (phase 3)
1. Why does the gateway's `streamText` wait for the provider's first event before returning, and what would the route have to do differently if it did not?
2. A learner at 59 of 60 turns sends a message and the two calls run in parallel. Which rows exist when each call is checked, and can the learner end up at 61?
3. A call is refused by the budget guard: why is its row excluded from the daily per-model count?

## Phase 5 (steps 5.1, 5.3, 5.4; lane `ai`)
- **5.1 Level rules.** `packages/shared/src/levels.ts`: per CEFR level, sentences per reply, words per sentence, harakat policy, tenses, structures, vocabulary guidance and how explanations are pitched. One table feeds the prompt, the metrics and the evals. Learn: a threshold written twice drifts; written once it is also the test.
- **5.3 Prompts.** Reply (streamed, never corrects, blunt about full harakat at A1–B1), correction (JSON, at most five mistakes, harakat mistakes only when the learner wrote harakat, no style flags on correct sentences) and gloss (English only). Learner text only ever travels in user turns. Learn: two calls because the reply must be fast and human while the correction must be careful and structured; they run in parallel and each can use the cheapest model that does its job.
- **5.4 Level metrics.** `measureReply` returns word, sentence and longest-sentence counts, the harakat ratio, lesson-vocabulary hits (matching through harakat, ta marbuta and attached prefixes), Latin characters, `withinLevel` and the list of violations. Learn: an empty reply is a violation, not a pass, otherwise a broken model looks perfectly on-level.

### Quiz (phase 5, steps 5.1 / 5.3 / 5.4)
1. Why does the harakat ratio threshold for "full" harakat sit well below 1?
2. Where in the reply prompt could a learner's text have changed the rules if it were interpolated, and how does the design prevent it?
3. `وَالْقَهْوَةُ` and the lesson word `قَهْوَة`: which two normalizations make them match, and why must `شَايِّي` not match `شَاي`?

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

## Phase 9 — Progress and review API (lane api2)
- **9.1 Progress API.** One endpoint, seven small aggregate queries run in parallel, weeks bucketed in SQL and
  zero-filled in code. Learn: "per week" needs one definition of a week shared by the database and the code
  (ISO, Monday, UTC), otherwise a Sunday-night turn lands in different buckets on each side.
- **9.3 Review API (Leitner).** `reviewCard` is a pure function (box, counters and due date in, new state out), so
  the schedule is tested without a database; the service only locks the row and writes. Learn: seeding cards with
  `INSERT … SELECT … ON CONFLICT DO NOTHING` makes "create what is missing" safe to call on every visit.

### Quiz (phase 9, API part)
1. Why does the progress endpoint fill empty weeks on the server instead of returning only weeks with data?
2. A learner double-taps "I knew it" on one card. What stops the card from skipping a box, and where is it in the code?
3. Why is the new due date based on the new box and not the old one?

## Phase 10 — Teacher API (lane api2)
- **10.1 Teacher lessons API.** CRUD with the whole lesson as one body; the vocab list is rewritten inside the
  lesson's transaction, `arabic_plain` is computed in code, the slug is derived once and made unique by the index
  with a retry. Learn: "check then insert" for a unique name is a race; let the unique index decide and retry the loser.
- **10.2 Learners, transcripts, invites, usage API.** Four small modules behind one `/teacher` router; every
  query reaches ownership through `users.teacher_id = me`, either directly or by joining to `users`. Invites reuse
  the register code hashing. Usage counts from the `ai_calls` ledger and reads the caps through one function.
  Learn: a join that carries the ownership condition cannot be forgotten, while a separate "check the owner" step can.

### Quiz (phase 10, API part)
1. Why does `forbidReadOnly` run before body validation on every teacher mutation?
2. A teacher deletes a lesson learners have practised. What happens, why was it chosen, and what is the safe alternative?
3. The usage page shows today's calls per model for everyone but per-person turns only for the class. Why the difference?
## Phase 6 — Practice API (lane `ai`, worktree `arabic-practice-ai`)
- **6.1 Conversations.** `POST /conversations` copies the lesson's opening line into the first partner message in one transaction; `GET /conversations/:id` returns the conversation, a small lesson summary and the messages with their corrections and mistakes. Ownership is in the WHERE clause, so a foreign id and a missing id are the same 404. Learn: DTO functions are allow-lists; a column added to a table never reaches the browser until someone adds it on purpose.
- **6.2 + 6.3 The turn stream and what it stores.** `POST /conversations/:id/turns` validates, checks ownership, builds the reply prompt in memory, asks the gateway for the reply stream and waits for its first event, only then saves the learner message and opens the event stream (headers flushed at once). The correction call starts in parallel; its result is saved (correction and mistakes in one transaction) and then sent as `correction`. `done` goes last. Learn: SSE over POST is just a long response with `text/event-stream`; flushing the headers first tells the browser the stream is open before any token exists, and `X-Accel-Buffering: no` tells a buffering proxy (nginx) not to hold the chunks back, otherwise the learner would see nothing until the whole reply is done. Why failure order matters: anything that can be refused (caps, 429) must happen before the status line is sent, because after it only events can carry bad news.
- **6.4 Gloss.** `POST /messages/:id/gloss` for partner messages in my conversations, cached on the row, billed through the gateway as `gloss`. Learn: a cache hit must not need the AI at all, so it works even with the kill switch on.
- **Tests.** A `ScriptedProvider` (a subclass of the fake) adds what the plain fake cannot: a fault on one purpose, a failure after the first delta, a slow correction, a stalled stream. Abort tests use a real socket (`app.listen(0)` and `node:http`), because Supertest waits for the whole response. Learn: a test that closes the connection must wait for the ledger rows, which are written after the abort is noticed.
- **Live run (gemini, one turn on `greetings`, guest, text `انا اسمي سارة و انت?`).** Event order: `learner`, `delta`, `delta`, `correction`, `done`. Headers in 1.12 s (that is also the time to first delta: the gateway waits for the provider's first event before the stream opens); the whole reply (2 deltas, 31 output tokens) was in by then; `correction` and `done` at 5.66 s total, because the correction model (gemini-3.5-flash-lite, JSON) took about 4.5 s: the learner reads the reply while the correction is still coming. Correction: `isCorrect: false`, corrected `أَنَا اسْمِي سَارَةُ، وَأَنْتَ؟`, one mistake `{type: grammar, original: "و انت", correction: "وَأَنْتَ", explanation: "Attach the letter waw directly to the pronoun as وَأَنْتَ."}`. Reply: `أَهْلًا يَا سَارَةُ. اِسْمِي سَلْمَى. كَيْفَ حَالُكِ؟` (usage 689 in / 31 out, 1061 ms). Level metrics: 7 words, 3 sentences, harakat ratio 0.76, 2 lesson words, `withinLevel: false` with violation `too_many_sentences`: a real A1 reply broke the sentence cap, which is exactly what the metrics are for (watch it in the phase 11 evals). Gloss of that reply: "Hi Sarah, my name is Salma. How are you?" in 2.0 s, the second call 4 ms (cache). Live calls used: 1 turn (reply + correction) and 1 gloss.

### Quiz (phase 6)
1. A learner at the daily cap sends a turn. Which status code and body does the client get, and why could the same refusal not be an `error` event?
2. The correction call finishes 3 seconds after the reply. Which events does the client receive in that gap, and when does the server write the partner message?
3. The learner closes the tab right after the first `delta`. Which rows exist afterwards (messages, corrections, ledger) and which call wrote no `ok` row?
## Phase 11 (steps 11.2, 11.3, 11.4; lane `evals`)
- **11.2 Scorer.** `src/evals/score.ts`: per case a verdict check, type recall (some predicted type is accepted), type precision (accepted share of predictions), `mustContain` after `normalizeArabic`, false alarm and detection; aggregates and a per-level table; replies reuse `measureReply`; latency p50/p90 by nearest rank. Empty denominators give `null`, never `NaN`. Learn: a metric needs a defined empty case, otherwise a run with no correct sentences reports a 0% false-alarm rate that means nothing.
- **11.3 Runner and report.** `pnpm eval` calls the provider directly with the app's own prompt builders and model names (no gateway, no database), paced at 4.5 s per model with a 30 s wait and three retries on a busy model; the report is one markdown file with settings, summary, per-level table, every failed case and reply samples. A vitest on the fake covers the runner, scorer and writer, so CI needs no key. Learn: bypassing the gateway also bypasses its caps, so the runner must carry its own pacing, and a quality number must not depend on a busy minute (503 is retried like 429).
- **11.4 First real runs (2026-11-21).** Full run on the app defaults, a correction-only run on `gemini-3.1-flash-lite`, and a ceiling attempt on `gemini-3.6-flash` (18 cases). Numbers are in the decisions log; the reports are in `apps/api/evals/reports/`.

### What the evals show
- **Corrections are strong on clear errors, weak at the edges.** Both Flash-Lite models flag 96% of wrong sentences and 7% of correct ones (one false alarm in 14: `كان الجو باردا أمس`, where the model "fixes" a correct accusative predicate). Everything at B2 passed; the misses sit at A1/A2.
- **Latin letters slip through.** `مساء النور، اسمي John` was called correct by both models, even though the prompt says Latin letters are a `spelling` mistake and one model replied with the name transliterated into Arabic. Expect this to need a code-side check (the app can detect Latin letters itself with `hasLatin`).
- **Harakat mistakes are found but filed as grammar.** `أَنَا طَالِبَةٍ` and `ذَهَبْتُ إِلَى الْمَدْرَسَةُ` were corrected right, but typed `grammar`, not `harakat`, so type recall fails. A case ending is both. Teacher decision needed: accept `grammar` for case endings in the case set, or make the prompt say which type wins.
- **Context can mislead the grader.** With the lesson's opening line passed as the partner message, one model graded `هو تذهب` as a wrong answer to "when do you wake up". The eval leaves that out, the app does not: watch for it in real chats.
- **Wrong-word cases cost mustContain.** `voc-01` (eat vs drink tea) and `prep-01` (`أمام من البنك`) were noticed but the corrected sentence did not contain the expected word (the model rewrote more, or swapped a synonym such as مصرف for بنك).
- **Replies stay short and Arabic-only, but harakat is partial.** 80% within level; the two failures are A1 replies with three sentences against a limit of two. Mean harakat ratio is 0.80 (the threshold is 0.55): marks are present but case endings are often left off the last word (`يَا سَارَة`, `الْمَحَطَّةُ` fine, `هَلْ الطَّقْسُ` with a bare `هَلْ`). No Latin letters in any reply. Lesson words used per reply: 2.1 on average.
- **Availability matters as much as accuracy.** `gemini-3.5-flash-lite` answered 503 "high demand" on about one call in three that day; `gemini-3.1-flash-lite` never did. `gemini-3.6-flash` timed out at the adapter's 20 s limit or returned broken JSON on 11 of 18 calls, because it spends hundreds of tokens thinking: it needs a larger output budget and a longer timeout before it can be a ceiling, and it only has 20 calls a day.
- **The case set is small.** 41 corrections means one case is 2.4 points, so differences under about 5 points are noise (that is why the models tie). The teacher should review the cases, especially the `harakat` ones.

### Quiz (phase 11)
1. Why does `--limit 18` take evenly spaced cases instead of the first 18, and what would the first 18 have hidden?
2. A model returns `isCorrect: true` with an empty mistakes list for a sentence that has a Latin word. Which two numbers in the report move, and which one does not?
3. Why is a 503 retried by the runner but not counted as a case failure, while a schema miss twice in a row is?

## Phase 12: api polish (lane api-polish)

### 12.1 Retry a busy Gemini once (`fix(api): retry a busy Gemini once…`)
- **What/why:** a 503 "high demand" was an `AI_FAILED`. The adapter now waits ~800 ms (+ jitter) and tries once more on 500/503, for JSON calls and for the moment a stream starts. A second failure is `AI_BUSY`. The failed first attempt gets its own ledger row, so the daily cap and the quota view stay honest.
- **Learn:** retry only where it is safe. Before the first byte of a stream a retry is invisible; after it, the learner may already have read half a reply, so the call fails once instead.

### 12.2 One turn at a time per conversation (`fix(api): refuse a second turn…`)
- **What/why:** an atomic `UPDATE … WHERE turn_started_at IS NULL OR older than 90 s RETURNING id` is the lock, kept in the database because serverless instances share nothing else. Released before `done` so a fast client can send the next message at once. Migration 0004 (one nullable column).
- **Learn:** a lock needs an expiry, or one crashed instance would freeze a conversation forever.

### 12.3 Reply level control (`fix(api): tighten the A1/A2 reply prompt…`)
- Reply eval, gemini-3.1-flash-lite, same 10 cases, thresholds unchanged:

| | before | after |
|---|---|---|
| Within level | 80% | 100% (a first prompt version gave 90%) |
| A1 within level | 0% (2 cases) | 100% |
| Mean sentences | 2.5 | 2.1 |
| Mean harakat ratio | 0.80 | 0.80 |
| Lesson words per reply | 2.1 | 1.6 |

- **Honest reading:** the sentence cap is fixed on these cases; 10 cases is small (one A1 case is 50 points), so treat 100% as "no longer failing", not "solved". The harakat ratio did not move (the metric counts marks on all letters, so a few missing case endings barely change it); lesson-word use dipped, within noise. `maxOutputTokens` is now per level (150 at A1 up to 900 at C2).
- **Learn:** telling a model "at most 2" was not enough; telling it what to spend the two on (answer, question) worked. Examples inside the prompt are code too, so a test measures them.

### 12.4 Correction typing (`fix(api): type vowel-mark-only errors "harakat"…`)
- Full correction run, gemini-3.1-flash-lite, same 41 cases (the before is the Phase 11 report for the same model, see git history of the report file):

| | before | after |
|---|---|---|
| Verdict accuracy | 95% | 100% |
| False alarms (correct flagged) | 7% | 0% |
| Detection | 96% | 100% |
| Type recall | 89% | 96% |
| Type precision | 84% | 88% |
| mustContain | 90% | 90% |
| Everything held | 85% | 93% |

- **Honest reading:** har-01 and spell-02 now pass; har-02 (`الْمَدْرَسَةُ` after إِلَى) is still typed grammar, and prep-01 / voc-01 still miss mustContain (synonym swaps, not typing). The false alarm that disappeared (ok-09) was a model wobble, not something the prompt targets: one run each, so differences under ~5 points are noise.
- **Learn:** when two labels overlap (a case ending is grammar and harakat), the prompt has to say which one wins, or the model picks at random.

### 12.5 Reply history check
- The opening line is a model turn after the fixed user marker, and learner text never reaches the system instruction; a prompt test now pins the exact message list.

### Quiz (phase 12)
1. Why is the first failed 503 written to the ledger as its own row, and which two things would be wrong if it were not?
2. Why does the turn guard release the claim before sending `done`, and what does the 90-second expiry protect against?
3. The reply eval went from 80% to 100% on 10 cases. Why is that not proof that the prompt is fixed?
## Phase 8, step 8.3 (chat)
- What: the practice page `/practice/:conversationId` (message list, streaming reply, correction cards with word diff, translate, harakat toggle, composer with the Arabic keyboard, limit and retry errors), the shared `diffWords` helper, strict web schemas for conversations, gloss and turn events.
- Why: the turn stream is the centre of the product, so the rules for its event order live in one pure module (`features/practice/turn.ts`) that is tested without a browser, and the component tests feed a hand-driven stream so they can look at the page between two events.
- Learn: a POST stream cannot use `EventSource`; `fetch` + a reader gives the same events plus an `AbortSignal`, and aborting is how Stop works. A live region that holds streamed text announces every chunk, so the page announces one string, once, when the reply is complete.
## Phases 9 and 10, web (lane screens)
- **Guards and sign-out.** Layout routes wrap the pages, so a route added later is guarded by where it sits. Learn: a guard is a UX rule; the API's 401/403 is the security rule, and both must exist.
- **9.2 Progress.** Bars are plain elements whose width is a percentage; the numbers are also text, so the chart works without sight. Learn: a bar chart is a list with a style attribute, not a library.
- **9.4 Review.** A session is local state (index, revealed, results) over a snapshot of cards; keys 1/2/Space are one window listener that ignores fields and focused buttons, so Space on a focused button is not handled twice. Learn: a global shortcut must say what it leaves alone.
- **10.3 Lesson editor.** Rows carry a local key so typed text follows a row when it moves; validation reuses the API's schema. Learn: index keys would make a moved row keep the wrong text.
- **10.4 Teacher pages.** Tables scroll in their own focusable region; the invite link is shown once from component state because the server keeps only a hash. Learn: "shown once" is a promise the UI has to keep too, so nothing should put the code in the URL or the cache.

### Quiz (phases 9 and 10, web)
1. Why does the review page ignore Space when a button has focus, and what happens to a card's focus after an answer?
2. A teacher fills three vocab rows, leaves a blank one between them, and the English of the third is missing. Which row does the error mark, and which code does that?
3. Where does an invite code live in the browser after "Done" is pressed, and why can it not be listed again?
## Phase 12, steps 12.1 and 12.2 (e2e suite and CI job)
- **12.1 e2e suite.** 13 tests in `e2e/`: guest practice (streaming reply, correction card with the changed word marked, green "Correct" card, Translate), progress and review through to the summary, the demo teacher (seeded learners, transcript, read-only editor, closed-invites notice), a register link with invites off, keyboard-only practice, the 4th turn over a 3-turn cap, the 404 page, and overflow at 390 and 1280 px for every guest, signed-out and demo-teacher route (6 tests). Each test starts its own guest, so nothing depends on order or on an earlier run. Runtime: about 14 to 17 s on a quiet machine (4 workers), 35 to 58 s when the other lanes loaded the CPU (load average 28); the 3 consecutive green runs were 14.7, 13.7 and 14.5 s. Nothing was flaky. Learn: the fake provider is what makes an AI app testable end to end: the same input always gives the same correction, so the test can say exactly which word is highlighted. Learn: an overflow test proves nothing until you have seen it fail, so the checker was run once against an injected 2000 px element.
- **12.2 CI e2e job.** `e2e` runs after `check` and `test`, with a Postgres service, builds the web app, installs Chromium only and uploads `playwright-report/` and `test-results/` on failure. Learn: the job sets no AI key at all, and the API process forces the key empty, so even a mistake in the workflow could not make CI call Gemini.

### Quiz (phase 12, e2e)
1. Why does the e2e API refuse to reuse a server that is already running, and what would a stale one have silently changed?
2. The limits spec needs a guest cap of 3, yet every other spec runs on the same API. What keeps them from tripping the cap?
3. The overflow check ignores an element that sticks out inside its own scroll container. Which element on the teacher pages relies on that, and why is it not a bug?

## Phase 12: security hardening (lane hardening)
- **Gloss cap, conversation cap.** Two more per-user counters beside the turn cap, one per billed or row-creating action. Learn: a shared pool needs a per-person fence for every action that draws on it, not just the main one.
- **Guest limit in the database.** The hashed IP sits on the guest row; an advisory lock serialises count-then-insert. Learn: in-memory state on a serverless host belongs to one instance, so a limit must be counted where all instances look; and hash an IP with a secret key, because the IPv4 space is small enough to brute-force a plain hash.
- **Reserve, then call.** The guard inserts a `pending` row inside a locked transaction and the ledger settles it. Learn: "check, then do" is a race unless the check and the claim are one atomic step; Postgres cannot use a new enum value in the transaction that adds it, so a migration only adds it.
- **Login IP limiter.** A second limiter in front, keyed by IP alone. Learn: a key that includes the victim's input (the email) limits attacks on one account, not a machine that tries every account.
- **Scrubbed logs.** One function removes parameters from an error and its causes; the first test failed because pino-http brings its own error serializer. Learn: a logger setting is only a default, so test the real path an error takes into the log.
- **Boot refusal on Vercel.** VERCEL set with NODE_ENV not production fails validation. Learn: safety rules keyed on one variable need a second variable that detects the variable being wrong.
- **Security headers.** The CSP was proven against the real build in a browser instead of guessed. Learn: a CSP that breaks the page is found in the console, not by reading the policy.
- **Read-only review, health cache.** `forbidReadOnly` on the answer route and no card creation on read; the health probe is reused for 5 s. Learn: a GET that writes is a write for access-control purposes.

### Quiz (phase 12, hardening)
1. Two parallel requests each see 9 conversations used of 10. Which two things stop both from creating the tenth, and which of the two protects the AI calls?
2. Why is a plain SHA-256 of an IPv4 address nearly as bad as storing the address, and what does the key change?
3. Why does the migration that adds `pending` not also use it, and what would happen if it did?

## Phase 13: deploy and README (lead session)

### 13.1–13.4: GitHub, Gemini key, Neon, Vercel, live check
The repo went public early (after phase 2) and Vercel was set up before the features were finished, so
the riskiest platform question was answered while there was time to react: does a Server-Sent Events
stream survive a Vercel Function? It does. A real turn on production sent the first words after about
1.1 s and the correction at 2.6 s, event by event. Three surprises:
- `arabic-practice.vercel.app` belongs to someone else, so Vercel named ours `arabic-practice-phi`. The
  first `WEB_ORIGIN` was wrong, and the Origin check would have refused every sign-in. Checking the real
  alias, then fixing one env var, solved it.
- Vercel's GitHub app could only see Pawsome's repo. Adding this one needed GitHub's "sudo mode", which is
  an emailed code.
- The Gemini free tier is counted **per model**: Flash allows 20 calls a day, which is useless for an app,
  while each Flash-Lite model allows 500.

Learn: deploy the empty app early. The bugs a platform causes (domains, origins, streaming, secrets)
don't depend on features, and they're cheaper to find before there are any.

### 13.5: README
The README is the case study: the problem, the level-control approach, the evals with an honest caveat
(the prompts were tuned on the same cases), cost numbers, privacy rules, architecture and setup.

### Quiz: Phase 13
1. Why did the first deploy answer every sign-in with 403, although the health check was green?
2. The free tier allows 500 calls a day per Flash-Lite model. Why does running correction and reply on
   one model halve the number of practice turns a day, and what is the trade-off for splitting them?
3. Why must a migration run on Neon before the push that needs it, and with which of the two URLs?

## Phase 16: course data model and API (lead session)

### 16.1: the A0 level
A new level goes in first, so every table that maps levels needed a row (reply token budgets, the
AI level rules, eval scoring). One shared list now feeds the database enum, the Zod schema and the
evals, so the compiler found most places for us. Learn: when a value list is written in six places,
the one place you forgot is the bug; derive them from one constant (`CEFR_LEVELS`) and let types
complain. The enum value itself needed its own migration, as in phase 12.

### 16.2: units, sections and exercises
A lesson is now words, exercises, a grammar note, a culture tip and the AI chat. Exercises are one Zod
discriminated union (`choose`, `match`, `build`, `gap`, `listen`) stored as jsonb with the type
repeated in a column. Learn: put data that is always read whole (an exercise) in one jsonb document,
and keep the columns you filter on (`type`, `position`) as real columns; a discriminated union gives
the web a type that narrows on `type`.

### 16.3: progress, XP and streaks
XP is paid only the first time a step is completed, decided by an insert that does nothing on
conflict. The streak is counted from the learner's local date, which the browser sends and the server
accepts only within a day of its own UTC date. Learn: "was this the first time?" must be answered by the
database in the same statement that records it, or two quick taps pay twice; and a client-supplied
date is only safe when its range is clamped.

### 16.4: endpoints
`GET /course` builds the path (levels, units, lessons, next up, stats); the progress route sits behind
the read-only guard. The lesson detail gained its sections. Answers ship to the browser on purpose.
Learn: a new required field in a shared response schema breaks every test fixture that builds the old
shape, which is the schema doing its job.

### 16.5: content files and the validator
Lessons are typed files, not rows typed into a form; a pure validator lists every problem (Latin letters
in Arabic, missing harakat, an answer index that points nowhere) and runs before the seed writes.
Learn: content is code that needs tests; make the checks pure so they run in milliseconds, and make
the seed idempotent in the way the data demands (words keep their ids because review cards point at them).

### Quiz: Phase 16
1. Two parallel requests post the same finished step. Which statement makes sure only one is paid XP,
   and why is a select followed by an insert not enough?
2. Why does the server accept the learner's local date only within one day of its own UTC date, and
   what could someone do if it accepted any date?
3. Why does the seed upsert a lesson's words by their plain form but delete and re-insert its exercises?


## Phase 17: lesson player and course path

### 17.1: the course path
`/lessons` is now the course: stats, level tabs, units and lessons with their state. The API was asked
for two more fields (`steps`, `finished`) instead of guessing in the browser whether a lesson has a
grammar note. Learn: when the UI needs a rule the server already applies (what "finished" means), send
the answer, not the ingredients; two copies of a rule drift apart.

### 17.2: the hub and the words step
A course lesson's page lists its steps; the player is one route with the step in the URL, so the
browser's back button and a reload both work, and the component stays mounted between steps (XP adds
up for the finish screen). The flashcard is a real button with a live region for the back side.
Learn: a route `handle` lets the layout react to the page (here: no header in the player) without the
page reaching up into the layout.

### 17.3: the exercise player
Five exercise types share a small vocabulary: a fieldset of radios (choose, listen, gap), tiles
(build), pairs (match), and one feedback line. Options are shuffled with a seeded generator, and the
answer is compared by index into the original list. Learn: randomness in a UI should be a function
of a seed, or re-renders reshuffle under the learner's finger and tests cannot predict anything.

### 17.4: grammar, culture, talk and finish
Mixed English and Arabic text is split into runs, each Arabic run getting lang/dir and the Arabic font.
The talk step is recorded from the chat after the first finished reply. While checking the pages in a
browser, every `Card className="p-5"` turned out to be 24 px: `cn` joins classes and Tailwind's CSS
order decides, so `p-6` always won. Learn: class order in the attribute means nothing; the stylesheet
order does. Measure computed styles when a spacing looks off.

### 17.5: progress and the teacher view
The progress page puts streak, XP and lessons per level above the conversation stats; the teacher
lesson page shows the course parts read-only with a note that the content files win.
Learn: a read-only view of data another system owns should say who owns it.

### Quiz: Phase 17
1. Why does the exercise player compare the learner's pick by its index into the original `options`
   array, and what would break if it compared positions on screen instead?
2. The words step lets Space flip the card from anywhere on the page instead of focusing the card
   after each navigation. What in the layout made autofocus unreliable?
3. Why is `finished` computed by the API and not in the browser from `stepsDone`?

## Phase 23: ops and reliability

### 23.1: migrate on production builds
The Vercel build now ends with `db:migrate:deploy`. It runs only when `VERCEL_ENV=production`, uses
Neon's direct URL (`DATABASE_URL_MIGRATE`, added to the Vercel project), and fails the build when
that URL is missing. It sits after the builds, so a broken build never touches the database, and
before promotion, so new code never runs on an old schema.
Learn: migrations through a connection pooler fail in strange ways: drizzle takes an advisory lock and
runs DDL in one transaction, and PgBouncer in transaction mode hands each statement to whatever
server connection is free. Migrate over the direct URL; serve traffic over the pooled one.

### 23.2: uptime check
A scheduled workflow probes `/api/v1/health` every 30 minutes and keeps one `uptime` issue open
while the app is down. The first live probe after a quiet spell answered `db: down` and the second, 3 s
later, `ok`: that's Neon's free compute waking up. So the check tries three times before it
raises an alarm.
Learn: a monitor that cries wolf gets muted. Measure what "normal slow" looks like before choosing
what counts as down.

### 23.4: weekly backup
Neon's free plan restores only 6 hours back. A weekly workflow dumps the database with the
Postgres 18 image (pg_dump must be at least the server's version), encrypts it with a passphrase
and keeps it as a 7-day artifact. Until the two secrets are set it skips with a notice.
Learn: a backup you have never restored is a hope. The restore commands sit at the top of the workflow file.
