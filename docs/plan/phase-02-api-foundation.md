# Phase 2 — API foundation

Goal: the cross-cutting API pieces, as Pawsome phase 2, before any feature.

## Step 2.1 — createApp(deps), errors, logging
- `createApp({ config, db, logger, ai })`: everything injectable. `AppError`, error middleware,
  404 handler, Pino with request id (validated before logging), `validate(schema)` helper.
- Commit: `feat(api): add app factory, error handling and request logging`

## Step 2.2 — security middleware
- helmet, JSON body limit (16 kB), Origin check on mutations, `express-rate-limit` helpers, cookie-parser.
- Commit: `feat(api): add security middleware and rate limit helpers`

## Step 2.3 — health with DB ping
- `GET /health` pings the DB and reports the AI provider name and whether AI is enabled.
- Commit: `feat(api): report database and ai status on health`

## Step 2.4 — production env rules
- In production: `SESSION_SECRET`-style values required, `WEB_ORIGIN` must be https,
  `AI_PROVIDER=fake` refused, `INVITES_ENABLED=true` refused while `AI_TIER=free`. Tests for each rule.
- Commit: `feat(api): refuse unsafe production configuration at boot`
