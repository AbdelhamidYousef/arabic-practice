# Phase 21 — Accounts and teacher tools

No email sender: a sender needs a domain of our own (money). Resets go through him instead, since he
invites every real student anyway (REVIEW).

## Step 21.1 — create-teacher script
- `pnpm --filter @arabic/api teacher:create <email>`: reads the password from a prompt, never
  from argv; refuses a weak password; works against Neon with the direct URL.
- Commit: `feat(api): add a create-teacher script`

## Step 21.2 — change password
- `POST /auth/password` (current + new), revokes the other sessions. A settings page.
- Commit: `feat(auth): let users change their password`

## Step 21.3 — teacher-issued reset links
- The teacher makes a one-time link for one of their learners (random token, SHA-256 stored, 24 h,
  single use) and sends it by Preply chat. `/reset/:token` sets a new password and ends all sessions.
- Commit: `feat(auth): add teacher-issued password reset links`

## Step 21.4 — delete my account and export my data
- `GET /me/export` (JSON: profile, conversations, mistakes, progress). `DELETE /me` after typing
  the password: cascades the learner's own rows. `ai_calls` keep the cost but lose the user id
  (`SET NULL`, already in the schema). Required by GDPR and by Google Play's data-deletion rule.
- Commit: `feat(api): add data export and account deletion`

## Step 21.5 — clear limit messages
- Web copy for `CONVERSATION_LIMIT`, `GUEST_LIMIT` and the daily caps, with when it resets.
- Commit: `fix(web): explain each daily limit`
