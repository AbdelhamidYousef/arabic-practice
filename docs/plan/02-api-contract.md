# Plan 02 — API contract

Base `/api/v1`. JSON in and out (except the SSE turn stream). Request and response shapes are Zod
schemas in `packages/shared/src/schemas/`. Errors: `{ error: { code, message, details? } }` with codes
from `packages/shared/src/errors.ts`. Auth = `sid` cookie (httpOnly, SameSite=Lax, Secure in prod).
Mutations need a matching `Origin`. Ids that are missing or belong to someone else are the same 404.

## Health
- `GET /health` → `{ status: 'ok', db: 'ok', ai: { provider, enabled } }`

## Auth
- `GET /auth/me` → `{ user }` or 401
- `POST /auth/login` `{ email, password }` → `{ user }` (rate-limited per IP+email)
- `POST /auth/logout` → 204
- `POST /auth/guest` → `{ user }`: creates a guest learner (rate-limited per IP), cleans expired guests
- `POST /auth/demo-teacher` → `{ user }`: signs in as the read-only demo teacher
- `GET /auth/invites/:code` → `{ teacherName, valid }`
- `POST /auth/register` `{ code, email, password, displayName }` → `{ user }`. 403 `INVITES_CLOSED` while `AI_TIER=free`.
- `POST /auth/password` `{ currentPassword, newPassword }` → 204 (phase 21). Signed in, not a guest, not the
  read-only demo. Keeps this session and deletes the user's other sessions. 403 `WRONG_PASSWORD` for a wrong
  current password (not 401: the web reads a 401 as "signed out"); 400 for a weak new password; rate-limited
  per user (the auth limit).
- `POST /auth/reset` `{ token, password }` → 204 (phase 21). Public, rate-limited per IP. Spends a teacher-issued
  link: sets the password, marks the link used and deletes ALL the learner's sessions in one transaction.
  404 `NOT_FOUND` for an unknown, expired or already-used token (indistinguishable on purpose); 400 for a weak password.
- (phase 21, script, not HTTP) `pnpm --filter @arabic/api teacher:create <email>` creates a teacher; see README.

## Lessons (learner)
- `GET /lessons` → published lessons of my teacher, grouped by level, with my conversation count per lesson
- `GET /lessons/:slug` → lesson + vocab + my recent conversations for it. Phase 16 adds `lesson.unit`
  ({ code, title } or null), `lesson.kind`, `lesson.grammarNote`, `lesson.cultureTip`, `vocab[].translit`,
  `exercises[]` (the shared `Exercise` union, answers included: practice, not an exam) and `progress`
  ({ stepsDone, practiceScore }). 404 for missing, draft and foreign lessons.

## Course (learner, phase 16)
- `GET /course?day=YYYY-MM-DD` → `{ levels: [{ level, units: [{ code, title, summary, position, lessons:
  [{ slug, title, kind, position, stepsDone, practiceScore }] }] }], nextUp, stats: { streak, xpToday,
  xpTotal, wordsLearned } }`. Only course lessons (those in a unit) that are published and belong to my
  teacher; levels and units with none are left out. `nextUp` is the slug of the first lesson (course
  order) whose required steps are not all done (words, practice, plus grammar and culture when the
  lesson has them; talk is optional), or null. `day` is optional (default: the server's UTC date).
- `POST /lessons/:slug/progress` `{ step, score?, day }` → `{ xpGained, xpToday, streak }`. `step` is one
  of words practice grammar culture talk; `score` (0..100) is required for `practice` and ignored for the
  rest; `day` is the learner's local date and must be within one day of the server's UTC date, else 400
  `VALIDATION_ERROR`. XP is paid only on the first completion of a step (words 5, practice 5 +
  round(10·score/100), grammar 3, culture 2, talk 10); a repeat keeps the best score and pays 0. Finishing
  `practice` creates review cards for the lesson's words. 403 `DEMO_READ_ONLY` for the demo teacher; the
  same 404 as `GET /lessons/:slug`.

## Practice
- `POST /conversations` `{ lessonId }` → `{ conversation, messages }` (the opening line is the first partner message)
- `GET /conversations/:id` → conversation, lesson summary, messages with corrections
- `POST /conversations/:id/turns` `{ text }` → `text/event-stream`. Events:
  - `learner` `{ message }`: the saved learner message
  - `delta` `{ text }`: a chunk of the partner reply
  - `correction` `{ messageId, correction }`: arrives whenever the correction call finishes, before or after the reply
  - `done` `{ message, usage }`: the saved partner message with level metrics
  - `error` `{ code, message }`: `AI_LIMIT_USER`, `AI_LIMIT_GLOBAL`, `AI_DISABLED`, `AI_BUSY` (provider 429), `AI_FAILED`

  Before the stream opens: 400 for empty or too-long text (max 500 chars), 429 `AI_LIMIT_*` with JSON body.
- `POST /messages/:id/gloss` → `{ glossEn }` (partner messages only; cached on the row; counts against caps)

## Progress and review
- `GET /progress` → totals (conversations, turns, mistakes), mistakes by type, mistakes per turn per week, recent mistakes
- `GET /review/due` → up to 20 due cards (creates cards for vocab of lessons the learner has practised)
- `POST /review/:vocabId` `{ correct: boolean }` → the card's new box and due date

## Teacher (role teacher; mutations 403 `DEMO_READ_ONLY` for the demo teacher)
- `GET /teacher/lessons`, `POST /teacher/lessons`, `GET/PUT/DELETE /teacher/lessons/:id` (body includes the vocab list, replaced as a whole)
- `GET /teacher/learners` → my learners with last activity, turns this week, top mistake types
- `PATCH /teacher/learners/:id` `{ level }`
- `GET /teacher/learners/:id` → learner, conversations, mistakes by type, recent mistakes
- `POST /teacher/learners/:id/reset-link` → 201 `{ resetPath: '/reset/<token>', expiresAt }` (phase 21): a one-time
  24 h link for one of my own non-guest learners (foreign id = 404), shown once; replaces the learner's unused older
  link; 30 an hour per teacher; `DEMO_READ_ONLY` for the demo teacher.
- `GET /teacher/conversations/:id` → full transcript with corrections
- `GET /teacher/invites`, `POST /teacher/invites` `{ note, maxUses, expiresInDays }` → `{ invite, code }` (the code is shown once)
- `GET /teacher/usage` → AI calls and tokens per day (30 days), by purpose and model, cost, today's cap status

## Test-only (mounted only when `NODE_ENV=test`)
- `POST /test/reset-limits`: clears today's `ai_calls`, so e2e can run many turns
