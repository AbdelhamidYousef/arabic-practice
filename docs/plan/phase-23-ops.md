# Phase 23 — Ops and reliability (free only)

## Step 23.1 — migrate on production deploy
- The Vercel build runs `db:migrate` with a direct-URL env var **only when `VERCEL_ENV=production`**,
  before the new code is promoted. No more "remember to migrate first".
- Commit: `ci(deploy): migrate the database on production builds`

## Step 23.2 — uptime check
- GitHub Actions cron every 30 min hits `/api/health`; on failure it opens (or comments on) a
  GitHub issue, which emails him. Free, no new service.
- Commit: `ci: add an uptime check`

## Step 23.3 — error reporting
- Default (no new tool): unhandled API errors go to an `app_errors` table (no personal data:
  route, code, message, stack hash, count) and a teacher-only "Errors" list.
- If he OKs Sentry's free tier instead, this step becomes Sentry for web and API.
- Commit: `feat(api): record unhandled errors`

## Step 23.4 — backups and staging
- Write down Neon's restore window for the free plan in the handover; a weekly `pg_dump` from a
  GitHub Action into an encrypted artifact (kept 7 days) if the window is short.
- Commit: `ci: add a weekly database backup`

## Step 23.5 — held-out eval set
- 20 new cases the prompts were never tuned on; report both sets in the README.
- Commit: `test(evals): add a held-out set`
