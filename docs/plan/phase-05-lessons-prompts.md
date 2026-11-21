# Phase 5 — Lessons API and the level-aware prompts

Goal: learners read their teacher's lessons; the prompts that keep the model at the level exist and are tested.

## Step 5.1 — CEFR level rules
- `packages/shared/src/levels.ts`: per level, what the partner may do: max sentences per reply,
  max words per sentence, harakat (A1–B1 full, B2 on ambiguous words, C1+ none), tenses and structures
  allowed, vocabulary guidance, and how explanations are pitched. These rules are also the eval's thresholds.
- Commit: `feat(shared): describe each cefr level as partner rules`

## Step 5.2 — lessons API (learner)
- `GET /lessons`, `GET /lessons/:slug` per contract; my teacher's published lessons only.
- Commit: `feat(api): add learner lessons endpoints`

## Step 5.3 — prompts
- `ai/prompts/reply.ts`: system prompt = role (patient MSA partner), lesson scenario, level rules,
  lesson vocabulary (preferred words), grammar focus, "reply in Arabic only, never correct inside the
  reply" (corrections are a separate call); history trimmed to the last 12 messages.
- `ai/prompts/correction.ts`: system prompt = MSA teacher grading one learner message at the given
  level; output JSON (schema below); explanations in English, short, at the learner's level; harakat
  mistakes flagged only when the learner wrote harakat; don't flag style when the sentence is correct.
  Schema: `{ isCorrect, corrected, mistakes: [{ type, original, correction, explanation }], praise? }`
  (max 5 mistakes).
- `ai/prompts/gloss.ts`: English translation of one partner message.
- Unit tests: each prompt contains the level rules and vocab, trims history, escapes nothing user-controlled into instructions (learner text only ever goes in user turns).
- Learn / explain: why correction and reply are two calls (parallel, cheaper models per job, a reply that never lectures).
- Commit: `feat(api): add level-aware reply, correction and gloss prompts`

## Step 5.4 — level metrics
- `ai/level-metrics.ts`: from a reply and the lesson: word count, sentence count, longest sentence,
  harakat ratio, lesson-vocab hits, Latin characters, and `withinLevel` against the level rules.
- Commit: `feat(api): measure partner replies against the level rules`
