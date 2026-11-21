# Plan 04 — Decisions log

Format: date · decision · why · alternatives rejected · revisit when. Grouped by phase.
**REVIEW** = made by the build session on the owner's behalf (he delegated on 2026-11-21: "do all the
decisions that you need and mark them for my revision"). OWNER = his own call.

## Index: still needs his eye
- Planning: teacher side in v1, demo without open sign-up, invites locked to the paid tier, scope.

## Planning
- 2026-11-21 · OWNER · LLM: Gemini free tier first, behind one provider interface; paid only on his OK with a hard cap.
- 2026-11-21 · OWNER · MSA only; no dialect modelling for now.
- 2026-11-21 · OWNER · Unattended build to a deployed app; commit, push and deploy approved.
- 2026-11-21 · REVIEW · Teacher side is in v1 (lessons, learners, transcripts, usage) · the brief is "built around real lessons", and the teacher's view of mistakes is the tutor-facing value · learner-only first (lessons would be seed-only, no story for the tutor) · if time runs short, cut the usage page first.
- 2026-11-21 · REVIEW · Public demo = guest learner + read-only demo teacher, no open sign-up; real students by invite · protects the free quota and keeps real personal data out of free-tier prompts · open sign-up with limits (abuse, real data on the free tier), one shared demo account (visitors would see each other's chats) · when on a paid tier.
- 2026-11-21 · REVIEW · Invite sign-up refuses to switch on while `AI_TIER=free` (env validation) · turns the "no real student on the free tier" rule into code, not a promise · a README note only · never.
- 2026-11-21 · REVIEW · Correction and reply are two parallel calls, not one JSON call · the reply streams as plain text, the correction is strict JSON; each can use its own model; the partner never lectures · one streamed JSON object parsed partially (fragile, slower first token) · if the eval shows the reply needs the correction's result.
- 2026-11-21 · REVIEW · English gloss on demand, not in every reply · halves output tokens; learners at A1 click it, B2 rarely · always-on gloss · if learners ask for it.
- 2026-11-21 · REVIEW · Gemini over plain `fetch`, no SDK · the REST API (SSE, response schema) is the thing to understand and show; zero dependencies · `@google/genai` · if the API changes often.
- 2026-11-21 · REVIEW · Spaced repetition with Leitner boxes (1/2/4/8/16 days) · explainable in one sentence, deterministic, no AI cost · SM-2 (more knobs, little gain at this size) · never.
- 2026-11-21 · REVIEW · Guests deleted 7 days after last seen, lazily when a new guest is created · no cron on a free host · a GitHub Actions cron (more moving parts) · if guest volume grows.
- 2026-11-21 · REVIEW · Ports Pawsome + 2 (Postgres 5434, API 3002, web 5175, e2e 3102/5275), compose project `arabic`, DBs `arabic` / `arabic_test`, package scope `@arabic/*` · all three projects run side by side · never.
- 2026-11-21 · REVIEW · One serial build lane in the main checkout, Sonnet builders per phase, Opus reviews auth, AI layer, budget and the turn stream · disk has 5 GB free (a worktree is ~1.7 GB), machine load already 12 of 20 cores · parallel worktrees · if disk is freed.
- 2026-11-21 · REVIEW · Fonts: Inter (UI) and Noto Naskh Arabic, self-hosted with `@fontsource` · Naskh is the textbook style learners read, keeps harakat legible; no third-party font request · IBM Plex Sans Arabic, Amiri · his taste.

## Phase 0
- 2026-11-21 · REVIEW · Config files (eslint, prettier) and the git-hook setup landed in steps 0.2/0.3, so step 0.6 is an empty verification commit · the gates (lint, format) had to run from the first workspace on · splitting the files across steps by hand (would have meant committing code that fails its own gates) · never.
- 2026-11-21 · REVIEW · CI test job runs no separate `db:migrate` · the test harness migrates `arabic_test` itself in `globalSetup`, and `db:migrate` does not exist until phase 1 · adding the step later (redundant) · if a job needs a migrated non-test DB (e2e, phase 12).
- 2026-11-21 · REVIEW · `pnpm-workspace.yaml` keeps `argon2: false` in `allowBuilds` and drops `sharp` · as Pawsome (argon2 ships prebuilt binaries); no image processing here · building argon2 from source · if install fails on a new platform.
- 2026-11-21 · REVIEW · Kept `@playwright/test` as a root dev dependency though e2e starts in phase 12 · same versions as Pawsome, lockfile stays stable · adding it later · never.
