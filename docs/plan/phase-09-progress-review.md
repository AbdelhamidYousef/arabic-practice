# Phase 9 — Progress and vocabulary review

## Step 9.1 — progress API
- `GET /progress` per contract (SQL aggregates; weeks in UTC).
- Commit: `feat(api): add learner progress aggregates`

## Step 9.2 — progress page
- Totals, mistakes by type (simple CSS bars, no chart library), mistakes-per-turn by week, recent
  mistakes with original → correction and explanation, empty state.
- Commit: `feat(web): add the progress page`

## Step 9.3 — review API (Leitner)
- `GET /review/due` (creates cards for vocab of practised lessons, up to 20 due), `POST /review/:vocabId`.
  Box maths in a pure function with tests.
- Commit: `feat(api): add spaced repetition review`

## Step 9.4 — review page
- Flashcard: Arabic (with harakat) → reveal English → "I knew it" / "Not yet"; keyboard shortcuts; session summary.
- Commit: `feat(web): add the vocabulary review session`
