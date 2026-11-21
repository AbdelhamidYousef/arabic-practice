import type { LessonDetailResponse, LessonStep } from '@arabic/shared';
import { LESSON_STEPS } from '@arabic/shared';

import type { IconName } from '../../components/ui/Icon';
import type { StringKey } from '../../i18n';

export const STEP_META: Record<LessonStep, { icon: IconName; title: StringKey; body: StringKey }> =
  {
    words: { icon: 'cards', title: 'step.words', body: 'step.words.body' },
    practice: { icon: 'check', title: 'step.practice', body: 'step.practice.body' },
    grammar: { icon: 'blocks', title: 'step.grammar', body: 'step.grammar.body' },
    culture: { icon: 'globe', title: 'step.culture', body: 'step.culture.body' },
    talk: { icon: 'chat', title: 'step.talk', body: 'step.talk.body' },
  };

/** A course lesson has exercises; the older chat lessons and teacher-made ones have none. */
export function isCourseLesson(data: LessonDetailResponse): boolean {
  return data.exercises.length > 0;
}

/** The steps this lesson has content for, in lesson order. Talk is always there. */
export function stepsOf(data: LessonDetailResponse): LessonStep[] {
  const has: Record<LessonStep, boolean> = {
    words: data.vocab.length > 0,
    practice: data.exercises.length > 0,
    grammar: data.lesson.grammarNote.length > 0,
    culture: data.lesson.cultureTip !== null,
    talk: true,
  };
  return LESSON_STEPS.filter((s) => has[s]);
}

/** Where "Continue" goes: the first step not done yet, or null when every step is done. */
export function firstOpenStep(steps: readonly LessonStep[], done: readonly LessonStep[]) {
  return steps.find((s) => !done.includes(s)) ?? null;
}

/** Every step except the optional talk is done. */
export function isFinished(steps: readonly LessonStep[], done: readonly LessonStep[]): boolean {
  return steps.every((s) => s === 'talk' || done.includes(s));
}

export const learnPath = (slug: string, step: LessonStep | 'done') =>
  `/lessons/${encodeURIComponent(slug)}/learn/${step}`;
