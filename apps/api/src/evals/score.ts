import { CEFR_LEVELS, normalizeArabic, type CefrLevel } from '@arabic/shared';

import { measureReply, type LevelMetrics } from '../ai/level-metrics.ts';
import type { CorrectionResult } from '../ai/prompts/correction.ts';

// Pure scoring for the eval runs: no model, no files, no clock. The runner collects raw answers,
// these functions turn them into numbers, report.ts turns the numbers into markdown.

export interface CorrectionCase {
  id: string;
  level: CefrLevel;
  lessonSlug: string;
  text: string;
  expected: { isCorrect: boolean; types: string[]; mustContain: string[] };
}

export interface ReplyCase {
  id: string;
  level: CefrLevel;
  lessonSlug: string;
  learnerText: string;
}

/** What one correction call cost. Kept per call so the report can show p50/p90 and token totals. */
export interface CallStats {
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
}

export interface CorrectionScore {
  id: string;
  level: CefrLevel;
  expectedCorrect: boolean;
  predictedCorrect: boolean;
  /** The verdict (isCorrect) matches the case. */
  verdictRight: boolean;
  /** Wrong sentences with expected types only: some predicted mistake has an accepted type. null elsewhere. */
  typeRecall: boolean | null;
  /** Share of predicted mistakes whose type is accepted; null unless the case is wrong and has expected types and predictions. */
  typePrecision: number | null;
  predictedMistakes: number;
  acceptedMistakes: number;
  mustContainHits: number;
  mustContainTotal: number;
  /** Expected correct, but the model predicted mistakes (or said not correct). null for wrong sentences. */
  falseAlarm: boolean | null;
  /** Expected wrong and the model said so. null for correct sentences. */
  detected: boolean | null;
  /** Everything the teacher asked for holds: verdict, type and every mustContain word. */
  passed: boolean;
}

/** Compares the corrected sentence and the wanted words the way level-metrics does: after normalizeArabic. */
export function scoreCorrection(c: CorrectionCase, got: CorrectionResult): CorrectionScore {
  const accepted = new Set(c.expected.types);
  const predictedCorrect = got.isCorrect && got.mistakes.length === 0;
  const verdictRight = predictedCorrect === c.expected.isCorrect;
  const acceptedMistakes = got.mistakes.filter((m) => accepted.has(m.type)).length;
  const predictedMistakes = got.mistakes.length;
  const hasTypes = !c.expected.isCorrect && c.expected.types.length > 0;

  const correctedPlain = normalizeArabic(got.corrected);
  const mustContainTotal = c.expected.mustContain.length;
  const mustContainHits = c.expected.mustContain.filter((w) =>
    correctedPlain.includes(normalizeArabic(w)),
  ).length;

  const typeRecall = hasTypes ? acceptedMistakes > 0 : null;
  const typePrecision =
    hasTypes && predictedMistakes > 0 ? acceptedMistakes / predictedMistakes : null;
  const falseAlarm = c.expected.isCorrect ? !predictedCorrect : null;
  const detected = c.expected.isCorrect ? null : !predictedCorrect;

  return {
    id: c.id,
    level: c.level,
    expectedCorrect: c.expected.isCorrect,
    predictedCorrect,
    verdictRight,
    typeRecall,
    typePrecision,
    predictedMistakes,
    acceptedMistakes,
    mustContainHits,
    mustContainTotal,
    falseAlarm,
    detected,
    passed: verdictRight && typeRecall !== false && mustContainHits === mustContainTotal,
  };
}

export interface CorrectionAggregate {
  /** Scored cases (errors excluded). */
  n: number;
  /** Verdict accuracy over all scored cases. */
  accuracy: number | null;
  /** Share of correct sentences the model flagged. Lower is better. */
  falseAlarmRate: number | null;
  /** Share of wrong sentences the model flagged. Higher is better. */
  detectionRate: number | null;
  /** Share of wrong sentences (with expected types) that got at least one accepted type. */
  typeRecall: number | null;
  /** Accepted predicted mistakes over all predicted mistakes, on wrong sentences with expected types. */
  typePrecision: number | null;
  /** Wanted words found in the corrected sentence, over all wanted words. */
  mustContainRate: number | null;
  /** Share of cases where everything held. */
  passRate: number | null;
}

const ratio = (num: number, den: number): number | null => (den === 0 ? null : num / den);
const count = <T>(xs: T[], f: (x: T) => boolean) => xs.filter(f).length;
const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const mean = (xs: number[]): number | null => (xs.length === 0 ? null : sum(xs) / xs.length);

export function aggregateCorrections(scores: CorrectionScore[]): CorrectionAggregate {
  const correct = scores.filter((s) => s.expectedCorrect);
  const wrong = scores.filter((s) => !s.expectedCorrect);
  const withTypes = scores.filter((s) => s.typeRecall !== null);
  return {
    n: scores.length,
    accuracy: ratio(
      count(scores, (s) => s.verdictRight),
      scores.length,
    ),
    falseAlarmRate: ratio(
      count(correct, (s) => s.falseAlarm === true),
      correct.length,
    ),
    detectionRate: ratio(
      count(wrong, (s) => s.detected === true),
      wrong.length,
    ),
    typeRecall: ratio(
      count(withTypes, (s) => s.typeRecall === true),
      withTypes.length,
    ),
    typePrecision: ratio(
      sum(withTypes.map((s) => s.acceptedMistakes)),
      sum(withTypes.map((s) => s.predictedMistakes)),
    ),
    mustContainRate: ratio(
      sum(scores.map((s) => s.mustContainHits)),
      sum(scores.map((s) => s.mustContainTotal)),
    ),
    passRate: ratio(
      count(scores, (s) => s.passed),
      scores.length,
    ),
  };
}

const LEVELS: readonly CefrLevel[] = CEFR_LEVELS;

/** Levels present in the data, in CEFR order. */
function levelsOf(levels: CefrLevel[]): CefrLevel[] {
  return LEVELS.filter((l) => levels.includes(l));
}

export function correctionsByLevel(
  scores: CorrectionScore[],
): { level: CefrLevel; aggregate: CorrectionAggregate }[] {
  return levelsOf(scores.map((s) => s.level)).map((level) => ({
    level,
    aggregate: aggregateCorrections(scores.filter((s) => s.level === level)),
  }));
}

// --- replies ---

export interface ReplyScore {
  id: string;
  level: CefrLevel;
  reply: string;
  metrics: LevelMetrics;
}

export function scoreReply(c: ReplyCase, reply: string, lessonVocab: string[]): ReplyScore {
  return {
    id: c.id,
    level: c.level,
    reply,
    metrics: measureReply({ reply, level: c.level, lessonVocab }),
  };
}

export interface ReplyAggregate {
  n: number;
  withinLevelRate: number | null;
  /** Mean harakat ratio, 0 to 1. A1 to B1 should be high. */
  meanHarakatRatio: number | null;
  /** Replies that contain any Latin letter. */
  latinViolations: number;
  meanSentences: number | null;
  meanWords: number | null;
  meanLongestSentence: number | null;
  /** Mean number of different lesson words used per reply. */
  meanVocabHits: number | null;
  /** How often each violation occurred, across replies. */
  violations: Record<string, number>;
}

export function aggregateReplies(scores: ReplyScore[]): ReplyAggregate {
  const ms = scores.map((s) => s.metrics);
  const violations: Record<string, number> = {};
  for (const m of ms) for (const v of m.violations) violations[v] = (violations[v] ?? 0) + 1;
  return {
    n: scores.length,
    withinLevelRate: ratio(
      count(ms, (m) => m.withinLevel),
      ms.length,
    ),
    meanHarakatRatio: mean(ms.map((m) => m.harakatRatio)),
    latinViolations: count(ms, (m) => m.latinChars > 0),
    meanSentences: mean(ms.map((m) => m.sentenceCount)),
    meanWords: mean(ms.map((m) => m.wordCount)),
    meanLongestSentence: mean(ms.map((m) => m.longestSentence)),
    meanVocabHits: mean(ms.map((m) => m.vocabHits)),
    violations,
  };
}

export function repliesByLevel(
  scores: ReplyScore[],
): { level: CefrLevel; aggregate: ReplyAggregate }[] {
  return levelsOf(scores.map((s) => s.level)).map((level) => ({
    level,
    aggregate: aggregateReplies(scores.filter((s) => s.level === level)),
  }));
}

// --- calls ---

export interface CallSummary {
  calls: number;
  p50Ms: number | null;
  p90Ms: number | null;
  meanInputTokens: number | null;
  meanOutputTokens: number | null;
  totalInputTokens: number;
  totalOutputTokens: number;
}

/** Nearest-rank percentile of an unsorted list; null for an empty list. */
export function percentile(values: number[], p: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.max(1, Math.ceil((p / 100) * sorted.length));
  return sorted[rank - 1] ?? null;
}

export function summarizeCalls(calls: CallStats[]): CallSummary {
  return {
    calls: calls.length,
    p50Ms: percentile(
      calls.map((c) => c.latencyMs),
      50,
    ),
    p90Ms: percentile(
      calls.map((c) => c.latencyMs),
      90,
    ),
    meanInputTokens: mean(calls.map((c) => c.inputTokens)),
    meanOutputTokens: mean(calls.map((c) => c.outputTokens)),
    totalInputTokens: sum(calls.map((c) => c.inputTokens)),
    totalOutputTokens: sum(calls.map((c) => c.outputTokens)),
  };
}
