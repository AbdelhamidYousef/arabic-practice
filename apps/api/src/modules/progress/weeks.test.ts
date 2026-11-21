import { describe, expect, it } from 'vitest';

import { formatDay, isoWeekStart, lastWeekStarts } from './weeks.ts';

describe('isoWeekStart', () => {
  it('maps any day of a week to its Monday', () => {
    // 2026-11-16 is a Monday.
    expect(formatDay(isoWeekStart(new Date('2026-11-16T00:00:00Z')))).toBe('2026-11-16');
    expect(formatDay(isoWeekStart(new Date('2026-11-18T13:30:00Z')))).toBe('2026-11-16');
    expect(formatDay(isoWeekStart(new Date('2026-11-22T23:59:59Z')))).toBe('2026-11-16');
    expect(formatDay(isoWeekStart(new Date('2026-11-23T00:00:00Z')))).toBe('2026-11-23');
  });

  it('crosses a year boundary', () => {
    // 2027-01-01 is a Friday: its week started on Monday 2026-12-28.
    expect(formatDay(isoWeekStart(new Date('2027-01-01T10:00:00Z')))).toBe('2026-12-28');
  });
});

describe('lastWeekStarts', () => {
  it('lists 8 consecutive Mondays, oldest first, ending with the current week', () => {
    const weeks = lastWeekStarts(new Date('2026-11-21T12:00:00Z'), 8).map(formatDay);
    expect(weeks).toHaveLength(8);
    expect(weeks[7]).toBe('2026-11-16');
    expect(weeks[0]).toBe('2026-09-28');
  });
});
