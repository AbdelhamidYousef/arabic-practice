import { ProgressResponseSchema, type ProgressResponse } from '@arabic/shared';

import { apiFetch } from './client';

export type { ProgressResponse, RecentMistake, ProgressWeek, MistakeType } from '@arabic/shared';

export function fetchProgress(signal?: AbortSignal): Promise<ProgressResponse> {
  return apiFetch('/progress', { schema: ProgressResponseSchema, ...(signal && { signal }) });
}
