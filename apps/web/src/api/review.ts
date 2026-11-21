import {
  ReviewAnswerResponseSchema,
  ReviewDueResponseSchema,
  type ReviewAnswerResponse,
  type ReviewDueResponse,
} from '@arabic/shared';

import { apiFetch } from './client';

export type { ReviewCard, ReviewDueResponse } from '@arabic/shared';

export function fetchDueCards(signal?: AbortSignal): Promise<ReviewDueResponse> {
  return apiFetch('/review/due', { schema: ReviewDueResponseSchema, ...(signal && { signal }) });
}

export function answerCard(vocabId: string, correct: boolean): Promise<ReviewAnswerResponse> {
  return apiFetch(`/review/${encodeURIComponent(vocabId)}`, {
    method: 'POST',
    body: { correct },
    schema: ReviewAnswerResponseSchema,
  });
}
