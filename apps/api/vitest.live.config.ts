import { defineConfig } from 'vitest/config';

// Live provider tests only: no database setup, they need nothing but GEMINI_API_KEY from `.env`.
export default defineConfig({
  test: { include: ['src/**/*.live.test.ts'] },
});
