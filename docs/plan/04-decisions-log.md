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

## Phase 1
- 2026-11-21 · REVIEW · Test harness core (`global-setup.ts`, `setup.ts`, factories) landed in step 1.3/1.4, not 1.6 · the table tests of steps 1.3 to 1.5 need the harness to run at all; 1.6 adds the guard tests, the timing test and the foreign-key-order tests · writing throwaway cleanup in each table test · never.
- 2026-11-21 · REVIEW · `lessons.teacher_id` is `ON DELETE RESTRICT` · deleting a teacher must never silently wipe lessons and, through them, every learner's conversations · cascade (data loss by accident) · when a "delete my account" flow exists (hand lessons over first).
- 2026-11-21 · REVIEW · `users.teacher_id` is `ON DELETE SET NULL`; `ai_calls.user_id` and `conversation_id` too · a learner keeps their own history without their teacher, and the cost ledger outlives people · cascade · never.
- 2026-11-21 · REVIEW · Added check constraints beyond the data model: non-guests need an email and a password hash (`users_login_shape`), `invites.max_uses > 0` and `0 <= used_count <= max_uses` · the database refuses states the code must never create · app-level checks only · if guests ever get emails.
- 2026-11-21 · REVIEW · Extra indexes: `conversations(lesson_id)`, `mistakes(correction_id)`, `vocab_cards(vocab_id)`, guest `last_seen_at` (partial), `sessions(expires_at)` · foreign-key lookups and the guest cleanup scan · none, add on demand · if write cost shows up.
- 2026-11-21 · REVIEW · `harakatRatio` is the share of Arabic letters that carry at least one mark (0 to 1), not marks per letter · bounded and comparable between texts; fully voweled text scores about 0.6 to 0.8 because long-vowel letters take no mark · marks divided by letters (can exceed 1 with shadda) · if the level check wants a different measure.
- 2026-11-21 · REVIEW · `isArabic` means "Arabic letters are more than half of all letters" · tolerates one borrowed English word in a learner message, rejects an English sentence · any Arabic letter at all, or no Latin at all · if learners get wrongly rejected.
- 2026-11-21 · REVIEW · Seed lessons are all owned by the demo teacher; the dev teacher starts with none · guests and the demo class point at the demo teacher, so those are the lessons they see; the dev teacher can create their own to try CRUD · copying 12 lessons to a second teacher · if the owner wants editable seed lessons locally (then log in as a copy, or change the owner).
- 2026-11-21 · REVIEW · The dev teacher (`teacher@arabic-practice.test`, password from `SEED_TEACHER_PASSWORD`, default `Teacher-demo-1!`) is never created when `NODE_ENV=production` · the seed must never put a known password into a real database · creating it everywhere · never.
- 2026-11-21 · REVIEW · Demo teacher and the made-up learners get an unusable password hash (`!unusable:<uuid>`, not a valid argon2 string, so verify says "no match") · the demo signs in through its own endpoint, learners are fixtures · a random real hash nobody knows (slower, same effect) · never.
- 2026-11-21 · REVIEW · Seeded demo conversations are rebuilt on every run, and their made-up `ai_calls` rows are at least a day old (provider `gemini`, model from the env defaults, cost 0) · repeatable seed; seeded usage can never count against today's caps · stable ids and upserts (more code, no benefit for fixtures) · never.
- 2026-11-21 · REVIEW · Lesson content (12 lessons, 134 vocabulary items, 8 demo conversations) was written by the build session in common textbook MSA and passes a structural harakat check, but **no program can prove the Arabic correct** · he delegated the content and asked for accuracy · fewer, certain items (done: dictionary forms only, no rare words) · **before showing the demo to anyone: the owner reads every lesson, opening line and demo correction.**
- 2026-11-21 · REVIEW · Default AI model names in `.env.example` and `env.ts` (`gemini-2.5-flash`, `gemini-2.5-flash-lite`) are from the build session's knowledge · names change; the adapter in phase 3 should check the live model list · requiring the variable (breaks a fresh clone) · when the first live call runs.
