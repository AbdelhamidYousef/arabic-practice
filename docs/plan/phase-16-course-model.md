# Phase 16 — Course data model and API

## Step 16.1 — A0 level
- `CEFR_LEVELS` gains `A0` first (label "Starter"); migration `ALTER TYPE cefr_level ADD VALUE 'A0' BEFORE 'A1'`.
- Commit: `feat(shared): add the A0 starter level`

## Step 16.2 — units and lesson sections
- `units` table (level, position, title, can-do summary); `lessons.unit_id`.
- `lessons` gains `grammar_note` (jsonb blocks: paragraph, example with Arabic + English, table),
  `culture_tip` (title + body), `kind` (`letters` for A0, `lesson`, `review`).
- `lesson_vocab` gains `translit`, `audio_text` (what the voice reads, defaults to arabic).
- `lesson_exercises` (lesson, position, `type`, `data` jsonb). Types and their `data` are one Zod
  discriminated union in `@arabic/shared`: `choose`, `match`, `build`, `gap`, `listen`, `letter`.
- Commit: `feat(api): add units, lesson sections and exercises`

## Step 16.3 — progress, XP, streaks
- `lesson_progress` (user, lesson, step, score, completed_at), unique per user+lesson+step.
- `activity_days` (user, day `date` as the learner's local date, xp). Streak = consecutive days
  ending today or yesterday. Correct exercise answers feed the existing vocab cards.
- Commit: `feat(api): track lesson progress, xp and streaks`

## Step 16.4 — endpoints
- `GET /course` (levels → units → lessons with the user's progress, plus "next up").
- `GET /lessons/:slug` returns all sections and exercises. Answers ship to the browser: it is
  practice, not an exam (REVIEW).
- `POST /lessons/:slug/progress` `{ step, score, day }` → updated XP and streak.
- Commit: `feat(api): add course and lesson progress endpoints`

## Step 16.5 — content files and validator
- Content lives in `apps/api/src/content/<level>/<nn>-<slug>.ts`, one lesson per file; the seed
  upserts by slug. Validator: full harakat on Arabic fields, translit present, every exercise answer
  appears in its options, `build` words rebuild the target, no English letters in Arabic fields.
  Today's 12 lessons are replaced by the Classroom lessons (old guest chats are throwaway data).
- Commit: `feat(api): load lessons from content files with a validator`
