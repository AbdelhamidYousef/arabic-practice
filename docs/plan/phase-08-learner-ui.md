# Phase 8 — Learner UI

## Step 8.1 — landing and sign-in
- Landing: what it is, how a turn works (one illustrated example turn with a correction), "Try it as a
  learner", "See the teacher view", "Sign in". Login page; register page from an invite link
  (shows "invites are closed" while on the free tier).
- Commit: `feat(web): add landing, login and invite registration`

## Step 8.2 — lessons
- Lessons list grouped by level (cards: title, topic, level badge, practised count); lesson page
  (summary, goals, grammar focus, vocab table with harakat toggle, Start / Continue).
- Commit: `feat(web): add lesson list and lesson page`

## Step 8.3 — practice chat
- Message list (partner bubbles RTL; learner bubbles RTL), streaming reply with a typing state,
  correction card under each learner message (correct ✓ with praise, or corrected sentence with the
  changed words highlighted and a list of mistakes with type badges), "Translate" on partner messages,
  harakat toggle, composer (Enter sends, Shift+Enter new line, 500-char counter), stop button, errors
  inline with retry (limits show when they reset), the free-tier privacy notice for guests.
- Diff of original vs corrected by words after `normalizeArabic` (shared helper, unit-tested).
- Commit: `feat(web): add the practice chat with streaming and corrections`

## Step 8.4 — on-screen Arabic keyboard
- Toggleable keyboard (Arabic layout + harakat row + space/backspace) that types at the caret; real buttons, keyboard-accessible.
- Commit: `feat(web): add an on-screen arabic keyboard`
