import type { Exercise } from '@arabic/shared';
import { describe, expect, it } from 'vitest';

import { contentLessons, contentUnits, type ContentLesson } from './index.ts';
import { assertValidContent, contentProblems } from './validate.ts';

const base = contentLessons.find((l) => l.slug === 'a1-greetings') as ContentLesson;

// A copy of the A1 sample with one change, so each test names the single rule it breaks.
function withLesson(change: (l: ContentLesson) => void): string[] {
  const copy = structuredClone(base);
  change(copy);
  return contentProblems([copy], contentUnits);
}

function withExercise(e: Exercise, drop = false): string[] {
  return withLesson((l) => {
    l.exercises = drop ? [e] : [...l.exercises, e];
  });
}

describe('content files', () => {
  it('are all valid', () => {
    expect(contentProblems(contentLessons, contentUnits)).toEqual([]);
    expect(() => assertValidContent(contentLessons, contentUnits)).not.toThrow();
  });

  it('start with the first A0 lesson and include the A1 sample', () => {
    const slugs = contentLessons.map((l) => l.slug);
    expect(slugs[0]).toBe('a0-letters-alif-ba');
    expect(slugs).toContain('a1-greetings');
    expect(contentLessons[0]?.kind).toBe('letters');
  });
});

describe('contentProblems: lesson rules', () => {
  it('wants at least 6 words and 6 exercises with 3 different types', () => {
    expect(withLesson((l) => (l.vocab = l.vocab.slice(0, 5))).join()).toMatch(/at least 6 words/);
    expect(withLesson((l) => (l.exercises = l.exercises.slice(0, 5))).join()).toMatch(
      /at least 6 exercises/,
    );
    expect(
      withLesson(
        (l) =>
          (l.exercises = l.exercises.filter(
            (e) =>
              e.type !== 'match' && e.type !== 'listen' && e.type !== 'build' && e.type !== 'gap',
          )),
      ).join(),
    ).toMatch(/at least 3 different types/);
  });

  it('wants Arabic with no Latin letters in vocabulary and the opening line', () => {
    expect(withLesson((l) => (l.openingLine = 'Hello! مَرْحَبًا')).join()).toMatch(/Latin letters/);
    expect(withLesson((l) => (l.vocab[0]!.arabic = 'hello')).join()).toMatch(/no Arabic letters/);
  });

  it('wants harakat on the vocabulary and the opening line', () => {
    expect(withLesson((l) => (l.vocab[0]!.arabic = 'مرحبا')).join()).toMatch(/full harakat/);
    expect(withLesson((l) => (l.openingLine = 'السلام عليكم')).join()).toMatch(/full harakat/);
  });

  it('wants a non-empty Latin transliteration', () => {
    expect(withLesson((l) => (l.vocab[0]!.translit = '')).join()).toMatch(/translit: is empty/);
    expect(withLesson((l) => (l.vocab[0]!.translit = 'مرحبا')).join()).toMatch(
      /Latin letters only/,
    );
    expect(withLesson((l) => (l.vocab[0]!.translit = '123')).join()).toMatch(/Latin letters only/);
  });

  it('refuses duplicate words that differ only in harakat', () => {
    expect(withLesson((l) => (l.vocab[1] = { ...l.vocab[0]!, arabic: 'مَرْحَبًا' })).join()).toMatch(
      /duplicate word/,
    );
  });

  it('refuses Arabic letters in an English field', () => {
    expect(withLesson((l) => (l.vocab[0]!.english = 'مرحبا')).join()).toMatch(/contains Arabic/);
  });

  it('refuses an unknown unit, a bad slug and a duplicate slug', () => {
    expect(withLesson((l) => (l.unit = 'A9.9')).join()).toMatch(/does not exist/);
    expect(withLesson((l) => (l.slug = 'Bad Slug')).join()).toMatch(/kebab-case/);
    expect(contentProblems([base, base], contentUnits).join()).toMatch(/duplicate lesson slug/);
  });
});

describe('contentProblems: exercise rules', () => {
  it('wants the answer to be an index into the options', () => {
    const e = (answer: number): Exercise => ({
      type: 'choose',
      prompt: 'p',
      options: ['مَرْحَبًا', 'شُكْرًا'],
      answer,
    });
    expect(withExercise(e(1))).toEqual([]);
    expect(withExercise(e(2)).join()).toMatch(/not an index/);
    expect(withExercise(e(-1)).join()).toMatch(/not an index/);
  });

  it('wants unique options', () => {
    const e: Exercise = { type: 'choose', prompt: 'p', options: ['شُكْرًا', 'شُكْرًا'], answer: 0 };
    expect(withExercise(e).join()).toMatch(/duplicate option/);
  });

  it('wants a build with words, and no distractor that is an answer word', () => {
    const empty: Exercise = {
      type: 'build',
      prompt: 'p',
      english: 'e',
      words: [],
      distractors: [],
    };
    expect(withExercise(empty).join()).toMatch(/words: is empty/);
    const clash: Exercise = {
      type: 'build',
      prompt: 'p',
      english: 'e',
      words: ['أَنَا', 'آدَمُ'],
      distractors: ['أَنَا'],
    };
    expect(withExercise(clash).join()).toMatch(/also an answer word/);
  });

  it('wants unique sides in a match', () => {
    const pairs = (a: string, b: string) => [
      { arabic: 'مَرْحَبًا', english: 'hello' },
      { arabic: a, english: b },
      { arabic: 'بِخَيْرٍ', english: 'fine' },
    ];
    expect(withExercise({ type: 'match', prompt: 'p', pairs: pairs('شُكْرًا', 'thanks') })).toEqual(
      [],
    );
    expect(
      withExercise({ type: 'match', prompt: 'p', pairs: pairs('مَرْحَبًا', 'thanks') }).join(),
    ).toMatch(/duplicate Arabic side/);
    expect(
      withExercise({ type: 'match', prompt: 'p', pairs: pairs('شُكْرًا', 'Hello') }).join(),
    ).toMatch(/duplicate English side/);
  });

  it('wants a gap with text around it and Arabic options', () => {
    const gap: Exercise = {
      type: 'gap',
      prompt: 'p',
      before: '',
      after: '',
      english: 'e',
      options: ['شُكْرًا', 'عَفْوًا'],
      answer: 0,
    };
    expect(withExercise(gap).join()).toMatch(/before or after/);
    expect(withExercise({ ...gap, after: 'x', options: ['a', 'b'] }).join()).toMatch(
      /Arabic|Latin/,
    );
  });

  it('wants the read-aloud text to be the correct option of a listen exercise', () => {
    const listen = (answer: number): Exercise => ({
      type: 'listen',
      prompt: 'p',
      audio: 'شُكْرًا',
      options: ['شُكْرًا', 'عَفْوًا'],
      answer,
    });
    expect(withExercise(listen(0))).toEqual([]);
    expect(withExercise(listen(1)).join()).toMatch(/read aloud/);
  });

  it('wants well-formed marks (a sukun cannot start a word)', () => {
    const e: Exercise = { type: 'choose', prompt: 'p', options: ['سْلَامٌ', 'شُكْرًا'], answer: 1 };
    expect(withExercise(e).join()).toMatch(/sukun/);
  });
});

describe('contentProblems: unit rules', () => {
  it('wants a code that is level.position and no two units at one place', () => {
    const unit = { code: 'A1.2', level: 'A1' as const, position: 1, title: 't', summary: 's' };
    expect(contentProblems([], [unit]).join()).toMatch(/level.position/);
    expect(contentProblems([], [{ ...unit, code: 'x' }]).join()).toMatch(/look like/);
    const dup = { ...unit, code: 'A1.1' };
    expect(contentProblems([], [dup, { ...dup, code: 'A1.1' }]).join()).toMatch(/duplicate unit/);
  });
});
