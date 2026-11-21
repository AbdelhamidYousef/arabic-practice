import { describe, expect, it } from 'vitest';

import { ExerciseSchema, GrammarBlockSchema, LessonProgressRequestSchema } from './index.ts';

describe('ExerciseSchema', () => {
  it('accepts one exercise of every type', () => {
    const all = [
      { type: 'choose', prompt: 'p', options: ['ا', 'ب'], answer: 1 },
      {
        type: 'match',
        prompt: 'p',
        pairs: [
          { arabic: 'ا', english: 'a' },
          { arabic: 'ب', english: 'b' },
          { arabic: 'ت', english: 't' },
        ],
      },
      { type: 'build', prompt: 'p', english: 'e', words: ['أَنَا', 'طَالِبٌ'], distractors: [] },
      {
        type: 'gap',
        prompt: 'p',
        before: 'أَنَا',
        after: '',
        english: 'e',
        options: ['ا', 'ب'],
        answer: 0,
      },
      { type: 'listen', prompt: 'p', audio: 'بَابٌ', options: ['ا', 'ب'], answer: 0 },
    ];
    for (const e of all) expect(ExerciseSchema.safeParse(e).success).toBe(true);
  });

  it('rejects an answer outside the options, one option and an unknown type', () => {
    const base = { type: 'choose', prompt: 'p', options: ['ا', 'ب'] };
    expect(ExerciseSchema.safeParse({ ...base, answer: 2 }).success).toBe(false);
    expect(ExerciseSchema.safeParse({ ...base, options: ['ا'], answer: 0 }).success).toBe(false);
    expect(ExerciseSchema.safeParse({ type: 'essay', prompt: 'p' }).success).toBe(false);
  });
});

describe('course schemas', () => {
  it('parses the three grammar block kinds', () => {
    expect(GrammarBlockSchema.safeParse({ type: 'p', text: 'x' }).success).toBe(true);
    expect(
      GrammarBlockSchema.safeParse({ type: 'table', head: ['a'], rows: [['b']] }).success,
    ).toBe(true);
    expect(GrammarBlockSchema.safeParse({ type: 'example', arabic: 'ا' }).success).toBe(false);
  });

  it('wants a YYYY-MM-DD day and a 0 to 100 score on progress', () => {
    const ok = { step: 'practice', score: 80, day: '2026-11-21' };
    expect(LessonProgressRequestSchema.safeParse(ok).success).toBe(true);
    expect(LessonProgressRequestSchema.safeParse({ ...ok, day: '21/11/2026' }).success).toBe(false);
    expect(LessonProgressRequestSchema.safeParse({ ...ok, score: 101 }).success).toBe(false);
    expect(LessonProgressRequestSchema.safeParse({ ...ok, step: 'quiz' }).success).toBe(false);
  });
});
