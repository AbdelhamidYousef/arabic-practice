# Build journal

What was built per step and why, for the owner to read; three quiz questions at the end of each phase.

## Phase 0 — Repo bootstrap, tooling, gates, CI

- **0.1 node version and editor config.** `.nvmrc` pins Node 22 and `.editorconfig` keeps every editor
  on the same whitespace rules. Learn: `.env.*` is ignored by `.gitignore` but `.env.example` is
  re-included with `!.env.example`, so the documented template is tracked while real values never are.
- **0.2 pnpm workspace and base tsconfig.** `pnpm-workspace.yaml` lists `apps/*` and `packages/*`; the
  root `package.json` holds the scripts and dev tools, and `tsconfig.base.json` the strict settings every
  workspace extends. Learn: pnpm's `node_modules` is strict (a package can only import what it declares),
  `workspace:*` links a sibling package instead of downloading it, and `tsc -b` follows project
  references so the whole repo type-checks in dependency order.
- **0.3 `@arabic/shared`.** The error codes (with their HTTP statuses) and the CEFR levels live in one
  package that both the API and the web import. Learn: a code is a stable name the browser can switch
  on; the message is only for humans.
- **0.4 API skeleton.** `createApp()` builds the Express app without listening, so Supertest can call it
  without a port. Learn: separating "build" from "listen" is what makes the API testable.
- **0.5 web skeleton.** Vite + React + Tailwind. The dev server proxies `/api` to the API, so the browser
  only ever talks to one origin and cookies need no CORS tricks. Learn: `strictPort` makes Vite fail
  instead of silently moving to another port, which would break the proxy and the Origin check.
- **0.6 lint, format, hooks.** ESLint (type-aware), Prettier, and a pre-commit hook that runs both on
  staged files. The files landed earlier (steps 0.2/0.3) because the gates needed them from the start.
  Learn: a hook is the last cheap line of defence; CI is the one that cannot be skipped.
- **0.7 docker compose.** Postgres 16 on `127.0.0.1:5434` with `fsync` off, plus a second database
  `arabic_test`. Learn: fsync forces every write to disk before answering. That is what protects real
  data after a crash, and it is pure waste for a database you can rebuild from the seed in seconds.
- **0.8 CI.** Parallel `check` and `test` jobs, cached pnpm store, older runs cancelled, and a gitleaks
  scan of the full history. Learn: a secret deleted in a later commit is still in history, so the scan
  reads history, not just the tip.
- **0.9 README stub.** The commands to run it.

### Quiz (phase 0)
1. Why does the Vite dev server proxy `/api` instead of the browser calling port 3002 directly?
2. What does `workspace:*` in a `package.json` mean, and why does pnpm refuse imports a package has not declared?
3. Why is `fsync=off` acceptable in `docker-compose.yml` but never in production?
