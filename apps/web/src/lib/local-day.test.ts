import { describe, expect, it } from 'vitest';

import { localDay } from './local-day';

describe('localDay', () => {
  it('formats the local date with zero-padded month and day', () => {
    expect(localDay(new Date(2026, 0, 5, 9, 30))).toBe('2026-01-05');
  });

  it('uses the local clock, so a late-evening time stays on the same day', () => {
    expect(localDay(new Date(2026, 10, 21, 23, 59))).toBe('2026-11-21');
    expect(localDay(new Date(2026, 10, 22, 0, 1))).toBe('2026-11-22');
  });

  it('defaults to now', () => {
    expect(localDay()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
