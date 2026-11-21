import { lesson as lettersAlifBa } from './a0/01-letters-alif-ba.ts';
import { lesson as greetings } from './a1/01-greetings.ts';
import type { ContentLesson } from './types.ts';

export { contentUnits } from './units.ts';
export type { ContentLesson, ContentUnit, ContentVocab } from './types.ts';

// In course order: level, then unit, then lesson. A lesson's position within its unit is its
// index here among the lessons of that unit.
export const contentLessons: ContentLesson[] = [lettersAlifBa, greetings];
