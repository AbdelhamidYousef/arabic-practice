import {
  countLatin,
  getLevelRules,
  harakatRatio,
  normalizeArabic,
  tokenizeArabic,
  type CefrLevel,
} from '@arabic/shared';

// Measures one partner reply against the level rules. Pure: no model, no database. Used by tests
// today and by the evals (phase 11) and a possible runtime warning later, so "did the partner stay
// at the learner's level?" is a number, not an opinion.

export type LevelViolation =
  'empty' | 'too_many_sentences' | 'sentence_too_long' | 'missing_harakat' | 'latin_letters';

export interface LevelMetrics {
  wordCount: number;
  sentenceCount: number;
  /** Words in the longest sentence. */
  longestSentence: number;
  /** Share of Arabic letters with a mark, 0 to 1 (see harakatRatio in @arabic/shared). */
  harakatRatio: number;
  /** How many DIFFERENT lesson words the reply used. */
  vocabHits: number;
  /** The lesson entries that were used (as the teacher wrote them). */
  vocabUsed: string[];
  /** Latin letters in the reply; a reply should be Arabic only. */
  latinChars: number;
  withinLevel: boolean;
  violations: LevelViolation[];
}

// Sentence ends: Latin and Arabic full stop, question marks, exclamation, ellipsis, line breaks.
const SENTENCE_END = /[.!?؟۔…\n]+/;

// Arabic attaches small words to the next word (و "and", ب "with", ال "the", ...), so a lesson word
// shows up as وَالْقَهْوَةُ inside a sentence. These prefixes are peeled off once when matching.
const PREFIXES = ['وال', 'بال', 'فال', 'كال', 'ولل', 'ال', 'لل', 'و', 'ف', 'ب', 'ل', 'ك'];

function matchesWord(token: string, vocab: string): boolean {
  if (token === vocab) return true;
  return PREFIXES.some((p) => token.startsWith(p) && token.slice(p.length) === vocab);
}

// A vocabulary entry may be a phrase ("صباح الخير"): then its words must appear in a row.
function usesEntry(tokens: string[], entry: string): boolean {
  const words = normalizeArabic(entry).split(' ').filter(Boolean);
  if (words.length === 0) return false;
  for (let i = 0; i + words.length <= tokens.length; i += 1) {
    if (words.every((w, j) => matchesWord(tokens[i + j] ?? '', w))) return true;
  }
  return false;
}

export function measureReply(input: {
  reply: string;
  level: CefrLevel;
  /** The lesson's vocabulary as written by the teacher (`arabic` column). */
  lessonVocab?: string[];
}): LevelMetrics {
  const { reply, level, lessonVocab = [] } = input;
  const rules = getLevelRules(level);

  const sentences = reply
    .split(SENTENCE_END)
    .map((s) => tokenizeArabic(s).length)
    .filter((n) => n > 0);
  const wordCount = tokenizeArabic(reply).length;
  const longestSentence = Math.max(0, ...sentences);
  const ratio = harakatRatio(reply);
  const latinChars = countLatin(reply);

  const tokens = tokenizeArabic(reply).map(normalizeArabic);
  const vocabUsed = lessonVocab.filter((entry) => usesEntry(tokens, entry));

  const violations: LevelViolation[] = [];
  if (wordCount === 0) violations.push('empty');
  if (sentences.length > rules.maxSentencesPerReply) violations.push('too_many_sentences');
  if (longestSentence > rules.maxWordsPerSentence) violations.push('sentence_too_long');
  if (rules.harakat === 'full' && wordCount > 0 && ratio < rules.minHarakatRatio) {
    violations.push('missing_harakat');
  }
  if (latinChars > 0) violations.push('latin_letters');

  return {
    wordCount,
    sentenceCount: sentences.length,
    longestSentence,
    harakatRatio: ratio,
    vocabHits: vocabUsed.length,
    vocabUsed,
    latinChars,
    withinLevel: violations.length === 0,
    violations,
  };
}
