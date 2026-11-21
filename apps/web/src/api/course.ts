import {
  CourseResponseSchema,
  LessonProgressResponseSchema,
  type CourseResponse,
  type LessonProgressRequest,
  type LessonProgressResponse,
} from '@arabic/shared';

import { apiFetch } from './client';

export type {
  CourseLesson,
  CourseResponse,
  CourseUnit,
  LessonProgressRequest,
  LessonProgressResponse,
  LessonStep,
} from '@arabic/shared';

/** `GET /course?day=`: the path, next up and the stats counted on the learner's local day. */
export function fetchCourse(day: string, signal?: AbortSignal): Promise<CourseResponse> {
  return apiFetch(`/course?day=${encodeURIComponent(day)}`, {
    schema: CourseResponseSchema,
    ...(signal && { signal }),
  });
}

/** `POST /lessons/:slug/progress`: one finished step; XP only the first time. */
export function postLessonProgress(
  slug: string,
  body: LessonProgressRequest,
): Promise<LessonProgressResponse> {
  return apiFetch(`/lessons/${encodeURIComponent(slug)}/progress`, {
    method: 'POST',
    body,
    schema: LessonProgressResponseSchema,
  });
}
