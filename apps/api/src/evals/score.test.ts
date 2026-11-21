import { describe, expect, it } from 'vitest';

import type { CorrectionResult } from '../ai/prompts/correction.ts';

import {
  aggregateCorrections,
  aggregateReplies,
  correctionsByLevel,
  percentile,
  scoreCorrection,
  scoreReply,
  summarizeCalls,
  type CorrectionCase,
} from './score.ts';

const wrongCase: CorrectionCase = {
  id: 'w1',
  level: 'A1',
  lessonSlug: 'family',
  text: 'عندي ثلاثة أخت',
  expected: { isCorrect: false, types: ['grammar', 'vocabulary'], mustContain: ['أخوات'] },
};
const okCase: CorrectionCase = {
  id: 'o1',
  level: 'A1',
  lessonSlug: 'family',
  text: 'عندي أخ',
  expected: { isCorrect: true, types: [], mustContain: [] },
};

const mistake = (type: CorrectionResult['mistakes'][number]['type']) => ({
  type,
  original: 'x',
  correction: 'y',
  explanation: 'z',
});
const result = (r: Partial<CorrectionResult>): CorrectionResult => ({
  isCorrect: false,
  corrected: '',
  mistakes: [],
  ...r,
});

describe('scoreCorrection', () => {
  it('scores a detected wrong sentence with an accepted type and the wanted word', () => {
    const s = scoreCorrection(
      wrongCase,
      result({
        corrected: 'عِنْدِي ثَلَاثُ أَخَوَاتٍ',
        mistakes: [mistake('grammar'), mistake('spelling')],
      }),
    );
    expect(s).toMatchObject({
      verdictRight: true,
      detected: true,
      falseAlarm: null,
      typeRecall: true,
      typePrecision: 0.5,
      mustContainHits: 1,
      mustContainTotal: 1,
      passed: true,
    });
  });

  it('compares mustContain after normalizeArabic (harakat, hamza forms)', () => {
    const s = scoreCorrection(
      { ...wrongCase, expected: { ...wrongCase.expected, mustContain: ['اخوات'] } },
      result({ corrected: 'أَخَوَاتٌ', mistakes: [mistake('grammar')] }),
    );
    expect(s.mustContainHits).toBe(1);
  });

  it('fails a wrong sentence called correct (missed) and a wrong type', () => {
    const missed = scoreCorrection(wrongCase, result({ isCorrect: true }));
    expect(missed).toMatchObject({
      verdictRight: false,
      detected: false,
      typeRecall: false,
      passed: false,
    });
    const wrongType = scoreCorrection(
      wrongCase,
      result({ corrected: 'أخوات', mistakes: [mistake('register')] }),
    );
    expect(wrongType).toMatchObject({
      verdictRight: true,
      typeRecall: false,
      typePrecision: 0,
      passed: false,
    });
  });

  it('flags a false alarm on a correct sentence, and treats isCorrect=false with no mistakes as not correct', () => {
    const alarm = scoreCorrection(okCase, result({ mistakes: [mistake('grammar')] }));
    expect(alarm).toMatchObject({
      falseAlarm: true,
      detected: null,
      typeRecall: null,
      passed: false,
    });
    const bare = scoreCorrection(okCase, result({ isCorrect: false }));
    expect(bare.predictedCorrect).toBe(false);
    const fine = scoreCorrection(okCase, result({ isCorrect: true, corrected: 'عندي أخ' }));
    expect(fine).toMatchObject({ falseAlarm: false, passed: true });
  });

  it('a wrong case with no expected types skips type scoring', () => {
    const s = scoreCorrection(
      { ...wrongCase, expected: { isCorrect: false, types: [], mustContain: [] } },
      result({ mistakes: [mistake('grammar')] }),
    );
    expect(s.typeRecall).toBeNull();
    expect(s.typePrecision).toBeNull();
    expect(s.passed).toBe(true);
  });
});

describe('aggregateCorrections', () => {
  const scores = [
    scoreCorrection(okCase, result({ isCorrect: true })),
    scoreCorrection(
      { ...okCase, id: 'o2', level: 'B1' },
      result({ mistakes: [mistake('grammar')] }),
    ),
    scoreCorrection(wrongCase, result({ corrected: 'أخوات', mistakes: [mistake('grammar')] })),
    scoreCorrection({ ...wrongCase, id: 'w2', level: 'B1' }, result({ isCorrect: true })),
  ];

  it('computes the headline rates', () => {
    const a = aggregateCorrections(scores);
    expect(a).toMatchObject({
      n: 4,
      accuracy: 0.5,
      falseAlarmRate: 0.5,
      detectionRate: 0.5,
      typeRecall: 0.5,
      typePrecision: 1,
      mustContainRate: 0.5,
      passRate: 0.5,
    });
  });

  it('breaks down per level in CEFR order', () => {
    const levels = correctionsByLevel(scores);
    expect(levels.map((l) => l.level)).toEqual(['A1', 'B1']);
    expect(levels[0]?.aggregate.accuracy).toBe(1);
    expect(levels[1]?.aggregate.accuracy).toBe(0);
  });

  it('gives null, not NaN, for an empty or one-sided set', () => {
    const a = aggregateCorrections([]);
    expect(a.accuracy).toBeNull();
    expect(aggregateCorrections([scores[0]!]).detectionRate).toBeNull();
  });
});

describe('replies and calls', () => {
  const good = 'أَهْلًا! كَيْفَ حَالُكَ؟';
  it('aggregates level metrics', () => {
    const a = scoreReply(
      { id: 'r1', level: 'A1', lessonSlug: 'greetings', learnerText: 'x' },
      good,
      ['أَهْلًا'],
    );
    const b = scoreReply(
      { id: 'r2', level: 'A1', lessonSlug: 'greetings', learnerText: 'x' },
      'hello مرحبا',
      [],
    );
    const agg = aggregateReplies([a, b]);
    expect(agg.n).toBe(2);
    expect(agg.withinLevelRate).toBe(0.5);
    expect(agg.latinViolations).toBe(1);
    expect(agg.violations.latin_letters).toBe(1);
    expect(agg.meanVocabHits).toBe(0.5);
    expect(aggregateReplies([]).withinLevelRate).toBeNull();
  });

  it('percentiles use the nearest rank', () => {
    expect(percentile([], 50)).toBeNull();
    expect(percentile([5, 1, 3, 2, 4], 50)).toBe(3);
    expect(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 90)).toBe(9);
  });

  it('summarizes calls', () => {
    const s = summarizeCalls([
      { latencyMs: 100, inputTokens: 10, outputTokens: 2 },
      { latencyMs: 300, inputTokens: 30, outputTokens: 4 },
    ]);
    expect(s).toMatchObject({
      calls: 2,
      p50Ms: 100,
      p90Ms: 300,
      meanInputTokens: 20,
      totalOutputTokens: 6,
    });
    expect(summarizeCalls([]).p50Ms).toBeNull();
  });
});
