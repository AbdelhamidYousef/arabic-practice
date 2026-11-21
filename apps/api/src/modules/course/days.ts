// Days are plain 'YYYY-MM-DD' strings: the learner's local date, as the browser sees it. All the
// arithmetic goes through UTC midnight, so daylight saving can never skip or repeat a day.
const DAY_MS = 24 * 60 * 60 * 1000;

const toMs = (day: string) => Date.parse(`${day}T00:00:00Z`);
const fromMs = (ms: number) => new Date(ms).toISOString().slice(0, 10);

export const utcDay = (now: Date) => fromMs(now.getTime());
export const addDays = (day: string, n: number) => fromMs(toMs(day) + n * DAY_MS);
export const dayDiff = (a: string, b: string) => Math.round((toMs(a) - toMs(b)) / DAY_MS);

// A real calendar date (2026-02-31 is not one), within one day of the server's UTC date. The
// browser's local date can differ from UTC by at most a day either way, and nothing wider is
// believable, so nobody can back-fill or pre-fill a streak.
export function isPlausibleDay(day: string, now: Date): boolean {
  const ms = toMs(day);
  if (Number.isNaN(ms) || fromMs(ms) !== day) return false;
  return Math.abs(dayDiff(day, utcDay(now))) <= 1;
}

// Consecutive days with activity, counting back from `day` (or from the day before when `day` has
// none yet, so the streak is still alive in the morning before today's first step).
export function streakEndingAt(activeDays: Iterable<string>, day: string): number {
  const active = new Set(activeDays);
  let cursor = active.has(day) ? day : addDays(day, -1);
  let streak = 0;
  while (active.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}
