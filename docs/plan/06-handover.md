# Plan 06 — Handover

Written by the build sessions for the owner and the next session. Newest state first.

## Phase 21 (accounts and teacher tools)

- `pnpm --filter @arabic/api teacher:create <email>` makes a teacher (hidden password prompt; for Neon use the direct URL).
  This closes the "create teacher script is not written yet" item below.
- Settings page `/settings` (learners and teachers, not guests or the demo): change password (keeps this session, ends
  the others), download my data, delete my account (learners only; the operator closes a teacher account).
- Teacher-issued reset links (`password_resets`, migration `0010_password_resets`): the teacher makes a link on the
  learner's page and sends it by chat; `/reset/:token` sets a new password and ends all that learner's sessions.
  Production builds apply the migration themselves (phase 23.1).
- Every daily limit now says when it resets; the guest limit has its own text.

## Part 2 state (2026-11-21, later the same day)

**Live:** https://arabic-practice-phi.vercel.app. Neon is migrated to 0009 and seeded with the course.

- **The app is now a course:** 66 lessons (A0 Starter 10, A1 30, A2 26) in 8 units, from his
  `arabic-classroom` curriculum, 759 exercises.
  - Each lesson runs words (flashcards with audio and transliteration), practice (choose, match,
    build, gap, listen), grammar, culture, then an optional AI talk.
  - XP, streaks and "words learned" are tracked; finishing a lesson's practice adds its words to
    review.
- **Homepage, header and footer rebuilt:** nav-led, with a phone menu.
- **Style fixes:** badges, Arabic highlights, Arabic text sizes (a CSS layer bug), one page width
  everywhere, card padding, and the level tabs on a phone.
- **Tests:** shared 58, API 583, web 275, e2e 14 (overflow checked at 390 and 1280 px on every
  route, including each player step).
- **The first 12 chat lessons** are drafts, kept only for the demo class's transcripts.

### Waiting on you (part 2)
- **A native read of the Arabic.** Every lane listed lines it was unsure of; the decisions log and
  the lane notes in the chat cover them. Most worth a look:
  - loanwords (تَاكْسِي، مِتْرُو، أَلُو)
  - حَضْرَتُكَ as MSA
  - the vowelled waṣl alif on imperatives (اُكْتُبْ), as in your bank
  - woman's forms moved to notes in A0
- **Not built yet** (phase 17.5 extras):
  - review mixing quick exercises with the word cards
  - XP by week on the progress page
- **Open:** should review cards start at the words step instead of practice?

## Final state (2026-11-21, end of the unattended build)

**Live:** https://arabic-practice-phi.vercel.app · **Repo:** https://github.com/AbdelhamidYousef/arabic-practice (public)

- **All phases 0–13 built**, merged to `main`, pushed. CI green on GitHub: typecheck, lint, format,
  tests, Playwright e2e and the gitleaks scan.
- **Tests:** shared 54, API 535, web 221, e2e 13 specs (about 15 s, fake AI provider, overflow checked at
  390 and 1280 px on every route).
- **Live check:** a guest practised a lesson in a real browser on the production URL. The real Gemini
  turn finished in 4.3 s, the reply streamed in, the correction found both missing hamzas, no overflow at
  390 or 1280 px. A streamed turn over curl showed the first words at about 1.1 s.
- **Evals** (`apps/api/evals/reports/`, gemini-3.1-flash-lite, 41 correction and 10 reply cases):
  - corrections: right verdicts 95% → 100%, false alarms 7% → 0%, type recall 89% → 96%;
  - replies within the level rules: 80% → 100%.

  The prompts were tuned on these same cases, so these numbers are optimistic; a held-out set is next.
- **Security:** an independent review found one high issue: any visitor could read guests' chats
  through the demo teacher. It was fixed, pushed and verified live within the hour. The medium and low
  findings are fixed too:
  - quota abuse across serverless instances
  - in-flight calls counted against the caps
  - an IP limit on login
  - personal data scrubbed from database error logs
  - CSP and other security headers
  - a read-only review POST
  - a cached health probe

### Where things live
- **Vercel:** project `arabic-practice`, team abdelhamedy33-7672, function region fra1; pushes to
  `main` deploy. Env vars:
  - `DATABASE_URL` (Neon pooled)
  - `WEB_ORIGIN`
  - `GEMINI_API_KEY`
  - `AI_TIER=free`
  - `LOG_LEVEL`
  - `IP_HASH_SALT`

  The rest use the code defaults (see `.env.example`).
- **Neon:** project `arabic-practice` (`super-violet-75591213`, Frankfurt), migrations 0000–0006 applied,
  seeded. Migrate from a shell with the direct URL **before** pushing code that needs a new migration.
- **Gemini:** AI Studio project `arabic-practice` on his personal Google account, free tier, no billing.
  Free limits read 2026-11-21: Flash-Lite 3.1 and 3.5 have 15 requests a minute and 500 a day each;
  Flash has 5 a minute and 20 a day.
- **Secrets:** they live only in Vercel, the local `.env` and the untracked `work/` folder
  (`work/.gemini-key.txt`, `work/.neon.json`). They were never typed into chat or committed.

### Known gaps (small, not blocking)
- Missing final-letter harakat on replies isn't fully solved; the harakat ratio stays around 0.80.
- `diffWords` doesn't highlight a change that is only hamza, ta marbuta or harakat, because it matches
  after normalising. The mistakes list still names those fixes.
- On phones, a lesson with many vocab items (40+) makes the editor and the lesson page long.
- Not tested: iOS Safari with the on-screen phone keyboard, and a real screen reader.
- The web has no dedicated message for the new `CONVERSATION_LIMIT` and `GUEST_LIMIT` errors; it shows
  the generic error.

## Waiting on you
- **Read the Arabic:** the 12 seed lessons (`apps/api/src/db/seed/lessons.ts`), the made-up demo chats
  (`conversations.ts`) and the eval cases (`apps/api/evals/cases.json`, one per line). The opening lines
  address the learner in the masculine (مَا اسْمُكَ).
- **The decision index** at the top of `04-decisions-log.md`: ten items marked for your review.
- **Vercel 2FA:** Vercel asked you to set up two-factor authentication during the deploy. I chose
  "remind me in 1 day".
- **Learnings:** the new entries for `work/learnings.md` are proposed in the session's final message
  and not written yet (they need your OK).
- **Real students** need a paid tier (your OK, a card, a spending cap). Then set `AI_TIER=paid`,
  `AI_MONTHLY_BUDGET_USD` and `INVITES_ENABLED=true`. You also need a teacher login of your own:
  production has only the read-only demo teacher, and a small "create teacher" script is not written
  yet. It's the first step of that phase.
- **Screen-reader pass and a native read of the UI copy:** yours, as on Pawsome.
