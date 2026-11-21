import { describe, expect, it } from 'vitest';

import { diffWords } from './arabic-diff.ts';

const changed = (original: string, corrected: string) =>
  diffWords(original, corrected)
    .filter((w) => w.changed)
    .map((w) => w.text);

describe('diffWords', () => {
  it('flags nothing when the sentence is the same', () => {
    expect(changed('أنا طالب', 'أنا طالب')).toEqual([]);
  });

  it('returns the corrected words in order, harakat kept', () => {
    expect(diffWords('أنا طالب', 'أَنَا طَالِبٌ').map((w) => w.text)).toEqual(['أَنَا', 'طَالِبٌ']);
  });

  it('does not flag a word that only gained harakat', () => {
    expect(changed('انا طالب', 'أَنَا طَالِبٌ')).toEqual([]);
  });

  it('flags only the replaced word', () => {
    expect(changed('ذهبت الى المدرسه', 'ذَهَبْتُ إِلَى الْمَدْرَسَةِ')).toEqual([]);
    expect(changed('ذهبت الى البيت الكبير', 'ذَهَبْتُ إِلَى الْبَيْتِ الصَّغِيرِ')).toEqual(['الصَّغِيرِ']);
    expect(changed('هذا كتاب الجديد', 'هذا الكتاب الجديد')).toEqual(['الكتاب']);
  });

  it('does not flag a hamza or ta marbuta difference (the mistakes list names those)', () => {
    expect(changed('اكلت التفاحه', 'أكلت التفاحة')).toEqual([]);
  });

  it('flags an inserted word without flagging what follows it', () => {
    expect(changed('أحب القهوة', 'أنا أحب القهوة')).toEqual(['أنا']);
  });

  it('flags every word of a fully different sentence', () => {
    expect(changed('قهوة', 'شاي ساخن')).toEqual(['شاي', 'ساخن']);
  });

  it('keeps punctuation with its word and matches it by the Arabic part', () => {
    const diff = diffWords('كيف حالك', 'كَيْفَ حَالُكَ؟');
    expect(diff.map((w) => w.text)).toEqual(['كَيْفَ', 'حَالُكَ؟']);
    expect(diff.some((w) => w.changed)).toBe(false);
  });

  it('handles empty input', () => {
    expect(diffWords('', '')).toEqual([]);
    expect(changed('', 'مرحبا')).toEqual(['مرحبا']);
    expect(diffWords('مرحبا', '')).toEqual([]);
  });

  it('flags nothing when the learner only repeated a word', () => {
    expect(changed('أنا أنا طالب', 'أنا طالب')).toEqual([]);
  });
});
