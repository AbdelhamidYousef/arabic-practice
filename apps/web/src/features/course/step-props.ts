import type { LessonDetailResponse } from '@arabic/shared';

/** What the player hands every step. */
export interface StepProps {
  data: LessonDetailResponse;
  /** The step is finished: record it (with the practice score) and move on. */
  onComplete: (score?: number) => void;
  /** How far through this step the learner is, 0..1, for the top progress bar. */
  onProgress: (fraction: number) => void;
  /** The progress post is on its way. */
  saving: boolean;
}
