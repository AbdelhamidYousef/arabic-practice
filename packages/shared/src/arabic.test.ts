import { describe, expect, it } from 'vitest';

import {
  arabicLetterCount,
  countLatin,
  harakatRatio,
  hasLatin,
  isArabic,
  normalizeArabic,
  stripHarakat,
  tokenizeArabic,
} from './arabic.ts';

describe('stripHarakat', () => {
  it.each([
    ['كَتَبَ', 'كتب'], // fatha
    ['كِتَابٌ', 'كتاب'], // kasra, fatha, dammatan
    ['مُحَمَّدٌ', 'محمد'], // damma, shadda, dammatan
    ['مَدْرَسَةٌ', 'مدرسة'], // sukun
    ['كِتَابًا', 'كتابا'], // fathatan
    ['فِي الْبَيْتِ', 'في البيت'], // kasra, sukun, kasra; spaces kept
    ['هَٰذَا', 'هذا'], // superscript alef (U+0670)
  ])('removes the marks from %s', (voweled, plain) => {
    expect(stripHarakat(voweled)).toBe(plain);
  });

  it('removes every mark in the U+064B to U+0652 range and U+0670, and nothing else', () => {
    const marks = [0x064b, 0x064c, 0x064d, 0x064e, 0x064f, 0x0650, 0x0651, 0x0652, 0x0670];
    for (const code of marks) {
      expect(stripHarakat(`ب${String.fromCharCode(code)}`)).toBe('ب');
    }
    // U+064A is ya and U+0653 is maddah above: neither is in the range.
    expect(stripHarakat('ي')).toBe('ي');
    expect(stripHarakat('ـ')).toBe('ـ'); // tatweel is not a haraka
  });

  it('leaves text without marks, Latin text and the empty string alone', () => {
    expect(stripHarakat('مرحبا')).toBe('مرحبا');
    expect(stripHarakat('Hello, 123')).toBe('Hello, 123');
    expect(stripHarakat('')).toBe('');
  });
});

describe('normalizeArabic', () => {
  it('folds the alef forms to a bare alef', () => {
    expect(normalizeArabic('أَحْمَد')).toBe('احمد'); // hamza above
    expect(normalizeArabic('إِسْلَام')).toBe('اسلام'); // hamza below
    expect(normalizeArabic('آمَنَ')).toBe('امن'); // madda
    expect(normalizeArabic('ٱللَّهِ')).toBe('الله'); // alef wasla
  });

  it('folds alef maqsura to ya', () => {
    expect(normalizeArabic('مُسْتَشْفًى')).toBe('مستشفي');
    expect(normalizeArabic('على')).toBe('علي');
    expect(normalizeArabic('إِلَى')).toBe('الي');
  });

  it('folds ta marbuta to ha, for matching only', () => {
    expect(normalizeArabic('مَدْرَسَةٌ')).toBe('مدرسه');
    expect(normalizeArabic('الْعَرَبِيَّةُ')).toBe('العربيه');
  });

  it('removes tatweel and harakat together', () => {
    expect(normalizeArabic('العـــربية')).toBe('العربيه');
    expect(normalizeArabic('مَـــرْحَـــبًـــا')).toBe('مرحبا');
  });

  it('makes a voweled lesson word equal to what a learner types', () => {
    expect(normalizeArabic('الْكِتَابُ')).toBe(normalizeArabic('الكتاب'));
    expect(normalizeArabic('مَدْرَسَة')).toBe(normalizeArabic('مدرسه'));
    expect(normalizeArabic('أَنَا')).toBe(normalizeArabic('انا'));
    expect(normalizeArabic('إِلَى')).toBe(normalizeArabic('الى'));
    expect(normalizeArabic('هَٰذَا')).toBe(normalizeArabic('هذا'));
  });

  it('keeps different words different', () => {
    expect(normalizeArabic('كتب')).not.toBe(normalizeArabic('كلب'));
    // Hamza on waw or ya is kept, so these two stay apart.
    expect(normalizeArabic('مُؤْمِن')).not.toBe(normalizeArabic('مُومِن'));
    expect(normalizeArabic('سَائِل')).toContain('ئ');
  });

  it('keeps ya and ha distinct from their folded partners where no folding applies', () => {
    expect(normalizeArabic('يد')).toBe('يد');
    expect(normalizeArabic('هو')).toBe('هو');
  });

  it('composes a decomposed madda before folding', () => {
    // alef (U+0627) followed by maddah above (U+0653) is the same text as آ (U+0622).
    expect(normalizeArabic('آمَنَ')).toBe('امن');
  });

  it('drops invisible direction marks and collapses whitespace', () => {
    expect(normalizeArabic('‏مَرْحَبًا‏')).toBe('مرحبا');
    expect(normalizeArabic('  كَيْفَ \n  حَالُكَ  ')).toBe('كيف حالك');
  });

  it('is idempotent and leaves non-Arabic text alone', () => {
    const once = normalizeArabic('أَهْلًا وَسَهْلًا بِكُمْ فِي الْمَدْرَسَةِ');
    expect(normalizeArabic(once)).toBe(once);
    expect(normalizeArabic('Hello World 42')).toBe('Hello World 42');
    expect(normalizeArabic('')).toBe('');
  });
});

describe('tokenizeArabic', () => {
  it('splits a sentence into words and keeps their harakat', () => {
    expect(tokenizeArabic('ذَهَبَ الطَّالِبُ إِلَى الْمَدْرَسَةِ.')).toEqual(['ذَهَبَ', 'الطَّالِبُ', 'إِلَى', 'الْمَدْرَسَةِ']);
  });

  it('splits on Arabic punctuation and ignores Latin words and digits', () => {
    expect(tokenizeArabic('مرحبا، كيف حالك؟ Fine 2024!')).toEqual(['مرحبا', 'كيف', 'حالك']);
    expect(tokenizeArabic('أنا (student) طالب')).toEqual(['أنا', 'طالب']);
  });

  it('returns nothing for empty, whitespace-only or non-Arabic text', () => {
    expect(tokenizeArabic('')).toEqual([]);
    expect(tokenizeArabic('   ')).toEqual([]);
    expect(tokenizeArabic('Hello')).toEqual([]);
  });

  it('treats tatweel as part of the word', () => {
    expect(tokenizeArabic('مـرحـبا بك')).toEqual(['مـرحـبا', 'بك']);
  });

  it('keeps the superscript alef inside its word', () => {
    expect(tokenizeArabic('هَٰذَا كِتَابٌ')).toEqual(['هَٰذَا', 'كِتَابٌ']);
  });
});

describe('isArabic', () => {
  it('accepts Arabic text, with or without harakat and punctuation', () => {
    expect(isArabic('مرحبا')).toBe(true);
    expect(isArabic('مَرْحَبًا بِكَ، كَيْفَ حَالُكَ؟')).toBe(true);
  });

  it('tolerates one borrowed word but not an English sentence', () => {
    expect(isArabic('أنا أحب الـ pizza كثيرا')).toBe(true);
    expect(isArabic('I like the word كتاب')).toBe(false);
  });

  it('rejects text with no Arabic letters', () => {
    expect(isArabic('')).toBe(false);
    expect(isArabic('hello')).toBe(false);
    expect(isArabic('12345 !?')).toBe(false);
    expect(isArabic('، ؟ ؛')).toBe(false);
  });
});

describe('harakatRatio', () => {
  it('is 0 without harakat and for text with no letters', () => {
    expect(harakatRatio('كتب')).toBe(0);
    expect(harakatRatio('')).toBe(0);
    expect(harakatRatio('Hello 123')).toBe(0);
  });

  it('is 1 when every letter has a mark', () => {
    expect(harakatRatio('كَتَبَ')).toBe(1);
  });

  it('counts the share of letters that carry a mark', () => {
    expect(harakatRatio('كَتب')).toBeCloseTo(1 / 3);
    expect(harakatRatio('كَتَب')).toBeCloseTo(2 / 3);
  });

  it('counts a letter once even with shadda plus a vowel', () => {
    // مُحَمَّد: four letters; the second م has shadda plus fatha (still one letter), the د has none.
    expect(harakatRatio('مُحَمَّد')).toBeCloseTo(3 / 4);
    expect(harakatRatio('مُحَمَّدٌ')).toBe(1);
  });

  it('leaves long-vowel letters unmarked, so fully voweled text is below 1', () => {
    // كِتَابٌ: ك ت ا ب -> the alef carries nothing.
    expect(harakatRatio('كِتَابٌ')).toBeCloseTo(3 / 4);
  });

  it('does not count tatweel as a letter and ignores Latin letters', () => {
    expect(harakatRatio('كَـتَبَ')).toBe(1);
    expect(harakatRatio('كَتَبَ book')).toBe(1);
  });

  it('counts the superscript alef as a mark', () => {
    expect(harakatRatio('هٰذا')).toBeCloseTo(1 / 3);
  });
});

describe('arabicLetterCount, hasLatin and countLatin', () => {
  it('counts letters but not marks, tatweel, digits or punctuation', () => {
    expect(arabicLetterCount('كِتَابٌ')).toBe(4);
    expect(arabicLetterCount('مـرحـبا 12 !')).toBe(5);
    expect(arabicLetterCount('')).toBe(0);
  });

  it('finds Latin letters, including accented ones', () => {
    expect(hasLatin('أنا student')).toBe(true);
    expect(hasLatin('café')).toBe(true);
    expect(hasLatin('أنا طالب 123 !')).toBe(false);
    expect(countLatin('ab مرحبا cd')).toBe(4);
    expect(countLatin('')).toBe(0);
  });
});
