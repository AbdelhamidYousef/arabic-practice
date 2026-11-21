import { a0Lessons } from './a0/index.ts';
import { a1Part1 } from './a1/part-1.ts';
import { a1Part2 } from './a1/part-2.ts';
import { a2Part1 } from './a2/part-1.ts';
import { a2Part2 } from './a2/part-2.ts';
import type { ContentLesson } from './types.ts';

export { contentUnits } from './units.ts';
export type { ContentLesson, ContentUnit, ContentVocab } from './types.ts';

// In course order: level, then unit, then lesson. A lesson's position within its unit is its
// index here among the lessons of that unit. Each level part has its own file, so content can be
// written in parallel lanes without touching the same file.
export const contentLessons: ContentLesson[] = [
  ...a0Lessons,
  ...a1Part1,
  ...a1Part2,
  ...a2Part1,
  ...a2Part2,
];
