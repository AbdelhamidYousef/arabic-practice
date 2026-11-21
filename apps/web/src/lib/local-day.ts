// The learner's calendar date as their own clock shows it, `YYYY-MM-DD`. The API counts XP and
// streaks per local day (a 23:30 lesson in Cairo belongs to that day, not to tomorrow in UTC), so
// every progress post and the course request send this.
export function localDay(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
