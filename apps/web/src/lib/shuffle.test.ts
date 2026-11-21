import { describe, expect, it } from 'vitest';

import { shuffled, shuffledOrder } from './shuffle';

describe('shuffled', () => {
  it('gives the same order for the same seed', () => {
    expect(shuffled(['a', 'b', 'c', 'd', 'e'], 's1')).toEqual(
      shuffled(['a', 'b', 'c', 'd', 'e'], 's1'),
    );
  });

  it('keeps every item exactly once', () => {
    const out = shuffled(['a', 'b', 'c', 'd', 'e'], 'seed');
    expect([...out].sort()).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('changes the order for some other seed', () => {
    const base = shuffledOrder(6, 'x').join();
    const others = ['y', 'z', 'w', 'v'].map((s) => shuffledOrder(6, s).join());
    expect(others.some((o) => o !== base)).toBe(true);
  });

  it('does not change the input', () => {
    const input = [1, 2, 3];
    shuffled(input, 'q');
    expect(input).toEqual([1, 2, 3]);
  });
});
