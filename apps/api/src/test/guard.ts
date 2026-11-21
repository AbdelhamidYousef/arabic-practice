// Both the global setup (which migrates) and the per-test setup (which empties) refuse to touch
// anything that is not a *_test database: a stray DATABASE_URL must never get its rows deleted.
export function assertTestDatabase(name: string | undefined, action: string): void {
  if (!/_test$/.test(name ?? '')) {
    throw new Error(`refusing to ${action} "${name}": the test database name must end in _test`);
  }
}
