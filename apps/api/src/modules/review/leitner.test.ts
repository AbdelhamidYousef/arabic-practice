import { describe, expect, it } from 'vitest';

import { intervalDays, reviewCard } from './leitner.ts';

const now = new Date('2026-11-21T10:00:00Z');
const days = (n: number) => new Date(now.getTime() + n * 24 * 3600 * 1000);

describe('intervalDays', () => {
  it('is 1, 2, 4, 8, 16 days for boxes 1 to 5', () => {
    expect([1, 2, 3, 4, 5].map(intervalDays)).toEqual([1, 2, 4, 8, 16]);
  });

  it('rejects boxes outside 1 to 5', () => {
    expect(() => intervalDays(0)).toThrow(RangeError);
    expect(() => intervalDays(6)).toThrow(RangeError);
  });
});

describe('reviewCard', () => {
  it('moves a right answer up one box and waits the new box interval', () => {
    const next = reviewCard({ box: 1, reviews: 0, lapses: 0 }, true, now);
    expect(next).toMatchObject({ box: 2, reviews: 1, lapses: 0, lastReviewedAt: now });
    expect(next.dueAt).toEqual(days(2));
  });

  it('keeps a right answer in box 5 and waits 16 days', () => {
    const next = reviewCard({ box: 5, reviews: 9, lapses: 1 }, true, now);
    expect(next).toMatchObject({ box: 5, reviews: 10, lapses: 1 });
    expect(next.dueAt).toEqual(days(16));
  });

  it('sends a wrong answer back to box 1, counts a lapse and waits a day', () => {
    const next = reviewCard({ box: 4, reviews: 6, lapses: 2 }, false, now);
    expect(next).toMatchObject({ box: 1, reviews: 7, lapses: 3 });
    expect(next.dueAt).toEqual(days(1));
  });

  it('counts a lapse for a wrong answer even when already in box 1', () => {
    expect(reviewCard({ box: 1, reviews: 1, lapses: 0 }, false, now).lapses).toBe(1);
  });

  it('walks a card through every box with right answers', () => {
    let card = { box: 1, reviews: 0, lapses: 0 };
    const seen: number[] = [];
    for (let i = 0; i < 6; i++) {
      card = reviewCard(card, true, now);
      seen.push(card.box);
    }
    expect(seen).toEqual([2, 3, 4, 5, 5, 5]);
  });

  it('refuses a stored box that violates the 1 to 5 rule', () => {
    expect(() => reviewCard({ box: 9, reviews: 0, lapses: 0 }, true, now)).toThrow(RangeError);
  });
});
