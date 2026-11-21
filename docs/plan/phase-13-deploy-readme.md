# Phase 13 — Deploy and README

Approved by him on 2026-11-21. Personal Google login `abdelhamedy33@gmail.com`, GitHub `AbdelhamidYousef`
(SSH alias `gh_y33`). No card anywhere; never solve CAPTCHAs (leave them for him).

## Step 13.1 — GitHub repo and first push
- Public repo `arabic-practice` (created in the browser; `gh` is not installed), `origin` via `gh_y33`, push `main`, CI green.

## Step 13.2 — Gemini API key
- Google AI Studio, personal login, free tier (no billing). Read the free limits for the chosen
  models on the AI Studio rate-limit page and set the caps under them. Key stored only in Vercel env
  and the local `.env`.

## Step 13.3 — Neon and Vercel
- Neon: a new project (or a database in the existing one if the free plan refuses a second), migrate and
  seed with the direct URL. Vercel: project from the GitHub repo, root `apps/web`, Express as a
  Function (Pawsome's `api/index.js` + `vercel.json`), env vars, streaming checked on the live URL.
- Commit: `chore(deploy): add vercel function entry and config` (the files land earlier if the build needs them)

## Step 13.4 — live check
- Guest flow on the live URL (a real Gemini turn streams, correction arrives), demo teacher view,
  limits message, 390 and 1280 px.

## Step 13.5 — README case study
- Problem, demo links, architecture diagram (text), the level-control approach, structured output,
  streaming, cost control with numbers, eval results table, privacy rules, tests and CI, local setup,
  what's next (paid tier, Claude adapter, voice).
- Commit: `docs: write the readme case study`
