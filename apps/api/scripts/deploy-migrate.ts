import { fileURLToPath } from 'node:url';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

// Runs at the end of the Vercel build (see apps/web/vercel.json), so a production deploy can never
// ship code ahead of its migrations.
//
// - Only on production builds (`VERCEL_ENV=production`). Preview builds share the one Neon database,
//   so they must never migrate it.
// - It runs after the web and API builds succeeded, so a broken build leaves the database untouched.
//   The new code is promoted only after the whole build passes; migrations are additive, so the
//   code still serving traffic keeps working on the migrated schema for those seconds.
// - It uses the DIRECT (unpooled) Neon URL: migrations take an advisory lock and run DDL in a
//   transaction, which the pooled connection (PgBouncer in transaction mode) can't hold.
// - It does not import src/config/env.ts on purpose: that validates the whole runtime env, which a
//   build step neither needs nor should fail on.
const vercelEnv = process.env.VERCEL_ENV;
if (vercelEnv !== 'production') {
  console.log(`deploy-migrate: skipped (VERCEL_ENV=${vercelEnv ?? 'unset'})`);
  process.exit(0);
}

const url = process.env.DATABASE_URL_MIGRATE;
if (!url) {
  // Failing the build is the point: deploying without the migration is the bug this step prevents.
  console.error('deploy-migrate: DATABASE_URL_MIGRATE is not set for the production build');
  process.exit(1);
}

const migrationsFolder = fileURLToPath(new URL('../src/db/migrations', import.meta.url));
const sql = postgres(url, { max: 1, onnotice: () => {} });
try {
  await migrate(drizzle(sql), { migrationsFolder });
  console.log('deploy-migrate: migrations applied');
} finally {
  await sql.end({ timeout: 5 });
}
