# Phase 25 — PWA

No new library: a hand-written service worker (about 80 lines) so he can read all of it (REVIEW;
`vite-plugin-pwa` rejected for that reason).

## Step 25.1 — manifest and icons
- `manifest.webmanifest` (name, short name, theme colors, icons from phase 20, `display: standalone`,
  `lang: en`, start URL `/course`). Install prompt button on the progress page.
- Commit: `feat(web): make the app installable`

## Step 25.2 — offline
- The service worker caches the built app shell (versioned at build), the audio clips as they play,
  and the last-opened lessons. AI talk and progress saving need the network, and say so offline;
  progress done offline is queued and sent when back online.
- Commit: `feat(web): work offline for opened lessons`

## Step 25.3 — reminders
- A local "review is due" reminder in the Android app needs push. Web Push needs a server key pair
  (VAPID) and a sender; done with Node's `crypto` only if small, else deferred (REVIEW at the step).
- Commit: `feat(web): remind learners when review is due`
