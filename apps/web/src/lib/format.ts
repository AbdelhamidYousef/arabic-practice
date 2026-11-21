const dateTime = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });
const date = new Intl.DateTimeFormat('en', { dateStyle: 'medium' });
const shortDate = new Intl.DateTimeFormat('en', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});
const number = new Intl.NumberFormat('en');

export const formatDateTime = (iso: string): string => dateTime.format(new Date(iso));
export const formatDate = (iso: string): string => date.format(new Date(iso));
/** `2026-03-02` (a UTC day) as "Mar 2". */
export const formatDay = (day: string): string => shortDate.format(new Date(`${day}T00:00:00Z`));
export const formatNumber = (n: number): string => number.format(n);
/** The API counts money in millionths of a dollar. */
export const formatUsd = (micro: number): string => `$${(micro / 1_000_000).toFixed(4)}`;
