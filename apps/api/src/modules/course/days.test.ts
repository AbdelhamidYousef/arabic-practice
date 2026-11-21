import { describe, expect, it } from 'vitest';

import { addDays, isPlausibleDay, streakEndingAt } from './days.ts';
import { xpForStep } from './xp.ts';

describe('xpForStep', () => {
  it('pays the fixed amounts and scales practice with the score', () => {
    expect(xpForStep('words', null)).toBe(5);
    expect(xpForStep('grammar', null)).toBe(3);
    expect(xpForStep('culture', null)).toBe(2);
    expect(xpForStep('talk', null)).toBe(10);
    expect(xpForStep('practice', 0)).toBe(5);
    expect(xpForStep('practice', 50)).toBe(10);
    expect(xpForStep('practice', 100)).toBe(15);
    expect(xpForStep('practice', 33)).toBe(8);
  });
});

describe('days', () => {
  const now = new Date('2026-11-21T10:00:00Z');

  it('adds days across month and year ends', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('accepts only real dates within a day of the server UTC date', () => {
    expect(isPlausibleDay('2026-11-21', now)).toBe(true);
    expect(isPlausibleDay('2026-11-20', now)).toBe(true);
    expect(isPlausibleDay('2026-11-22', now)).toBe(true);
    expect(isPlausibleDay('2026-11-23', now)).toBe(false);
    expect(isPlausibleDay('2026-11-19', now)).toBe(false);
    expect(isPlausibleDay('2026-02-31', now)).toBe(false);
  });

  it('counts consecutive days ending at the day or the day before', () => {
    const days = ['2026-11-21', '2026-11-20', '2026-11-19', '2026-11-17'];
    expect(streakEndingAt(days, '2026-11-21')).toBe(3);
    expect(streakEndingAt(days, '2026-11-22')).toBe(3);
    expect(streakEndingAt(days, '2026-11-23')).toBe(0);
    expect(streakEndingAt([], '2026-11-21')).toBe(0);
  });
});
