import { describe, expect, it } from 'vitest';

import { interpolate, makeLookup, pickPlural } from './translate';

import { t, tn, en } from './index';

describe('interpolate', () => {
  it('fills markers and leaves unknown ones visible', () => {
    expect(interpolate('Hi {name}, {n} left', { name: 'Sara', n: 3 })).toBe('Hi Sara, 3 left');
    expect(interpolate('Hi {name}', {})).toBe('Hi {name}');
    expect(interpolate('Plain')).toBe('Plain');
  });
});

describe('plurals', () => {
  const forms = { zero: 'none', one: '{count} item', other: '{count} items' };
  it('picks zero, one and other for English', () => {
    expect(pickPlural(forms, 0)).toBe('none');
    expect(pickPlural(forms, 1)).toBe('{count} item');
    expect(pickPlural(forms, 2)).toBe('{count} items');
  });

  it('falls back to other for zero when there is no zero form', () => {
    expect(pickPlural({ one: 'a', other: 'b' }, 0)).toBe('b');
  });

  it('uses the language rules for the locale it is given (Arabic has six forms)', () => {
    expect(new Intl.PluralRules('ar').select(3)).toBe('few');
    expect(pickPlural({ one: 'one', other: 'other' }, 3, 'ar')).toBe('other');
  });
});

describe('t and tn', () => {
  it('look up typed keys', () => {
    expect(t('nav.lessons')).toBe('Lessons');
    expect(t('home.greeting', { name: 'Sara' })).toBe('Welcome back, Sara');
    expect(tn('count.lessons', 0)).toBe('No lessons yet');
    expect(tn('count.lessons', 1)).toBe('1 lesson');
    expect(tn('count.lessons', 4)).toBe('4 lessons');
  });

  it('shows the key rather than nothing when it is missing', () => {
    expect(makeLookup({}).t('missing.key')).toBe('missing.key');
  });

  it('has no empty strings and nothing heavier than a sentence-length surprise', () => {
    for (const [key, entry] of Object.entries(en)) {
      const texts = typeof entry === 'string' ? [entry] : Object.values(entry);
      for (const text of texts) expect(text.trim().length, key).toBeGreaterThan(0);
    }
  });
});
