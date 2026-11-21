# Phase 4 — Auth

Goal: Pawsome's session design, plus guests, invites and a read-only demo teacher.

## Step 4.1 — sessions and passwords
- argon2id hashing (params once), session = 32 random bytes in the `sid` cookie, SHA-256 in the DB,
  30-day sliding expiry. `requireUser`, `requireRole('teacher')`, `forbidReadOnly` middleware.
- Commit: `feat(api): add cookie sessions and password hashing`

## Step 4.2 — login, logout, me
- Rate limits per IP+email; an unknown email costs the same time as a wrong password (dummy hash verify).
- Commit: `feat(api): add login, logout and current user`

## Step 4.3 — guest learners
- `POST /auth/guest`: creates `Guest XXXX` (teacher = demo teacher, level A1), signs in; lazily deletes
  guests unseen for 7 days. Per-IP limit (10/hour).
- Commit: `feat(api): add guest learners with lazy cleanup`

## Step 4.4 — invites and registration
- `GET /auth/invites/:code`, `POST /auth/register` (atomic use count), 403 `INVITES_CLOSED` unless `INVITES_ENABLED`.
- Commit: `feat(api): add invite-only registration`

## Step 4.5 — demo teacher
- `POST /auth/demo-teacher` signs in as the seeded read-only teacher; `forbidReadOnly` on every teacher mutation.
- Commit: `feat(api): add the read-only demo teacher sign-in`
