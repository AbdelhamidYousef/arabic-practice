import {
  LessonDetailResponseSchema,
  LessonListResponseSchema,
  type LessonDetailResponse,
  type LessonListResponse,
} from '@arabic/shared';

import { apiFetch } from './client';

export type {
  LessonConversation,
  LessonDetailResponse,
  LessonListResponse,
  LessonSummary,
  LessonVocab,
} from '@arabic/shared';

export function fetchLessons(signal?: AbortSignal): Promise<LessonListResponse> {
  return apiFetch('/lessons', { schema: LessonListResponseSchema, ...(signal && { signal }) });
}

export function fetchLesson(slug: string, signal?: AbortSignal): Promise<LessonDetailResponse> {
  return apiFetch(`/lessons/${encodeURIComponent(slug)}`, {
    schema: LessonDetailResponseSchema,
    ...(signal && { signal }),
  });
}
