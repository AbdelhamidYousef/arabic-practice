# Phase 17 — Lesson player and course path

## Step 17.1 — course path page
- Replaces the lessons list: levels as tabs, units as sections, lessons as a path of nodes (done,
  next up, not started); a header strip with streak, XP today and words learned. Nothing is locked.
- Commit: `feat(web): add the course path page`

## Step 17.2 — words step and audio
- Flashcards (flip, Arabic big, transliteration toggle, meaning), play button through
  `speechSynthesis` with an Arabic voice; button hidden when the device has none.
- Commit: `feat(web): add the words step with flashcards and audio`

## Step 17.3 — exercises step
- One component per exercise type, keyboard-accessible; check → right/wrong feedback with the answer;
  wrong ones come back at the end; progress bar; score saved.
- Commit: `feat(web): add the exercise player`

## Step 17.4 — grammar, culture, talk, finish
- Grammar note and culture tip as readable cards; "Talk it through" opens today's chat for the
  lesson; finish screen with XP, streak and "next lesson".
- Commit: `feat(web): add grammar, culture, talk and finish steps`

## Step 17.5 — review and progress use the new data
- Review mixes due vocab cards with quick exercises; progress shows lessons done per level, streak
  and XP by week next to today's mistake patterns. Teacher lesson view shows the new sections read-only.
- Commit: `feat(web): fold lessons into review, progress and the teacher view`
