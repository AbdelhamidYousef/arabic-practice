# Plan 00 — Overview, decisions, open questions

_Written 2026-11-21 by the planning session. This is the master plan. Each phase has its own file
(`phase-NN-*.md`). Build phases in order; each step inside a phase is one small, reviewable commit.
The owner went offline after the brief's questions and asked for an unattended build to a deployed
app; every call made on his behalf is tagged REVIEW in `04-decisions-log.md`._

## What we are building (one paragraph)

**Arabic Practice** (codename `arabic-practice`): a learner practises **Modern Standard Arabic**
between lessons with an AI conversation partner that stays at their level. The teacher (the owner)
writes lessons: a topic, a CEFR level (A1 → C2), goals, a grammar focus, a vocabulary list with full
harakat, and a short scenario for the AI partner. The learner opens a lesson and chats in Arabic.
Every message gets a **structured correction**: the corrected sentence and each mistake with its type
(grammar, vocabulary, harakat, spelling, word order, register) and a one- or two-sentence English
explanation. The partner's reply **streams** in, kept to the lesson's level and vocabulary. Mistakes
are stored, so the learner sees their patterns and the teacher sees each learner's. Lesson vocabulary
becomes spaced-repetition cards. A small **eval set** of graded learner sentences measures how well a
model corrects and whether its replies stay at the level, so a model choice is a number, not a feeling.

The hard part, and the case study: keeping the model at the learner's level, making corrections
reliable as structured data, and controlling cost (caps, usage accounting, a provider interface that
makes switching models a config change).

## Stack (fixed by the brief) and the concrete choices inside it

Same as Pawsome unless the row says otherwise; the reasons are in Pawsome's overview.

| Layer | Choice | Why |
| --- | --- | --- |
| Monorepo | pnpm workspaces: `apps/web`, `apps/api`, `packages/shared` | Shared Zod schemas on both sides; Pawsome's setup reused. |
| Front end | React 18 + TS, Vite (SWC), React Router 6, TanStack Query, Tailwind 3 | As Pawsome. |
| Back end | Node 22 + TS, Express 5, Zod, Pino | As Pawsome. |
| DB | Postgres 16 (Docker locally, Neon in prod), Drizzle ORM + SQL migrations | As Pawsome. |
| Auth | Own cookie sessions (hashed ids in Postgres), argon2id, Origin check | As Pawsome. Plus guest learners and a read-only demo teacher. |
| LLM | **One `LlmProvider` interface**; adapters: `fake` (tests), `gemini` (free tier now). Plain `fetch` to the Gemini REST API, no SDK | The HTTP API (SSE, JSON schema) is what to understand; an SDK would hide it. A Claude adapter is one file later. |
| Streaming | Server-Sent Events over a `fetch` POST, read with `ReadableStream` on the web | One-way stream, plain HTTP, works through Vercel Functions. |
| Structured output | Gemini `responseMimeType: application/json` + `responseSchema`, then Zod-parsed again on our side | Never trust the model's JSON; one retry, then a clean error. |
| Fonts | `@fontsource-variable/inter` (UI), `@fontsource/noto-naskh-arabic` (Arabic) | Self-hosted, no Google Fonts request; Naskh keeps harakat legible. |
| Testing | Vitest (unit), Supertest + real Postgres (integration), Playwright (e2e), GitHub Actions | As Pawsome; the fake provider means no test hits an API. |
| Hosting | One Vercel project (static web + Express as a Function, same origin), Neon free | Pawsome's final setup. No card anywhere. |

Not to be added without asking: Next.js, Prisma, auth SaaS, Redux, component libraries, LangChain or
any LLM framework, a vector database, the Google/Anthropic SDKs.

## Non-negotiables (restated as checks)

- **He understands every part.** Each step has "Learn / explain"; the journal has a quiz per phase.
- **One proper build.** No throwaway v1.
- **No secrets in the repo.** `.env` ignored; `.env.example` documents every variable. Keys never reach the browser: every AI call is server-side.
- **Free by default.** Gemini free tier for development and the public demo. Paid spend only on his OK,
  with a hard monthly cap in config and per-user daily caps in the app.
- **Free-tier privacy.** Google may use free-tier prompts, so only made-up chats go through it:
  - the public demo shows a "don't type personal information" notice,
  - **invite sign-up (real students) cannot be switched on while `AI_TIER=free`**: env validation refuses it.
- **No real student data in the repo, ever.** Seed and test data are made up.
- **Git:** one step = one local commit. Pushing and deploying were approved by him on 2026-11-21 for this build ("log into GitHub… log to the host and upload the project").

## Scope: in, stretch, out

**In:**
- accounts: invite sign-up, login, guest learner ("Try it"), read-only demo teacher
- lessons authored by the teacher
- practice chat:
  - streamed replies held to the level
  - structured corrections
  - on-demand English gloss
  - harakat show/hide
  - an on-screen Arabic keyboard
- mistakes tracking and a progress page
- spaced-repetition vocabulary review
- teacher area: lessons CRUD, learners, transcripts, mistakes, AI usage
- AI cost control: caps, usage table, kill switch
- eval set with a runner and a scorer
- three test layers, CI, deployed demo, and a README that reads as a case study

**Stretch (after everything above, in this order):** homework review (learner pastes a paragraph, gets
a full correction); weekly mistake summary for the teacher; Claude Haiku adapter + eval comparison
(needs his OK for a paid key).

**Out:** dialects (his call 2026-11-21: MSA only for now; `dialect` is not modelled yet); voice; mobile apps; payments.

## Environments

| Env | Web | API | DB | LLM |
| --- | --- | --- | --- | --- |
| local | `http://localhost:5175` (Vite, proxies `/api`) | `http://localhost:3002` | Docker Postgres `localhost:5434` | `gemini` if `GEMINI_API_KEY` set, else `fake` |
| test / CI | e2e: `vite preview` on 5275 | 3102, `NODE_ENV=test` | `arabic_test` / CI service | `fake` only |
| prod demo | Vercel | Vercel Function, same origin | Neon | `gemini`, free tier |

Ports are Pawsome's + 2 so all three projects run at once.

## Repository layout (target)

```
arabic-practice/
  .github/workflows/ci.yml      # check, test, e2e, gitleaks
  .env.example  .nvmrc  package.json  pnpm-workspace.yaml  tsconfig*.json
  docker-compose.yml            # postgres (fsync off, local only)
  playwright.config.ts  e2e/
  apps/
    api/
      src/
        app.ts index.ts vercel.ts config/env.ts
        db/{client.ts,schema/,migrations/,seed/}
        ai/{provider.ts,fake.ts,gemini.ts,budget.ts,usage.ts,prompts/}
        modules/{auth,lessons,practice,progress,review,teacher}/
        middleware/ lib/ test/
      evals/{cases.json,reports/}   src/evals/{run.ts,score.ts}
    web/
      api/index.js              # Vercel Function entry (re-exports apps/api/dist/vercel.js)
      vercel.json
      src/{main.tsx,routes.tsx,api/,components/,features/,i18n/,lib/,styles/}
  packages/shared/src/          # zod schemas, CEFR levels, arabic text helpers, error codes
```

## Phase index

| # | Phase | File |
| --- | --- | --- |
| 0 | Repo bootstrap, tooling, gates, CI | `phase-00-bootstrap.md` |
| 1 | Database schema, migrations, test harness, seed | `phase-01-database.md` |
| 2 | API foundation (env, errors, logging, health, security middleware) | `phase-02-api-foundation.md` |
| 3 | AI layer (provider interface, fake, Gemini adapter, usage, budget) | `phase-03-ai-layer.md` |
| 4 | Auth (sessions, invite sign-up, guest, demo teacher) | `phase-04-auth.md` |
| 5 | Lessons API and the level-aware prompts | `phase-05-lessons-prompts.md` |
| 6 | Practice API (turns, corrections, streaming, gloss) | `phase-06-practice-api.md` |
| 7 | Web foundation (design system, layout, API client, i18n, Arabic text) | `phase-07-web-foundation.md` |
| 8 | Learner UI (auth, lessons, practice chat) | `phase-08-learner-ui.md` |
| 9 | Progress and vocabulary review | `phase-09-progress-review.md` |
| 10 | Teacher area | `phase-10-teacher.md` |
| 11 | Evals | `phase-11-evals.md` |
| 12 | Hardening: e2e, QA sweep, security review, CI complete | `phase-12-hardening.md` |
| 13 | Deploy and README case study | `phase-13-deploy-readme.md` |

Supporting docs: `01-data-model.md`, `02-api-contract.md`, `03-conventions.md`, `04-decisions-log.md`
(grouped by phase, REVIEW-tagged), `05-build-journal.md` (learn notes + quiz per phase),
`06-handover.md` (current state, waiting on him).

## Open questions from the brief: answers

1. **LLM provider:** his call: Gemini free tier first, one interface, paid only on his OK.
2. **Dialect:** his call (2026-11-21): **MSA only**, no dialect modelling for now.
3. **Teacher side in v1:** REVIEW: **yes**. Lessons are the point of the brief ("built around real
   lessons"), and the teacher view of each learner's mistakes is the feature a tutor would pay for.
   Kept small: lessons CRUD, learners, transcripts, usage.
4. **Public demo:** REVIEW: **no open sign-up.** The landing page offers "Try it as a learner" (an
   anonymous guest account with tight daily caps, its own data, removed after 7 days) and "See the
   teacher view" (a read-only demo teacher whose class is made-up learners). Real students join by
   invite link, which only works on the paid tier. Open sign-up would invite abuse of the free quota
   and real personal data into free-tier prompts.

## Part 2 (2026-11-21)
Phases 14–19 turn the chat demo into a course app: see `07-course-plan.md`.
