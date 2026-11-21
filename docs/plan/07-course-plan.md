# Plan 07 — Part 2: from chat demo to a real course app

_Written 2026-11-21 after his review of the live app. His words: the designs break in places, the
content is too thin, the app is only AI, the homepage is ugly; make it "a lot bigger, like real language
apps", a real homepage that leans on the menu, and pull real content from his `arabic-classroom` repo._

## His calls (2026-11-21)
1. A lesson = **words** (flashcards: Arabic, transliteration, meaning, audio) → **exercises with no AI**
   (choose, match pairs, build the sentence, fill the gap, listen and choose) → **grammar note** →
   **culture tip** → **talk it through** with the AI partner (optional, last). Progress, XP, streaks
   and spaced repetition run on all of it.
2. Content: **A0 + A1 + A2 in full** from `arabic-classroom/curriculum/` (A0: 10 lessons, A1: 36,
   A2: 26 in the Classroom plan). B1 later.
3. Audio: the browser's built-in Arabic voice (`speechSynthesis`), hidden when the device has none.
4. Homepage and look: my call. Calm and warm, today's teal and sand, nav-led, little text.
5. Machine: **one agent at a time**, one dev server, test suites one package at a time.

## Source content, and what never comes over
- Used: `curriculum/bank/*.md` (situations C, grammar G, sounds S, script R, words V, culture K),
  `curriculum/a0.md`, `curriculum/msa/a1.md`, `a2.md` (lesson order).
- **Never read or copied:** `0-knowledge/students/` or any lesson log. No real student data, ever.
- The Classroom story is set in Cairo (Sara and Adam); the app keeps the setting but all lines are
  written fresh for the app, MSA with full harakat. He reviews the Arabic before real students see it.

## Phases
| # | Phase | File |
| --- | --- | --- |
| 14 | Style sweep: fix what breaks, tighten the design system, header and footer | `phase-14-style-sweep.md` |
| 15 | Homepage: a real landing page | `phase-15-homepage.md` |
| 16 | Course data model and API (A0, units, exercises, progress, XP, streaks) | `phase-16-course-model.md` |
| 17 | Lesson player and course path UI | `phase-17-lesson-player.md` |
| 18 | Content: A0, A1, A2 from the Classroom bank | `phase-18-content.md` |
| 19 | QA, e2e, deploy, handover | `phase-19-qa-deploy.md` |

Order matters: 14–15 are visible wins on today's data; 16 before 17 (the player needs the API);
18 runs one level at a time after 16's validator exists, so every content file is checked as it lands.
