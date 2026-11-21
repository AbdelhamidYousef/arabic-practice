# Plan 01 — Data model

Postgres 16, Drizzle schema in `apps/api/src/db/schema/*.ts`, SQL migrations are the source of truth.
All ids are `uuid` (`gen_random_uuid()`), all times `timestamptz`, every table has `created_at`.
Tables with `updated_at` use the `set_updated_at()` trigger from migration 0000.

## Enums

- `cefr_level`: `A0 A1 A2 B1 B2 C1 C2` (A0 = "Starter", added in phase 16; migration 0007 only adds the value)
- `user_role`: `learner teacher`
- `lesson_status`: `draft published`
- `lesson_kind`: `letters lesson review`
- `message_role`: `learner partner`
- `mistake_type`: `grammar vocabulary harakat spelling word_order register`
- `ai_purpose`: `correction reply gloss eval`
- `ai_call_status`: `ok error limited`

## Tables

### users
| column | type | notes |
| --- | --- | --- |
| id | uuid pk | |
| email | citext unique null | null for guests |
| password_hash | text null | argon2id; null for guests |
| display_name | text | guests: "Guest 4F2A" |
| role | user_role | |
| teacher_id | uuid null → users | a learner's teacher; guests point at the demo teacher |
| level | cefr_level default A1 | the learner's current level (teacher can change) |
| is_guest | bool default false | |
| read_only | bool default false | the demo teacher: every mutation answers 403 |
| last_seen_at | timestamptz | |

### sessions
`id_hash text pk` (SHA-256 of the cookie value), `user_id → users on delete cascade`, `expires_at`, `created_at`. Index on `user_id`.

### invites
`id`, `code_hash text unique` (SHA-256 of the code), `teacher_id → users`, `note text` (e.g. "Preply, Tuesday group"),
`max_uses int`, `used_count int default 0`, `expires_at`. A sign-up increments `used_count` with
`UPDATE … WHERE used_count < max_uses AND expires_at > now() RETURNING` (no check-then-insert race).

### password_resets (phase 21)
`id`, `token_hash text unique` (SHA-256 of the link token), `user_id → users on delete cascade`,
`created_by → users on delete set null` (the teacher), `expires_at` (24 h), `used_at null`, `created_at`.
Spent with `UPDATE … WHERE used_at IS NULL AND expires_at > now() RETURNING`.

### lessons
`id`, `teacher_id → users`, `slug unique`, `title`, `level cefr_level`, `topic`, `summary`,
`goals text[]`, `grammar_focus text`, `scenario text` (what the partner plays: "You are a shopkeeper in
a bakery…"), `opening_line text` (the partner's first message, written by the teacher with harakat),
`status lesson_status`, `position int`, `updated_at`. Index `(teacher_id, status, level, position)`.
Course columns (phase 16): `unit_id → units on delete set null` (null for teacher-made lessons),
`kind lesson_kind` (default `lesson`), `grammar_note jsonb` (GrammarBlock[], default `[]`),
`culture_tip jsonb null` ({ title, body }).

### units
`id`, `level cefr_level`, `position int`, `code text unique` ('A1.1'), `title`, `summary` (the can-do
sentence). Unique `(level, position)`. Content, loaded by the seed from `apps/api/src/content/units.ts`.

### lesson_exercises
`id`, `lesson_id → lessons on delete cascade`, `position int`, `type text` (mirrors `data.type`),
`data jsonb` (one `Exercise` of the Zod union in `packages/shared/src/course.ts`: choose, match, build,
gap, listen). Unique `(lesson_id, position)`.

### lesson_progress
pk `(user_id, lesson_id, step)`, both FKs cascade, `step text` (LessonStep: words practice grammar
culture talk), `score int null 0..100` (practice only; re-posting keeps the best), `completed_at`
(the first completion).

### activity_days
pk `(user_id, day)`, `user_id → users cascade`, `day date` (the learner's local date, sent by the
browser), `xp int`. A row exists only for a day on which XP was earned; the streak is read from these.

### lesson_vocab
`id`, `lesson_id → lessons on delete cascade`, `arabic text` (with harakat), `arabic_plain text`
(normalised: harakat stripped, alef/ya/ta-marbuta folded; computed in code by `@arabic/shared`),
`translit text` (default ''), `english text`, `note text null`, `position int`. Unique `(lesson_id, arabic_plain)`.

### conversations
`id`, `user_id → users on delete cascade`, `lesson_id → lessons on delete cascade`, `turn_count int`,
`last_message_at`, `created_at`. Index `(user_id, last_message_at desc)`.

### messages
`id`, `conversation_id → conversations on delete cascade`, `role message_role`, `text`, `gloss_en text null`
(filled on demand), `level_metrics jsonb null` (partner messages: words, sentences, longest sentence,
harakat ratio, lesson-vocab hits, latin chars), `created_at`. Index `(conversation_id, created_at)`.

### corrections
`id`, `message_id → messages unique on delete cascade` (the learner message), `is_correct bool`,
`corrected text`, `praise text null`, `created_at`.

### mistakes
`id`, `correction_id → corrections on delete cascade`, `user_id → users on delete cascade` (denormalised for
progress queries), `lesson_id → lessons`, `type mistake_type`, `original text`, `correction text`,
`explanation text`, `created_at`. Index `(user_id, created_at desc)`, `(user_id, type)`.

### vocab_cards (spaced repetition, Leitner boxes)
pk `(user_id, vocab_id)`, `user_id → users cascade`, `vocab_id → lesson_vocab cascade`, `box int 1..5`
(check), `due_at`, `reviews int`, `lapses int`, `last_reviewed_at null`. Index `(user_id, due_at)`.
Intervals: box 1 = 1 day, 2 = 2, 3 = 4, 4 = 8, 5 = 16 days. Right → box + 1; wrong → box 1.

### ai_calls (usage and cost ledger)
`id`, `user_id null → users on delete set null`, `conversation_id null → conversations on delete set null`, `purpose ai_purpose`,
`provider text`, `model text`, `input_tokens int`, `output_tokens int`, `latency_ms int`,
`cost_micro_usd int` (from the price table; 0 on the free tier), `status ai_call_status`,
`error_code text null`, `created_at`. Index `(created_at)`, `(user_id, created_at)`.
Daily caps count rows here; the monthly budget sums `cost_micro_usd`.

## Retention

- Guests and their data are deleted 7 days after `last_seen_at`. The cleanup runs lazily whenever a
  new guest is created (no cron needed).
- Real learners' data lives only in the production database, never in git.
