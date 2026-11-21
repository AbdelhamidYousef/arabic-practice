import { describe, expect, it } from 'vitest';

import { CEFR_LEVELS, getLevelRules, levelRules } from './index.ts';

describe('level rules', () => {
  it('has a rule set for every level, labelled with its own level', () => {
    for (const level of CEFR_LEVELS) expect(getLevelRules(level).level).toBe(level);
    expect(Object.keys(levelRules)).toEqual([...CEFR_LEVELS]);
  });

  it('only gets looser as the level rises', () => {
    for (let i = 1; i < CEFR_LEVELS.length; i++) {
      const lower = getLevelRules(CEFR_LEVELS[i - 1]!);
      const higher = getLevelRules(CEFR_LEVELS[i]!);
      expect(higher.maxSentencesPerReply).toBeGreaterThanOrEqual(lower.maxSentencesPerReply);
      expect(higher.maxWordsPerSentence).toBeGreaterThan(lower.maxWordsPerSentence);
    }
  });

  it('requires full harakat at A0 to B1, ambiguous words at B2 and none from C1', () => {
    expect(CEFR_LEVELS.map((l) => getLevelRules(l).harakat)).toEqual([
      'full',
      'full',
      'full',
      'full',
      'ambiguous',
      'none',
      'none',
    ]);
    for (const l of ['A0', 'A1', 'A2', 'B1'] as const)
      expect(getLevelRules(l).minHarakatRatio).toBeGreaterThan(0);
  });

  it('describes tenses, structures, vocabulary and explanations for every level', () => {
    for (const l of CEFR_LEVELS) {
      const r = getLevelRules(l);
      expect(r.tenses.length).toBeGreaterThan(0);
      expect(r.structures.length).toBeGreaterThan(0);
      expect(r.vocabulary).not.toBe('');
      expect(r.explanations).not.toBe('');
    }
  });
});
