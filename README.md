# Arabic Practice

An AI conversation partner for learners of **Modern Standard Arabic** that stays at the learner's
level, corrects every message with a short explanation, and is built around a teacher's own lessons.

**Live demo:** https://arabic-practice-phi.vercel.app. Try it as a guest learner, or open the
read-only teacher view. No sign-up needed.

> Practice chats on the demo go through Google's Gemini **free tier**, which may use them to improve
> Google's products, so please don't type personal information. Real students only ever use a paid tier
> (the app refuses to open invite sign-up while it runs on the free tier).

## The problem

Learners need speaking practice between lessons, and a general chatbot is a poor partner for that:

- it answers a beginner in long, unvowelled, advanced Arabic;
- it rewrites the learner's sentence without saying what was wrong;
- it knows nothing about the lesson.

A teacher wants practice that uses this week's vocabulary, at this learner's level, and wants to see
the mistakes afterwards.

## What it does

- **Lessons, written by the teacher.** Each lesson has a topic, a CEFR level (A1 → C2), goals, a
  grammar focus, a vocabulary list with full harakat, and a short scenario for the AI partner ("you are
  a café waiter…").
- **Practice chat.** The learner writes in Arabic (there is an on-screen keyboard with the harakat).
  The partner's reply **streams** in, held to the lesson's level and vocabulary. Each learner message
  gets a **structured correction**:
  - the corrected sentence with the changed words highlighted;
  - each mistake typed as grammar, vocabulary, harakat, spelling, word order or register;
  - a one- or two-sentence explanation in English.

  Partner messages translate on demand, and harakat can be hidden.
- **Progress.** Mistakes by type, mistakes per turn by week, and the recent mistakes with their
  explanations.
- **Review.** Lesson vocabulary becomes spaced-repetition cards (Leitner boxes: 1, 2, 4, 8, 16 days).
- **Teacher area.**
  - Lessons editor.
  - Each learner's level, mistake profile and transcripts.
  - Invite links.
  - An AI usage page: calls, tokens and cost per day, against the caps.

## The hard part: keeping a model at the learner's level

1. **Level rules as data.** `packages/shared/src/levels.ts` describes each CEFR level as rules the
   partner must follow: maximum sentences per reply, maximum words per sentence, how much harakat,
   which tenses and structures. The same rules feed the prompt **and** measure the answer.
2. **Two calls per turn, in parallel.**
   - **Reply:** plain Arabic, streamed. It is told never to correct, so it never lectures.
   - **Correction:** strict JSON, never shown until it parses.

   They run on cheap, fast models and either can fail without taking the other down.
3. **Structured output you can trust.**
   - Gemini gets a JSON Schema (generated from the Zod schema with `z.toJSONSchema`).
   - The answer is parsed with Zod again on our side.
   - A miss gets one retry, then the user sees a clean "couldn't check this message".
4. **Measured, not assumed.** Every partner reply is scored against the level rules (sentences, words,
   harakat ratio, Latin letters, lesson words used) and the result is stored with the message.
5. **Learner text never touches the instructions.** It only ever appears in user turns, never in the
   system prompt, so a learner can at most derail their own chat.

## Evals

`apps/api/evals/cases.json` holds 41 made-up learner sentences, A1 to B2. They are correct sentences
and sentences with known mistakes (gender agreement, numbers, case endings, verb moods, relative
pronouns, wrong words, word order, spelling, harakat, dialect words), plus 10 reply prompts.
`pnpm eval` runs them against a real model through the app's own prompts and writes a report to
`apps/api/evals/reports/`. CI runs the same runner on a fake provider to test the scorer.

| Corrector (2026-11-21) | Right verdict | False alarms | Mistakes found | Type recall | Expected fix present |
| --- | --- | --- | --- | --- | --- |
| gemini-3.5-flash-lite, first prompt | 95% | 7% | 96% | 89% | 90% |
| gemini-3.1-flash-lite, first prompt | 95% | 7% | 96% | 89% | 90% |
| gemini-3.1-flash-lite, tuned prompt | 100% | 0% | 100% | 96% | 90% |

Replies within the level rules went from 80% to 100% after the A1/A2 prompt was tightened. The
failures were 3 sentences where 2 are allowed.

**Read these numbers honestly.** The prompt was tuned on the same 41 cases, so the last row is
optimistic. With 41 cases, one case is 2.4 points. A held-out case set, written by the teacher, is the
next step. The eval also showed what the models still get wrong: final-letter harakat on replies, and
a synonym where the expected word was a different one.

## Cost control

- **One provider interface.** `LlmProvider` in `apps/api/src/ai/provider.ts` has two methods
  (`generateJson`, `streamText`). Adapters: `fake` (tests, never a network call) and `gemini` (plain
  `fetch` to the REST API with SSE, no SDK). A Claude adapter would be one more file.
- **Every call is a row.** `ai_calls` stores purpose, model, tokens in and out, latency, status and cost.
  The caps count our own rows before any call goes out:
  - turns per learner per day (guests 20, learners 60);
  - calls per model per day (under the free quota of 500);
  - a monthly budget in dollars on the paid tier;
  - a kill switch.
- **Numbers.** A turn costs about 1,500 tokens in and 175 out (two calls). On the free tier it costs
  nothing. On the paid tier with gemini-3.5-flash-lite ($0.30 / $2.50 per million tokens) it costs about
  **$0.0009**, so 4,000 turns a month is about **$3.60**. Translations are on demand, not in every reply,
  which saves roughly half the output tokens.
- **Busy model.** A 503 or "high demand" answer is retried once and then shown as "busy, try again"
  instead of an error. A conversation runs one turn at a time (`409 TURN_IN_PROGRESS`).

## Architecture

```
Browser (React SPA) ── same origin ──▶ Vercel
  │  fetch + ReadableStream (SSE over POST)      ├─ static web (Vite build)
  │                                               └─ /api/* → Express 5 as one Vercel Function (fra1)
  ▼                                                     ├─ auth: cookie sessions (hashed ids), argon2id
TanStack Query cache                                    ├─ modules: lessons, practice, progress, review, teacher
                                                        ├─ ai/: provider ▸ usage ledger ▸ budget guard
                                                        ▼
                                             Neon Postgres (Frankfurt)      Gemini REST API (free tier)
```

- **Monorepo** (pnpm): `apps/web`, `apps/api`, `packages/shared` (Zod schemas used by both sides,
  CEFR level rules, Arabic text helpers).
- **Web:** React 18, TypeScript, Vite, React Router, TanStack Query, Tailwind, Inter and Noto Naskh
  Arabic.
- **API:** Express 5, Zod, Drizzle ORM with SQL migrations, Pino.
- **Arabic text:** `normalizeArabic` folds harakat, tatweel, alef forms, alef maqsura and ta marbuta,
  so matching works whether or not the learner writes vowels. Every Arabic string renders inside
  `lang="ar" dir="rtl"`.

## Privacy and the free tier

- No real student data in this repository, ever: seed, test and eval data are made up.
- On the free tier, Google may use prompts to improve its products. So the public demo is anonymous
  guests only, with a notice. Invite sign-up for real students refuses to switch on while
  `AI_TIER=free` (checked when the app starts).
- Guests and their chats are deleted 7 days after their last visit.

## Tests and CI

- **Unit and integration:** Vitest; Supertest against a real Postgres, with tables emptied by DELETE
  in foreign-key order. That is milliseconds per test, which matters with hundreds of them.
- **End to end:** Playwright against the production build:
  - guest practice
  - corrections
  - progress and review
  - the read-only teacher
  - keyboard-only use
  - no horizontal overflow at 390 and 1280 px on every route
- **Live provider tests** (`pnpm --filter @arabic/api test:live`) run only with a key and skip loudly
  otherwise.
- **GitHub Actions:** typecheck, lint, format, tests, e2e and a gitleaks scan of the whole history.

## Run it locally

Needs Node 22 (`.nvmrc`), pnpm (via `corepack enable`) and Docker.

```sh
cp .env.example .env      # every variable is documented inside; no key needed (the fake provider answers)
pnpm install
docker compose up -d      # Postgres on 127.0.0.1:5434
pnpm db:reset             # migrate and seed (66 course lessons, a made-up class)
pnpm dev                  # api on :3002, web on :5175
```

Add a free Gemini key from Google AI Studio as `GEMINI_API_KEY` to talk to a real model.

Checks before every commit:

```sh
pnpm typecheck && pnpm lint && pnpm format:check
pnpm -r --workspace-concurrency=1 test
pnpm e2e
```

Local logins after `pnpm db:reset` (made-up, local only): `teacher@arabic-practice.test` with the
password from `SEED_TEACHER_PASSWORD` (default `Teacher-demo-1!`), and the read-only demo teacher.

## What's next

- A held-out eval set written by the teacher, and a Claude Haiku adapter compared on it.
- A paid tier for real students, with a hard monthly cap.
- Homework review (a paragraph, fully corrected) and a weekly mistake summary for the teacher.
- Dialects (Egyptian, Levantine) as a lesson setting, with their own eval cases.
- Voice.

The build plan, decisions log and build journal are in [`docs/plan/`](docs/plan/).
