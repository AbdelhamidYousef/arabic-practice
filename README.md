# Arabic Practice

An AI-powered practice partner for learners of Modern Standard Arabic, built around real lessons.

**Work in progress.** This is a portfolio project; the plan lives in `docs/plan/`.

## Local setup

Needs Node 22 (`.nvmrc`), pnpm (via `corepack enable`) and Docker.

```sh
cp .env.example .env      # every variable is documented inside
pnpm install
docker compose up -d      # Postgres on 127.0.0.1:5434
pnpm dev                  # api on :3002, web on :5175
```

Checks before every commit:

```sh
pnpm typecheck && pnpm lint && pnpm format:check
pnpm -r --workspace-concurrency=1 test
```
