import type { CefrLevel } from './cefr.ts';

// What the AI partner may do at each CEFR level. These rules do three jobs: the reply prompt
// states them to the model, level-metrics.ts measures replies against them, and the evals (phase 11)
// use the same numbers as pass/fail thresholds. One table, so the prompt and the test cannot drift.
//
// The numbers are a teacher's judgement (a learner at A1 reads a 12-word sentence badly), not a
// standard: tune them here and everything follows.

/** How much vowel marking (harakat) the partner writes. */
export type HarakatPolicy =
  /** Every word fully voweled, as in a beginner textbook. */
  | 'full'
  /** Only words that would be ambiguous without marks (and the last letter is never forced). */
  | 'ambiguous'
  /** Plain text, as native writers write. */
  | 'none';

export interface LevelRules {
  level: CefrLevel;
  maxSentencesPerReply: number;
  maxWordsPerSentence: number;
  harakat: HarakatPolicy;
  /**
   * Minimum share of Arabic letters carrying a mark (see harakatRatio) when the policy is `full`.
   * Below 1 on purpose: long-vowel letters (ا و ي) take no mark, so even perfect text scores ~0.6 to 0.8.
   */
  minHarakatRatio: number;
  /** Tenses and moods the partner may use, in plain English for the prompt. */
  tenses: string[];
  /** Sentence structures the partner may use. */
  structures: string[];
  /** Guidance on word choice. */
  vocabulary: string;
  /** How corrections and explanations are pitched for this learner. */
  explanations: string;
}

export const levelRules: Record<CefrLevel, LevelRules> = {
  A0: {
    level: 'A0',
    maxSentencesPerReply: 2,
    maxWordsPerSentence: 4,
    harakat: 'full',
    minHarakatRatio: 0.55,
    tenses: ['nominal sentences with no verb', 'fixed greetings and polite phrases'],
    structures: [
      'greetings and one-line answers of 2 to 4 words',
      'simple yes/no questions',
      'single words and short fixed phrases',
    ],
    vocabulary:
      'only the words of the lesson and greetings-level words (hello, thanks, yes, no, name); nothing else, no idioms',
    explanations:
      'one very short sentence in plain English; no grammar terms at all; show the right form and say it back',
  },
  A1: {
    level: 'A1',
    maxSentencesPerReply: 2,
    maxWordsPerSentence: 6,
    harakat: 'full',
    minHarakatRatio: 0.55,
    tenses: ['present tense (indicative only)', 'nominal sentences with no verb'],
    structures: [
      'very short statements and yes/no questions',
      'question words such as ما, مَن, أين, كم',
      'possessive suffixes and the definite article ال',
    ],
    vocabulary:
      'the most common everyday words only; prefer the lesson vocabulary; no idioms and no rare words',
    explanations:
      'one very short sentence in plain English; no grammar terms beyond noun, verb, adjective; show the right form',
  },
  A2: {
    level: 'A2',
    maxSentencesPerReply: 3,
    maxWordsPerSentence: 8,
    harakat: 'full',
    minHarakatRatio: 0.55,
    tenses: ['present tense', 'simple past tense', 'nominal sentences'],
    structures: [
      'short statements, questions and simple requests',
      'simple connectors such as و, لكن, لأن',
      'noun-adjective agreement and basic idafa (noun phrases like كتاب الطالب)',
    ],
    vocabulary: 'everyday words; prefer the lesson vocabulary; no English inside the reply',
    explanations: 'one or two short sentences in plain English; name the rule in simple words',
  },
  B1: {
    level: 'B1',
    maxSentencesPerReply: 4,
    maxWordsPerSentence: 12,
    harakat: 'full',
    minHarakatRatio: 0.55,
    tenses: ['present, past and future (سَـ / سَوْفَ)', 'imperative', 'subjunctive after أَنْ'],
    structures: [
      'compound sentences with connectors',
      'relative clauses with الَّذِي / الَّتِي',
      'conditional sentences with إِذَا',
    ],
    vocabulary:
      'common vocabulary plus the lesson words; a few new words are fine when the meaning is clear from context',
    explanations: 'two or three sentences in plain English; the rule and one extra example',
  },
  B2: {
    level: 'B2',
    maxSentencesPerReply: 5,
    maxWordsPerSentence: 16,
    harakat: 'ambiguous',
    minHarakatRatio: 0,
    tenses: ['all common tenses and moods', 'passive voice'],
    structures: [
      'complex sentences with several clauses',
      'verbal nouns (المصدر) and participles',
      'conditionals of all kinds',
    ],
    vocabulary:
      'a broad everyday and abstract vocabulary; lesson words encouraged; light idioms allowed',
    explanations: 'a few sentences; grammar terms are fine; mention the register when it matters',
  },
  C1: {
    level: 'C1',
    maxSentencesPerReply: 6,
    maxWordsPerSentence: 22,
    harakat: 'none',
    minHarakatRatio: 0,
    tenses: ['every tense and mood', 'passive voice'],
    structures: [
      'long, flowing sentences and formal connectors',
      'rhetorical and idiomatic phrasing',
      'formal and colloquial-leaning registers when the lesson asks for them',
    ],
    vocabulary: 'rich vocabulary including formal and literary words',
    explanations: 'precise and brief; use grammar terms freely; point out nuance and style',
  },
  C2: {
    level: 'C2',
    maxSentencesPerReply: 8,
    maxWordsPerSentence: 30,
    harakat: 'none',
    minHarakatRatio: 0,
    tenses: ['every tense and mood'],
    structures: ['any structure a native writer uses, including classical and literary patterns'],
    vocabulary: 'unrestricted, including rare, literary and classical words',
    explanations: 'concise and expert; discuss nuance, register and style like a colleague',
  },
};

export function getLevelRules(level: CefrLevel): LevelRules {
  return levelRules[level];
}
