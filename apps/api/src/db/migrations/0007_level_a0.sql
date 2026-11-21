-- hand-written (drizzle-kit would not emit this from the enum change in the right shape): keep this file if the migration is regenerated.
-- Only adds the value; nothing here uses it (Postgres cannot use a new enum value in the transaction that adds it).
ALTER TYPE "public"."cefr_level" ADD VALUE 'A0' BEFORE 'A1';
