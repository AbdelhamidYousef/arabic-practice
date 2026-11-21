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

## Waiting on you
- Read the Arabic in the seed (`apps/api/src/db/seed/lessons.ts` and `conversations.ts`): written by the build session, structurally checked, not proven correct.
- The seed opening lines address the learner in the masculine (مَا اسْمُكَ). Fine for a demo; say if you want a neutral or feminine variant.
- Read the eval cases (`apps/api/evals/cases.json`, one per line): the expected corrections are the session's judgement.
