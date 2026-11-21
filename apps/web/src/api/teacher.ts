import {
  CreateInviteResponseSchema,
  InviteListResponseSchema,
  TeacherLearnerDetailResponseSchema,
  TeacherLearnerListResponseSchema,
  TeacherLessonListResponseSchema,
  TeacherLessonResponseSchema,
  TeacherTranscriptResponseSchema,
  TeacherUsageResponseSchema,
  UpdateLearnerResponseSchema,
  type CefrLevel,
  type CreateInviteRequest,
  type CreateInviteResponse,
  type InviteListResponse,
  type TeacherLearnerDetailResponse,
  type TeacherLearnerListResponse,
  type TeacherLessonInput,
  type TeacherLessonListResponse,
  type TeacherLessonResponse,
  type TeacherTranscriptResponse,
  type TeacherUsageResponse,
  type UpdateLearnerResponse,
} from '@arabic/shared';
import { z } from 'zod';

import { apiFetch } from './client';

export type {
  Invite,
  TeacherLearnerSummary,
  TeacherLessonDetail,
  TeacherLessonSummary,
  TranscriptMessage,
} from '@arabic/shared';

const get = <S extends z.ZodType>(path: string, schema: S, signal?: AbortSignal) =>
  apiFetch(path, { schema, ...(signal && { signal }) });

export const fetchTeacherLessons = (signal?: AbortSignal): Promise<TeacherLessonListResponse> =>
  get('/teacher/lessons', TeacherLessonListResponseSchema, signal);

export const fetchTeacherLesson = (
  id: string,
  signal?: AbortSignal,
): Promise<TeacherLessonResponse> =>
  get(`/teacher/lessons/${encodeURIComponent(id)}`, TeacherLessonResponseSchema, signal);

export const createTeacherLesson = (input: TeacherLessonInput): Promise<TeacherLessonResponse> =>
  apiFetch('/teacher/lessons', {
    method: 'POST',
    body: input,
    schema: TeacherLessonResponseSchema,
  });

export const updateTeacherLesson = (
  id: string,
  input: TeacherLessonInput,
): Promise<TeacherLessonResponse> =>
  apiFetch(`/teacher/lessons/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: input,
    schema: TeacherLessonResponseSchema,
  });

export const deleteTeacherLesson = async (id: string): Promise<void> => {
  await apiFetch(`/teacher/lessons/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    schema: z.unknown(),
  });
};

export const fetchTeacherLearners = (signal?: AbortSignal): Promise<TeacherLearnerListResponse> =>
  get('/teacher/learners', TeacherLearnerListResponseSchema, signal);

export const fetchTeacherLearner = (
  id: string,
  signal?: AbortSignal,
): Promise<TeacherLearnerDetailResponse> =>
  get(`/teacher/learners/${encodeURIComponent(id)}`, TeacherLearnerDetailResponseSchema, signal);

export const setLearnerLevel = (id: string, level: CefrLevel): Promise<UpdateLearnerResponse> =>
  apiFetch(`/teacher/learners/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: { level },
    schema: UpdateLearnerResponseSchema,
  });

export const fetchTranscript = (
  id: string,
  signal?: AbortSignal,
): Promise<TeacherTranscriptResponse> =>
  get(`/teacher/conversations/${encodeURIComponent(id)}`, TeacherTranscriptResponseSchema, signal);

export const fetchInvites = (signal?: AbortSignal): Promise<InviteListResponse> =>
  get('/teacher/invites', InviteListResponseSchema, signal);

export const createInvite = (input: CreateInviteRequest): Promise<CreateInviteResponse> =>
  apiFetch('/teacher/invites', {
    method: 'POST',
    body: input,
    schema: CreateInviteResponseSchema,
  });

export const fetchUsage = (signal?: AbortSignal): Promise<TeacherUsageResponse> =>
  get('/teacher/usage', TeacherUsageResponseSchema, signal);
