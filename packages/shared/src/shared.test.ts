import { describe, expect, it } from 'vitest';

import {
  cefrLabel,
  CEFR_LEVELS,
  cefrLevelSchema,
  cefrRank,
  ErrorCode,
  errorStatus,
} from './index.ts';

describe('cefr levels', () => {
  it('lists the seven levels in order and ranks them', () => {
    expect(CEFR_LEVELS).toEqual(['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2']);
    expect(cefrRank('A0')).toBe(0);
    expect(cefrRank('A1')).toBe(1);
    expect(cefrRank('C2')).toBe(6);
    expect(cefrRank('B1')).toBeLessThan(cefrRank('B2'));
  });

  it('has a label for every level and rejects unknown levels', () => {
    for (const level of CEFR_LEVELS) expect(cefrLabel[level]).toBeTruthy();
    expect(cefrLabel.A0).toBe('Starter');
    expect(cefrLevelSchema.safeParse('D1').success).toBe(false);
    expect(cefrLevelSchema.safeParse('B2').success).toBe(true);
  });
});

describe('error codes', () => {
  it('maps every code to an HTTP error status', () => {
    for (const code of Object.values(ErrorCode)) {
      expect(errorStatus[code]).toBeGreaterThanOrEqual(400);
      expect(errorStatus[code]).toBeLessThan(600);
    }
  });

  it('uses the statuses the API contract promises', () => {
    expect(errorStatus.DEMO_READ_ONLY).toBe(403);
    expect(errorStatus.INVITES_CLOSED).toBe(403);
    expect(errorStatus.AI_LIMIT_USER).toBe(429);
  });
});
