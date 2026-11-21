import { afterAll, beforeAll, beforeEach } from 'vitest';

import { closeDb } from '../db/client.ts';

import { emptyDirtyTables, listTablesChildrenFirst } from './reset.ts';

let tables: string[] = [];

// The guard inside listTablesChildrenFirst runs here, once per file, before anything is deleted.
beforeAll(async () => {
  tables = await listTablesChildrenFirst();
});

// Every test starts from an empty database.
beforeEach(async () => {
  await emptyDirtyTables(tables);
});

afterAll(async () => {
  await closeDb();
});
