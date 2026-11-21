# Plan 08 — Part 3: production, an Arabic look, and the Play Store

_Written 2026-11-21 after his review of the production study. His calls: real students on the web app
**and** a PWA in one go; the store target is **Google Play** for now; audio the cost-free way at
maximum efficiency; write the plan, then build. Mid-turn he added: the look has no Arabic identity and
reads as a "clean AI template"; make style proposals with an Arabic theme first._

## His calls (2026-11-21)
1. Scope: production readiness for real students **and** the installable app, together.
2. Store: Google Play only (no iOS for now).
3. Audio: free and efficient (below).
4. Design: proposals first, he picks, then it is applied everywhere.

## Audio: the decision (REVIEW)
- **Piper** (open-source TTS, MIT; Arabic voice `ar_JO-kareem`), run **on this machine** by a script,
  never on Vercel and never at request time. No account, no key, no limit.
- Gemini TTS rejected: its free tier allows about 10 requests a day (community report; Google
  doesn't publish the number), and we need about 1,000 clips.
- **Efficiency:** each clip is named by a hash of its vowelled text, so a run generates only new or
  changed lines. The output is 32 kbps mono MP3 (about 5–10 KB a word), served as static files from
  Vercel's CDN with a one-year cache, and cached offline by the PWA.
- **His voice wins:** a file in `audio/overrides/<hash>.mp3` replaces the generated one, so he can
  re-record the important words one at a time.
- The browser voice stays as the fallback when a clip is missing.
- He listens to a 20-word sample before the full run.

## Play Store: the route (REVIEW)
- **TWA (Trusted Web Activity):** the Play Store app is a thin Android shell around the live PWA, so
  the store app updates whenever the site deploys.
- The Android package is built with **PWABuilder** (a free web tool). The full Android SDK needs about
  3 GB and only 4.2 GB of disk is free.
- `/.well-known/assetlinks.json` on the site proves we own it.
- The signing key lives only in `work/` (untracked), with a backup on his side.
- **Rules from Google:** a personal developer account costs $25, once (his money, his OK). Personal
  accounts made after 2023-11-13 must run a **closed test with at least 12 testers for 14 days in a
  row** before production. His students and friends can be the testers.

## Phases
| # | Phase | File | Needs him? |
| --- | --- | --- | --- |
| 20 | Design: Arabic theme, proposals → pick → apply | `phase-20-design.md` | picks a proposal |
| 21 | Accounts and teacher tools | `phase-21-accounts.md` | no |
| 22 | Privacy, terms, consent | `phase-22-privacy.md` | reads the text |
| 23 | Ops and reliability | `phase-23-ops.md` | Sentry yes/no |
| 24 | Audio with Piper | `phase-24-audio.md` | listens to the sample |
| 25 | PWA: install, offline, reminders | `phase-25-pwa.md` | no |
| 26 | Google Play (TWA) | `phase-26-play-store.md` | $25 account, 12 testers |
| 27 | Real students: paid AI tier | `phase-27-paid-ai.md` | card and cap |

Order: 20 first, because icons, the splash screen and the store listing come from the look. 21–25
need no money and run in order. 26 and 27 wait for his account or card.
