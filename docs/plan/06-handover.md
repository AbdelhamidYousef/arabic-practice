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

## Waiting on you
- Read the Arabic in the seed (`apps/api/src/db/seed/lessons.ts` and `conversations.ts`): written by the build session, structurally checked, not proven correct.
