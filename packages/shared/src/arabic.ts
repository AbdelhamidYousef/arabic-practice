// Arabic text helpers. Arabic carries its short vowels and other marks as separate combining
// characters (harakat) placed after the letter they belong to. Teachers write them, most learners
// do not, and a learner's "كتاب" must still match the lesson's "كِتَابٌ". Everything that compares
// Arabic text therefore goes through normalizeArabic() instead of raw string equality.

// U+064B..U+0652: tanwin (fathatan, dammatan, kasratan), fatha, damma, kasra, shadda, sukun.
// U+0670: superscript (dagger) alef, the short alef written above the letter in words like هٰذا.
const HARAKAT_CLASS = '\\u064B-\\u0652\\u0670';
const HARAKAT = new RegExp(`[${HARAKAT_CLASS}]`, 'g');
const HAS_HARAKA = new RegExp(`[${HARAKAT_CLASS}]`);

// U+0640 tatweel (kashida): a stretching glyph that changes how a word looks and nothing else.
const TATWEEL = /ـ/g;

// Invisible direction marks (ZWNJ, ZWJ, LRM, RLM, Arabic letter mark) that come along when text is
// pasted from a web page. They would make two identical words compare unequal.
const INVISIBLE = /[‌-‏؜]/g;

// Letters, tatweel and harakat: one run of these is one Arabic word. U+0621..U+064A holds the whole
// alphabet including hamza, tatweel (0640), and U+064B..U+0652 the harakat; 0670/0671 are the
// superscript alef and alef wasla. Arabic punctuation (، ؛ ؟) sits outside the range, so it splits words.
const WORD = /[ء-ْٰٱ]+/g;

// Base letters only: no tatweel (0640), no marks.
const LETTER_WITH_MARKS = new RegExp(
  `([\\u0621-\\u063A\\u0641-\\u064A\\u0671])([${HARAKAT_CLASS}\\u0640]*)`,
  'g',
);
const ARABIC_LETTER = /[ء-غف-يٱ]/g;

export function stripHarakat(text: string): string {
  return text.replace(HARAKAT, '');
}

// The form used for matching, never for display. It folds only the differences a learner (or a
// keyboard) makes without changing the word:
//   - harakat, tatweel and invisible marks are removed;
//   - alef with hamza above/below (أ إ), alef with madda (آ) and alef wasla (ٱ) become a bare alef (ا);
//   - alef maqsura (ى) becomes ya (ي), since the two are written alike in much handwriting and typing;
//   - ta marbuta (ة) becomes ha (ه), the same shape without the dots, as at the end of مدرسة / مدرسه.
// Hamza on waw or ya (ؤ ئ) is left alone: dropping it would merge different words (مؤمن / مومن).
export function normalizeArabic(text: string): string {
  return (
    // NFC first so a decomposed آ (alef + madda above) arrives as one character before folding.
    text
      .normalize('NFC')
      .replace(INVISIBLE, '')
      .replace(TATWEEL, '')
      .replace(HARAKAT, '')
      .replace(/[آأإٱ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

// The Arabic words of a text, as written (harakat kept). Latin words, digits and punctuation are
// not tokens. Combine with normalizeArabic() per token to compare against a vocabulary list.
export function tokenizeArabic(text: string): string[] {
  return text.normalize('NFC').replace(INVISIBLE, '').match(WORD) ?? [];
}

export function arabicLetterCount(text: string): number {
  return text.match(ARABIC_LETTER)?.length ?? 0;
}

const ANY_LETTER = /\p{L}/gu;

// True when the text is mainly Arabic: it has at least one Arabic letter and Arabic letters are
// more than half of all letters. A reply with one borrowed English word still counts; a sentence
// in English with an Arabic word in it does not.
export function isArabic(text: string): boolean {
  const arabic = arabicLetterCount(text);
  if (arabic === 0) return false;
  const letters = text.match(ANY_LETTER)?.length ?? arabic;
  return arabic * 2 > letters;
}

// Share of Arabic letters that carry at least one mark (0 to 1). Fully voweled text scores
// around 0.6 to 0.8, not 1, because long-vowel letters (ا و ي) take no mark of their own; text
// written without harakat scores 0. A letter with shadda plus a vowel still counts once.
export function harakatRatio(text: string): number {
  let letters = 0;
  let marked = 0;
  for (const [, , marks] of text.normalize('NFC').matchAll(LETTER_WITH_MARKS)) {
    letters += 1;
    if (marks !== undefined && HAS_HARAKA.test(marks)) marked += 1;
  }
  return letters === 0 ? 0 : marked / letters;
}

const LATIN = /\p{Script=Latin}/gu;

export function countLatin(text: string): number {
  return text.match(LATIN)?.length ?? 0;
}

export function hasLatin(text: string): boolean {
  return countLatin(text) > 0;
}
