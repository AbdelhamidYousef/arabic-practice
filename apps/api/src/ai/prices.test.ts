import { describe, expect, it } from 'vitest';

import { costMicroUsd, priceFor } from './prices.ts';

const call = { model: 'gemini-3.5-flash-lite', inputTokens: 1000, outputTokens: 500 };

describe('priceFor', () => {
  it('knows 3.5 flash-lite', () => {
    expect(priceFor('gemini-3.5-flash-lite')).toEqual({ inPerM: 0.3, outPerM: 2.5, known: true });
  });
  it('marks 3.1 flash-lite as an assumed price', () => {
    expect(priceFor('gemini-3.1-flash-lite')).toMatchObject({
      inPerM: 0.3,
      outPerM: 2.5,
      known: false,
    });
  });
  it('doubles the 3.6 / 3.8 flash price on 2027-01-01', () => {
    const intro = new Date('2026-12-31T23:59:59Z');
    const later = new Date('2027-01-01T00:00:00Z');
    expect(priceFor('gemini-3.6-flash', intro)).toMatchObject({ inPerM: 0.75, outPerM: 3.75 });
    expect(priceFor('gemini-3.8-flash', later)).toMatchObject({ inPerM: 1.5, outPerM: 7.5 });
  });
  it('prices an unlisted model at the highest known rate', () => {
    expect(priceFor('gemini-9')).toMatchObject({ inPerM: 1.5, outPerM: 7.5, known: false });
  });
});

describe('costMicroUsd', () => {
  it('is price per million tokens times tokens, in micro-USD', () => {
    // 1000 * 0.3 + 500 * 2.5 = 300 + 1250
    expect(costMicroUsd(call, 'paid')).toBe(1550);
  });
  it('rounds up fractions', () => {
    expect(
      costMicroUsd({ model: 'gemini-3.5-flash-lite', inputTokens: 1, outputTokens: 0 }, 'paid'),
    ).toBe(1);
  });
  it('is zero on the free tier', () => {
    expect(costMicroUsd(call, 'free')).toBe(0);
  });
});
