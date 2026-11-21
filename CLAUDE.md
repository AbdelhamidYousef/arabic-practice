# CLAUDE.md — Arabic Practice, portfolio project

Tracked agent instructions. Keep under ~100 lines; move one-off detail next to the code.

## What this is
A public portfolio piece: an AI-powered Arabic practice app for learners, built around real
lessons. Working name **Arabic Practice** (codename `arabic-practice`).
The brief is `docs/plan/00-brief.md`; the master plan is `docs/plan/00-overview.md` (phases 0–13,
one file each, one small step = one commit, the Pawsome format). MSA only (his call). Reference docs:
`01-data-model.md`, `02-api-contract.md`, `03-conventions.md`; keep `04-decisions-log.md` (grouped by
phase, REVIEW-tagged), `05-build-journal.md` and `06-handover.md` current with every step.

## Rules
- He must understand every part: explain choices as you go; no tools outside the stack without asking.
- One proper build, no throwaway v1.
- No secrets in the repo: `.env` (ignored) + `.env.example` (documented). API keys never reach the browser.
- Money: free by default. Development runs on Gemini's free API tier; paid LLM spend only when real
  students start, only on his OK, with a hard spending cap and per-user rate limits in the app.
- Free-tier prompts may be used for training by the provider: only made-up chats go through it.
- **No real student data in this repo, ever** (names, messages, recordings, lesson logs). Seed and test
  data are made up. Real students only try it with their consent, and their data stays out of git.
- Git: commit and push **only when he says**. Remote via SSH alias `gh_y33`. Conventional commits, scoped.
  (2026-11-21: he approved an unattended build to a deployed app: commit per step, push and deploy.)
- He decides everything; where he delegates, decide, then log it in `docs/plan/04-decisions-log.md`.

## Learnings from earlier projects
`work/learnings.md` (untracked) holds what we learned building Pawsome and Grocery: cost and token
policy, speed, how sessions and agents split work, what went wrong. Read it at the start of every session.
**Add to it only after he approves:** propose new learnings as short bullet points, wait for his OK
(or edits), then write them in.

## Gates (run before every commit; all must pass)
```
find . -name '*.tsbuildinfo' -not -path '*/node_modules/*' -delete
pnpm typecheck && pnpm lint && pnpm format:check && pnpm -r --workspace-concurrency=1 test
pnpm e2e   # phase ends and before push; check `ss -ltnp | grep -E '3102|5275'` first
```
AI calls go through `LlmProvider` (`apps/api/src/ai/`); tests use the fake, so no suite hits an API.

## Local (ports are Pawsome's + 2)
```
docker compose up -d                 # postgres 127.0.0.1:5434 (fsync off: throwaway data only)
pnpm db:migrate && pnpm db:seed
pnpm dev                             # web :5175 (proxies /api → :3002), api :3002
```
