# Phase 0 — Repo bootstrap, tooling, gates, CI

Goal: an empty but fully wired monorepo where typecheck, lint, format and tests run and pass, locally
and in GitHub Actions. Reuse Pawsome's setup (`../store-pawsome`): same versions, same configs, renamed.
Package scope `@arabic/*`. Nothing product-specific yet.

## Step 0.1 — git, ignore, node version, editor config
- `.nvmrc` = 22, `.editorconfig`; `.gitignore` exists. `CLAUDE.md`, `docs/plan/` exist.
- Acceptance: `git status` shows only intended files.
- Learn / explain: why `.env.*` is ignored but `.env.example` is force-included.
- Commit: `chore(repo): add node version and editor config`

## Step 0.2 — pnpm workspace, root package.json, base tsconfig
- As Pawsome 0.2: `pnpm-workspace.yaml`, root scripts (`dev build typecheck lint format format:check
  test test:live e2e db:migrate db:seed db:reset eval`), `packageManager: pnpm@12.16.1`,
  `tsconfig.base.json` + solution `tsconfig.json`.
- Learn / explain: pnpm strict node_modules; `workspace:*`; `tsc -b` project references.
- Commit: `chore(repo): add pnpm workspace and base tsconfig`

## Step 0.3 — packages/shared skeleton
- `@arabic/shared`: `errors.ts` (error codes from the API contract), `cefr.ts` (levels enum + labels),
  `index.ts`. Vitest with one test.
- Commit: `feat(shared): add error codes and cefr levels`

## Step 0.4 — apps/api skeleton
- Express 5, `createApp()` separate from `listen`, `GET /api/v1/health`, Supertest test. Scripts as Pawsome.
- Commit: `feat(api): scaffold express app with health endpoint`

## Step 0.5 — apps/web skeleton
- Vite + React 18 + SWC, Tailwind, TanStack Query, React Router; `server.proxy['/api'] → :3002`,
  dev port 5175 (`strictPort`). Shows "Arabic Practice" and the API health. One component test.
- Commit: `feat(web): scaffold vite react app with api proxy`

## Step 0.6 — lint, format, git hooks
- Pawsome's `eslint.config.js`, `.prettierrc`, `.prettierignore` (docs, md, migrations), lint-staged + simple-git-hooks.
- Commit: `chore(repo): add eslint, prettier and git hooks`

## Step 0.7 — docker compose (fast local Postgres)
- `docker-compose.yml`: `name: arabic`, `postgres:16-alpine` on `127.0.0.1:5434`, user/db `arabic`,
  init script creating `arabic_test`, and `command: postgres -c fsync=off -c synchronous_commit=off -c full_page_writes=off`.
- `.env.example` with every variable so far, commented.
- Learn / explain: why fsync off is fine for a throwaway local DB and never for production.
- Commit: `chore(repo): add docker compose for postgres`

## Step 0.8 — CI
- `.github/workflows/ci.yml`: `check` (typecheck, lint, format) and `test` (Postgres service) in
  parallel, pnpm cache, `cancel-in-progress`; `secrets` (gitleaks, full history). e2e job added in phase 12.
- Commit: `ci: add check, test and secret scan workflows`

## Step 0.9 — README stub
- Name, one line, "work in progress", local setup commands.
- Commit: `docs: add readme stub`

Phase 0 done when a fresh clone + README commands give a running (empty) app and all gates pass.
