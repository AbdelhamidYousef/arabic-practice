import { CEFR_LEVELS, harakatRatio, normalizeArabic, stripHarakat } from '@arabic/shared';
import { describe, expect, it } from 'vitest';

import { seedLessons } from './lessons.ts';
import { harakatProblems, validateLessons } from './validate.ts';

describe('seed lessons', () => {
  const lessons = validateLessons(seedLessons);

  it('has twelve lessons from A1 to B2 in a sensible order', () => {
    expect(lessons).toHaveLength(12);
    const levels = lessons.map((l) => l.level);
    expect(new Set(levels)).toEqual(new Set(['A1', 'A2', 'B1', 'B2']));
    const ranks = levels.map((l) => CEFR_LEVELS.indexOf(l));
    expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
  });

  it('covers the twelve topics of the plan', () => {
    expect(lessons.map((l) => l.slug)).toEqual([
      'greetings',
      'family',
      'cafe-order',
      'directions',
      'daily-routine',
      'shopping',
      'weather',
      'at-the-doctor',
      'travel-plans',
      'hobbies',
      'work-and-study',
      'news-headlines',
    ]);
  });

  it.each(lessons.map((l) => [l.slug, l] as const))(
    '%s has 8 to 12 well-formed, fully voweled vocabulary items',
    (_slug, lesson) => {
      expect(lesson.vocab.length).toBeGreaterThanOrEqual(8);
      expect(lesson.vocab.length).toBeLessThanOrEqual(12);
      for (const v of lesson.vocab) {
        expect(harakatProblems(v.arabic), v.arabic).toEqual([]);
        expect(harakatRatio(v.arabic), v.arabic).toBeGreaterThanOrEqual(0.5);
        expect(v.english.trim().length).toBeGreaterThan(0);
      }
      expect(new Set(lesson.vocab.map((v) => normalizeArabic(v.arabic))).size).toBe(
        lesson.vocab.length,
      );
    },
  );

  it.each(lessons.map((l) => [l.slug, l] as const))(
    '%s has an opening line with harakat and an English scenario',
    (_slug, lesson) => {
      expect(harakatProblems(lesson.openingLine)).toEqual([]);
      expect(harakatRatio(lesson.openingLine)).toBeGreaterThanOrEqual(0.5);
      expect(lesson.scenario).toMatch(/Arabic/);
      expect(lesson.goals.length).toBeGreaterThanOrEqual(2);
    },
  );

  it('uses only word forms that a stripped, normalised learner answer can match', () => {
    for (const lesson of lessons) {
      for (const v of lesson.vocab) {
        expect(normalizeArabic(stripHarakat(v.arabic))).toBe(normalizeArabic(v.arabic));
      }
    }
  });
});

describe('harakatProblems (the typo guard for hand-written marks)', () => {
  it('accepts well-formed words', () => {
    for (const w of ['كِتَابٌ', 'كِتَابًا', 'مُسْتَشْفًى', 'مُحَمَّدٌ', 'مَدْرَسَةٌ', 'الشَّمْسُ', 'هَٰذَا']) {
      expect(harakatProblems(w), w).toEqual([]);
    }
  });

  it('flags two vowels on one letter', () => {
    expect(harakatProblems('كَُتَبَ')).toContainEqual(expect.stringMatching(/two vowel marks/));
  });

  it('flags a mark with no letter, a leading sukun and a leading shadda', () => {
    expect(harakatProblems('َكتب')).toContainEqual(expect.stringMatching(/no letter/));
    expect(harakatProblems('كْتَبَ')).toContainEqual(expect.stringMatching(/start with a sukun/));
    expect(harakatProblems('كّتب')).toContainEqual(expect.stringMatching(/start with a shadda/));
  });

  it('flags tanwin in the middle of a word', () => {
    expect(harakatProblems('كِتٌابَ')).toContainEqual(expect.stringMatching(/tanwin/));
  });

  it('flags ta marbuta or alef maqsura away from the word end', () => {
    expect(harakatProblems('مَدْرَسَةَا')).toContainEqual(expect.stringMatching(/ta marbuta/));
    expect(harakatProblems('مُسْتَشْفَىا')).toContainEqual(expect.stringMatching(/alef maqsura/));
  });

  it('flags a repeated mark and a double shadda', () => {
    expect(harakatProblems('كَتَّّبَ')).toContainEqual(expect.stringMatching(/shadda|repeats/));
  });
});

describe('validateLessons', () => {
  const good = seedLessons[0]!;

  it('names the lesson and the problem when something is wrong', () => {
    const bad = { ...good, vocab: good.vocab.slice(0, 3) };
    expect(() => validateLessons([bad])).toThrow(/greetings/);
  });

  it('rejects a duplicate that differs only in harakat', () => {
    const dup = { ...good, vocab: [...good.vocab, { arabic: 'مَرْحَبَا', english: 'hi' }] };
    expect(() => validateLessons([dup])).toThrow(/duplicate vocabulary/);
  });

  it('rejects unvoweled vocabulary, Latin letters and duplicate slugs', () => {
    const plain = { ...good, vocab: [...good.vocab.slice(1), { arabic: 'كتاب', english: 'book' }] };
    expect(() => validateLessons([plain])).toThrow(/harakat/);
    const latin = {
      ...good,
      vocab: [...good.vocab.slice(1), { arabic: 'كِتَابٌ book', english: 'x' }],
    };
    expect(() => validateLessons([latin])).toThrow(/Latin/);
    expect(() => validateLessons([good, good])).toThrow(/duplicate seed lesson slug/);
  });
});
