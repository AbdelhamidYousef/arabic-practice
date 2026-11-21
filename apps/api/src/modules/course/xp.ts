import type { LessonStep } from '@arabic/shared';

// XP is paid once per step, on its first completion (so repeating a lesson cannot farm points).
// Practice is worth more the better the score; the rest are flat.
export function xpForStep(step: LessonStep, score: number | null | undefined): number {
  switch (step) {
    case 'words':
      return 5;
    case 'practice':
      return 5 + Math.round((10 * (score ?? 0)) / 100);
    case 'grammar':
      return 3;
    case 'culture':
      return 2;
    case 'talk':
      return 10;
  }
}
