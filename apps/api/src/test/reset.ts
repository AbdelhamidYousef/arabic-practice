import { sql } from 'drizzle-orm';

import { db } from '../db/client.ts';

import { assertTestDatabase } from './guard.ts';

// Topological order: a table comes after every table that references it, so deleting in this order
// never trips a foreign key. A self-reference (users to users) is excluded by the caller; rows of
// one table are deleted in one statement, which Postgres checks at the end of the statement.
export function childrenFirst(names: string[], fks: { child: string; parent: string }[]): string[] {
  const order: string[] = [];
  const state = new Map<string, 'visiting' | 'done'>();
  const visit = (table: string) => {
    const seen = state.get(table);
    if (seen === 'done') return;
    if (seen === 'visiting') throw new Error(`foreign-key cycle through "${table}"`);
    state.set(table, 'visiting');
    for (const fk of fks) if (fk.parent === table) visit(fk.child);
    state.set(table, 'done');
    order.push(table);
  };
  names.forEach(visit);
  // `visit` pushes a table after its children, so `order` is already children first.
  return order;
}

// Reads the tables and their foreign keys from the database instead of hard-coding them, so a table
// added in a later phase is cleaned automatically. The migration journal lives in the `drizzle`
// schema and is untouched.
export async function listTablesChildrenFirst(): Promise<string[]> {
  const [row] = await db.execute<{ name: string }>(sql`select current_database() as name`);
  assertTestDatabase(row?.name, 'empty');
  const rows = await db.execute<{ tablename: string }>(
    sql`select tablename from pg_tables where schemaname = 'public'`,
  );
  const fks = await db.execute<{ child: string; parent: string }>(sql`
    select c.relname as child, p.relname as parent
    from pg_constraint k
    join pg_class c on c.oid = k.conrelid
    join pg_class p on p.oid = k.confrelid
    where k.contype = 'f' and k.connamespace = 'public'::regnamespace and k.conrelid <> k.confrelid
  `);
  return childrenFirst(
    rows.map((r) => r.tablename),
    fks,
  );
}

// DELETE, not TRUNCATE: TRUNCATE rebuilds every index of every table it names and Postgres fsyncs
// each rebuilt index, which cost ~0.7 s per table on a slow disk. A test leaves a few hundred rows
// at most, which DELETE clears in milliseconds. Only the tables that hold rows are touched (one
// probe query). Returns the tables it emptied.
export async function emptyDirtyTables(tables: string[]): Promise<string[]> {
  if (tables.length === 0) return [];
  const probe = tables.map((t) => `select '${t}' as t where exists (select 1 from "${t}")`);
  const dirty = new Set(
    (await db.execute<{ t: string }>(sql.raw(probe.join(' union all ')))).map((r) => r.t),
  );
  const emptied: string[] = [];
  for (const t of tables) {
    if (!dirty.has(t)) continue;
    await db.execute(sql.raw(`delete from "${t}"`));
    emptied.push(t);
  }
  return emptied;
}
