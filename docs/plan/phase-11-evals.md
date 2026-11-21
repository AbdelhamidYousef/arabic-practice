# Phase 11 — Evals

Goal: a number for "does this model correct well and stay at the level", runnable by hand against a
real model and in CI against the fake (to test the scorer, not the model).

## Step 11.1 — the case set
- `apps/api/evals/cases.json`: ~40 made-up learner sentences across A1–B2 and the lessons: correct
  ones (must not be flagged), and ones with known mistakes (gender agreement, definiteness, verb
  conjugation, case endings at B2, wrong word, word order, spelling hamza/ta marbuta, Latin letters).
  Each case: `level`, `lessonSlug`, `text`, `expected: { isCorrect, types[], mustContain[] }`.
  Plus ~10 reply cases (a learner turn + level) to measure reply level metrics.
- Commit: `feat(api): add the graded eval case set`

## Step 11.2 — scorer
- Pure functions: correction accuracy (isCorrect), mistake-type precision/recall, `mustContain` hits on
  the normalised corrected sentence, false alarms on correct sentences; reply metrics pass rate.
  Unit tests.
- Commit: `feat(api): score corrections and replies against the case set`

## Step 11.3 — runner and report
- `pnpm eval [--model x] [--provider gemini]`: runs cases with a small concurrency and pacing for the
  free RPM, writes `evals/reports/<date>-<model>.md` (summary table + failures). CI runs it on the fake.
- Commit: `feat(api): add the eval runner with markdown reports`

## Step 11.4 — first real runs
- Run against the Gemini free models available (Flash-Lite and Flash), pick the defaults per purpose
  from the numbers, commit the reports, log the decision.
- Commit: `docs(evals): add first gemini eval reports and pick models`
