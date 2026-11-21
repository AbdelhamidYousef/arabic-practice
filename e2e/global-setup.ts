import { execFileSync } from 'node:child_process';

// Runs once per `playwright test`, after the API and web servers are up and before any spec:
// brings the e2e database to the current schema and seed (both idempotent), then clears today's AI
// usage so a previous run's calls never count against this run's caps.
export default async function globalSetup(): Promise<void> {
  const url = process.env.E2E_DATABASE_URL;
  if (!url) throw new Error('E2E_DATABASE_URL is not set (playwright.config.ts sets it)');
  const env = {
    ...process.env,
    NODE_ENV: 'development',
    DATABASE_URL: url,
    DATABASE_URL_TEST: url,
    LOG_LEVEL: 'warn',
  };
  for (const script of ['db:migrate', 'db:seed']) {
    execFileSync('pnpm', [script], { env, stdio: 'inherit' });
  }

  const res = await fetch(`${process.env.E2E_API_URL}/api/v1/test/reset-limits`, {
    method: 'POST',
    headers: { Origin: process.env.E2E_WEB_ORIGIN ?? '' },
  });
  if (res.status !== 204) throw new Error(`reset-limits answered ${res.status}`);
}
