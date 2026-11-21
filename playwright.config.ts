import { defineConfig, devices } from '@playwright/test';

// The e2e suite drives the real app on ports of its own, so it never collides with (or silently
// reuses) a `pnpm dev` session: 3102 for the API, 5275 for the web app (`vite preview` of the
// production build, the same code that ships). `reuseExistingServer` is off on purpose: a stale
// server from an earlier run once gave false results, so a busy port fails the run instead.
//
// The API runs with NODE_ENV=test: the FAKE AI provider answers (no Gemini call, ever, whatever
// keys the machine holds) and the test-only /api/v1/test/reset-limits route exists. It reads a
// database of its own, `arabic_e2e`, which e2e/global-setup.ts migrates and seeds before the run.
//   local: docker exec arabic-postgres-1 psql -U arabic -d arabic -c 'CREATE DATABASE arabic_e2e'
//   CI:    E2E_DATABASE_URL points at the Postgres service.
const API_PORT = process.env.E2E_API_PORT ?? '3102';
const WEB_PORT = process.env.E2E_WEB_PORT ?? '5275';
const WEB_ORIGIN = `http://localhost:${WEB_PORT}`;
const DATABASE_URL =
  process.env.E2E_DATABASE_URL ?? 'postgres://arabic:arabic@localhost:5434/arabic_e2e';

// Read by e2e/global-setup.ts and the helpers (set before the workers start).
process.env.E2E_DATABASE_URL = DATABASE_URL;
process.env.E2E_API_URL = `http://localhost:${API_PORT}`;
process.env.E2E_WEB_ORIGIN = WEB_ORIGIN;

// Each guest may take this many turns a day on the e2e API (the production default is 20); the
// limits spec sends one more than this and expects the daily-limit message.
export const E2E_GUEST_TURN_CAP = 3;

// The browser Playwright downloaded for its own version is the default (CI runs
// `playwright install --with-deps chromium`). Locally the installed build can be older: point
// E2E_CHROMIUM_PATH at its binary to use that instead.
const executablePath = process.env.E2E_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: WEB_ORIGIN,
    // Kept only for failed tests, so a green run uploads nothing; CI attaches them as artifacts.
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    ...(executablePath ? { launchOptions: { executablePath } } : {}),
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'pnpm --filter @arabic/api exec tsx src/index.ts',
      env: {
        NODE_ENV: 'test',
        PORT: API_PORT,
        DATABASE_URL,
        // NODE_ENV=test makes the API read this one instead.
        DATABASE_URL_TEST: DATABASE_URL,
        // The CSRF check compares the browser's Origin with this.
        WEB_ORIGIN,
        LOG_LEVEL: 'warn',
        AI_PROVIDER: 'fake',
        // Empty means unset: even a key in the repo .env cannot reach this process.
        GEMINI_API_KEY: '',
        AI_ENABLED: 'true',
        AI_DAILY_TURNS_GUEST: String(E2E_GUEST_TURN_CAP),
        INVITES_ENABLED: 'false',
        // Many tests, one IP: the default limits (300 requests a minute, 10 guests an hour) would
        // trip. The limits spec is about the daily AI cap, not these.
        RATE_LIMIT_MAX: '10000',
        RATE_LIMIT_AUTH_MAX: '1000',
        RATE_LIMIT_GUEST_MAX: '1000',
        // The database-backed guest limits (per network per hour, per day) count across runs too.
        GUESTS_PER_IP_PER_HOUR: '100000',
        GUESTS_PER_DAY: '100000',
      },
      url: `http://localhost:${API_PORT}/api/v1/health`,
      reuseExistingServer: false,
      timeout: 60_000,
    },
    {
      // Serves apps/web/dist: `pnpm e2e` builds it first, CI has its own build step.
      command: `pnpm --filter @arabic/web exec vite preview --port ${WEB_PORT} --strictPort`,
      env: { API_PROXY_TARGET: `http://localhost:${API_PORT}` },
      url: WEB_ORIGIN,
      reuseExistingServer: false,
      timeout: 60_000,
    },
  ],
});
