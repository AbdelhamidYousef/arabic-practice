const DAY_MS = 24 * 3600 * 1000;

// The Monday 00:00 UTC of the ISO week containing `date`. Weeks are UTC on purpose: the same
// boundaries as the SQL `date_trunc('week', ... at time zone 'utc')`, whatever the server's zone.
export function isoWeekStart(date: Date): Date {
  const midnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const sinceMonday = (date.getUTCDay() + 6) % 7; // Sunday is 0 in JS
  return new Date(midnight - sinceMonday * DAY_MS);
}

export const formatDay = (date: Date) => date.toISOString().slice(0, 10);

// `count` consecutive week starts ending with the week of `now`, oldest first.
export function lastWeekStarts(now: Date, count: number): Date[] {
  const current = isoWeekStart(now).getTime();
  return Array.from({ length: count }, (_, i) => new Date(current - (count - 1 - i) * 7 * DAY_MS));
}
