# Plan 06 — Handover

Written by the build sessions for the owner and the next session. Newest state first.

## Current state
- 2026-11-21: plan written (00–03, phases 0–13).
- 2026-11-21: **phase 0 done** (bootstrap). Gates green: typecheck, lint, format; tests shared 4,
  api 2, web 2. Postgres runs from `docker compose up -d` on 127.0.0.1:5434. Nothing pushed.

- 2026-11-21: **phase 1 done** (database). Migrations 0000 to 0003 (11 tables), test harness (DELETE in FK
  order, ~ms per test), seed (12 lessons, 134 vocab items, 4 made-up learners, 8 conversations). Gates green:
  typecheck, lint, format; tests shared 40, api 103, web 2. `pnpm db:reset` rebuilds the local database in
  about a second. Nothing pushed.

- 2026-11-21: **phase 2 done** (API foundation). `createApp({ config, db, logger, ai })`, error envelope,
  request ids and redacting logger, helmet, 16 kB JSON limit, Origin check, rate limits, health with a DB
  ping and the AI status, production env rules (each tested). Gates green: typecheck, lint, format; tests
  shared 40, api 175, web 2. Phases 0 to 2 built; nothing pushed; Postgres container left running on 5434.

- 2026-11-21: **pushed** to https://github.com/AbdelhamidYousef/arabic-practice (public); CI green (check,
  test, gitleaks). Gemini key on his personal Google (AI Studio project `arabic-practice`, free tier); Neon
  project `arabic-practice` (`super-violet-75591213`, Frankfurt). Keys and URLs live only in `.env` and the
  untracked `work/` folder. Eval case set written (41 corrections, 10 replies).
- 2026-11-21: **wave 1 running** in three worktrees: lane `ai` (phase 3 + 5.1/5.3/5.4), lane `auth`
  (phase 4 + 5.2), lane `web` (phase 7). Merge order ai, auth, web.

- 2026-11-21: **wave 2 merged**: practice turn stream (phase 6), progress/review/teacher APIs (9.1, 9.3,
  10.1, 10.2), evals (phase 11, 3 reports), chat UI (8.3 + keyboard), learner and teacher screens (9.2, 9.4,
  10.3, 10.4), API polish (503 retry, one turn at a time per conversation, tighter A1/A2 reply prompt,
  correction typing). Gates green: shared 54, api 497, web 220. Migration 0004 applied on Neon.
- 2026-11-21: **live** at https://arabic-practice-phi.vercel.app (Vercel project `arabic-practice`, team
  abdelhamedy33-7672, region fra1; `arabic-practice.vercel.app` belongs to someone else). A real guest turn
  streamed through the Vercel Function: first words 1.07 s, correction 2.6 s. Vercel's GitHub app now has
  access to this repo (pushes to main deploy). Vercel asked for 2FA setup: postponed with "remind me in 1 day".
- Evals (gemini-3.1-flash-lite, 41 correction + 10 reply cases): corrections 100% right verdicts, 0 false
  alarms, type recall 96%; replies 100% within level after the prompt fix (from 80%). Reports in
  `apps/api/evals/reports/`.

## Waiting on you
- Read the Arabic in the seed (`apps/api/src/db/seed/lessons.ts` and `conversations.ts`): written by the build session, structurally checked, not proven correct.
- The seed opening lines address the learner in the masculine (مَا اسْمُكَ). Fine for a demo; say if you want a neutral or feminine variant.
- Read the eval cases (`apps/api/evals/cases.json`, one per line): the expected corrections are the session's judgement.
- Vercel wants 2FA on your account (it asked during the deploy; I chose "remind me in 1 day"). Your call.
- The free tier now runs correction and reply on one model (gemini-3.1-flash-lite: fewer 503s, same quality), so about 225 practice turns a day in total. Set `AI_MODEL_CORRECTION=gemini-3.5-flash-lite` in Vercel to double that, at the cost of occasional "busy" retries.
