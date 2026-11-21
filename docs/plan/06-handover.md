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

## Waiting on you
- Read the Arabic in the seed (`apps/api/src/db/seed/lessons.ts` and `conversations.ts`): written by the build session, structurally checked, not proven correct.
