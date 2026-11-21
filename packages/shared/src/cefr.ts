import { z } from 'zod';

// The Common European Framework levels, lowest to highest. The order matters: it is the sort
// order of lessons and the scale the level-control prompts reason about.
export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const cefrLevelSchema = z.enum(CEFR_LEVELS);

export type CefrLevel = z.infer<typeof cefrLevelSchema>;

export const cefrLabel: Record<CefrLevel, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper intermediate',
  C1: 'Advanced',
  C2: 'Proficient',
};

// 0 for A1 up to 5 for C2, so levels can be compared with plain numbers.
export function cefrRank(level: CefrLevel): number {
  return CEFR_LEVELS.indexOf(level);
}
