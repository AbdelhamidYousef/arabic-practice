import type { LessonStep } from '@arabic/shared';
import { lessonStepSchema } from '@arabic/shared';
import { and, eq, inArray } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import { lessonProgress } from '../../db/schema/index.ts';

export interface LessonState {
  stepsDone: LessonStep[];
  practiceScore: number | null;
}

// The caller's progress per lesson id, for the given lessons (a lesson with no rows is absent).
export async function progressByLesson(
  userId: string,
  lessonIds: string[],
): Promise<Map<string, LessonState>> {
  const out = new Map<string, LessonState>();
  if (lessonIds.length === 0) return out;
  const rows = await db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), inArray(lessonProgress.lessonId, lessonIds)));
  for (const r of rows) {
    const step = lessonStepSchema.safeParse(r.step);
    if (!step.success) continue;
    const state = out.get(r.lessonId) ?? { stepsDone: [], practiceScore: null };
    state.stepsDone.push(step.data);
    if (step.data === 'practice') state.practiceScore = r.score;
    out.set(r.lessonId, state);
  }
  return out;
}
