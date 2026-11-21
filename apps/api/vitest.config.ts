import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Migrates the test database once before anything runs.
    globalSetup: ['./src/test/global-setup.ts'],
    // Empties the tables that hold rows before every test, in every file.
    setupFiles: ['./src/test/setup.ts'],
    // Integration tests share one Postgres database (from step 1.6); running files in parallel
    // would let one file's inserts or deletes leak into another.
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/test/**',
        'src/db/schema/**',
        'src/index.ts',
        'src/db/migrate.ts',
      ],
      reporter: ['text-summary', 'text', 'json-summary'],
    },
  },
});
