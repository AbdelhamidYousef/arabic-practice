import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { env } from '../config/env.ts';

import { assertTestDatabase } from './guard.ts';

// Runs once per `vitest run`, before any test file: brings the test database to the latest
// migration. It builds its own connection (rather than importing db/client.ts) because it runs
// outside the test workers, where NODE_ENV may not be set yet.
export async function setup(): Promise<void> {
  const url = env.DATABASE_URL_TEST;
  if (!url) throw new Error('DATABASE_URL_TEST is not set; copy it from .env.example');
  const sql = postgres(url, { max: 1, onnotice: () => undefined });
  try {
    const [row] = await sql<{ name: string }[]>`select current_database() as name`;
    assertTestDatabase(row?.name, 'migrate');
    await migrate(drizzle(sql), {
      migrationsFolder: new URL('../db/migrations', import.meta.url).pathname,
    });
  } finally {
    await sql.end();
  }
}
