# Phase 26 — Google Play (TWA)

Waits for him: the $25 developer account (his card) and 12 testers.

## Step 26.1 — package
- PWABuilder → Android package (`com.<his-id>.arabicpractice`), signing key saved only in `work/`
  and backed up by him. `public/.well-known/assetlinks.json` with the key's SHA-256.
- Commit: `feat(web): add the android asset links`

## Step 26.2 — store listing
- Screenshots (phone 1080×1920 from Playwright), short and long description, feature graphic, the
  privacy URL, the data-safety form (what is collected, deletion inside the app: phase 21).

## Step 26.3 — closed test → production
- Closed test with 12+ testers for 14 days in a row, then apply for production access.
