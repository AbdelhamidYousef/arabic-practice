# Phase 22 — Privacy, terms, consent

## Step 22.1 — privacy policy and terms pages
- Plain English, short: what is stored, where (EU: Vercel fra1, Neon Frankfurt), who processes it
  (the AI provider on the paid tier), retention (guests 7 days), how to export or delete.
  He reads them; they are drafts until he does. Google Play needs the privacy URL.
- Commit: `feat(web): add privacy and terms pages`

## Step 22.2 — consent at invite sign-up
- A required checkbox linking both pages; the accepted version and time are stored on the user.
- Commit: `feat(auth): record consent at sign-up`
