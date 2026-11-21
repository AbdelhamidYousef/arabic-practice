import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { answerCard, fetchDueCards } from '../../api/review';
import { keys } from '../../lib/query-client';

// A session is a snapshot of what is due when it starts, so the list is never served from cache
// and never refetched under the learner's feet mid-session.
export function useDueCards() {
  return useQuery({
    queryKey: keys.reviewDue,
    queryFn: ({ signal }) => fetchDueCards(signal),
    staleTime: Infinity,
    gcTime: 0,
    refetchOnMount: 'always',
  });
}

export function useAnswerCard() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ vocabId, correct }: { vocabId: string; correct: boolean }) =>
      answerCard(vocabId, correct),
    // The progress page's numbers do not depend on review, so only the next session is affected.
    onSuccess: () => client.invalidateQueries({ queryKey: keys.reviewDue, refetchType: 'none' }),
  });
}
