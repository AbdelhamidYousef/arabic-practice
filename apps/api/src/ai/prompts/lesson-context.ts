import type { CefrLevel } from '@arabic/shared';

/**
 * The parts of a lesson the prompts use. A plain object (not a database row) so prompts stay pure
 * and testable, and phase 6 maps a lesson + its vocabulary onto it.
 * Everything here is written by the teacher, never by a learner, which is why it may appear in the
 * system instructions; learner text may not (see reply.ts).
 */
export interface LessonContext {
  title: string;
  level: CefrLevel;
  topic: string;
  /** What the partner plays, written for the model in English ("You are a shopkeeper..."). */
  scenario: string;
  grammarFocus: string;
  goals: string[];
  vocab: { arabic: string; english: string }[];
}

// A long list drowns the instructions and costs tokens on every turn.
export const MAX_VOCAB_IN_PROMPT = 40;

export function vocabLines(vocab: LessonContext['vocab']): string {
  return vocab
    .slice(0, MAX_VOCAB_IN_PROMPT)
    .map((v) => `- ${v.arabic} = ${v.english}`)
    .join('\n');
}
