import { describe, expect, it } from 'vitest';

import { baseSlugFor, firstFreeSlug, slugBase } from './slug.ts';

describe('slugBase', () => {
  it('makes kebab-case from a Latin title', () => {
    expect(slugBase('Ordering at a Bakery')).toBe('ordering-at-a-bakery');
  });

  it('folds accents and collapses punctuation and spaces', () => {
    expect(slugBase('  Café -- "au lait"!  ')).toBe('cafe-au-lait');
  });

  it('returns an empty string when nothing Latin is left', () => {
    expect(slugBase('في المخبز')).toBe('');
    expect(slugBase('!!!')).toBe('');
  });

  it('keeps Latin words next to Arabic ones', () => {
    expect(slugBase('Greetings - التحية')).toBe('greetings');
  });

  it('caps the length without leaving a trailing hyphen', () => {
    const slug = slugBase(`${'word '.repeat(40)}end`);
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith('-')).toBe(false);
  });
});

describe('baseSlugFor', () => {
  it('falls back to lesson-<short id> when the title has no Latin letters', () => {
    expect(baseSlugFor('في المخبز', 'abcdef12-0000-4000-8000-000000000000')).toBe(
      'lesson-abcdef12',
    );
  });
});

describe('firstFreeSlug', () => {
  it('returns the base when free and appends -2, -3 on conflict', () => {
    expect(firstFreeSlug('cafe', new Set())).toBe('cafe');
    expect(firstFreeSlug('cafe', new Set(['cafe']))).toBe('cafe-2');
    expect(firstFreeSlug('cafe', new Set(['cafe', 'cafe-2']))).toBe('cafe-3');
    expect(firstFreeSlug('cafe', new Set(['cafe', 'cafe-3']))).toBe('cafe-2');
  });
});
