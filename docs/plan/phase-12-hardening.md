# Phase 12 — Hardening

## Step 12.1 — e2e suite
- Playwright on its own ports (3102/5275), API in `NODE_ENV=test` (fake provider), `vite preview`.
  Specs: guest practice flow, corrections visible, progress, review, teacher demo read-only, invite
  closed, keyboard-only send, overflow at 390 and 1280 on every route.
- Commit: `test(e2e): add end to end suite`

## Step 12.2 — CI e2e job
- After check + test; Chromium only; artefacts on failure.
- Commit: `ci: run the e2e suite`

## Step 12.3 — QA sweep
- Every route at 390 and 1280: overflow, tallest sections, long Arabic and English strings, 0/1/many
  items, slow network (3 s), keyboard walk. Fix and commit what it finds.
- Commit(s): `fix(web): …`

## Step 12.4 — security review
- Review auth, ownership checks, rate limits, SSE abuse (long-lived streams, body size), prompt
  injection in learner text (it can only affect the learner's own chat; never reaches the system
  prompt), secrets in logs. Fix findings.
- Commit(s): `fix(api): …`
