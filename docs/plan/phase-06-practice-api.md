# Phase 6 — Practice API

Goal: a conversation turn: save the learner message, run correction and reply in parallel, stream the
reply over SSE, store everything, respect the caps.

## Step 6.1 — conversations
- `POST /conversations` (opening line as the first partner message), `GET /conversations/:id` (owner only).
- Commit: `feat(api): start and load practice conversations`

## Step 6.2 — the turn stream
- `POST /conversations/:id/turns`: validate (1–500 chars), budget check (JSON 429 before the stream),
  save the learner message, open SSE (`Content-Type: text/event-stream`, `Cache-Control: no-cache`,
  `X-Accel-Buffering: no`, flush headers), start correction (`generateJson`) and reply (`streamText`)
  together; send `delta`s as they come, `correction` when it lands, `done` with the saved partner
  message + level metrics. Client disconnect aborts both calls (AbortController). Provider 429 →
  `error AI_BUSY`. A failed correction does not kill the reply, and vice versa.
- Integration tests with the fake: event order, saved rows, caps, a forced 429, a forced bad JSON, abort.
- Learn / explain: SSE over POST; why headers flush first; what happens on a proxy that buffers.
- Commit: `feat(api): stream practice turns with parallel correction`

## Step 6.3 — corrections and mistakes saved
- Correction + mistakes rows in one transaction; `turn_count`, `last_message_at` updated.
- Commit: `feat(api): store corrections and mistakes per turn`

## Step 6.4 — gloss on demand
- `POST /messages/:id/gloss`: partner messages in my conversations only; cached; counted against caps.
- Commit: `feat(api): translate a partner message on demand`
