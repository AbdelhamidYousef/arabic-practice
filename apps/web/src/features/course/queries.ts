import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { fetchCourse, postLessonProgress, type LessonStep } from '../../api/course';
import { localDay } from '../../lib/local-day';
import { keys } from '../../lib/query-client';
import { useMe } from '../auth/queries';

export function useCourse() {
  return useQuery({
    queryKey: keys.course,
    queryFn: ({ signal }) => fetchCourse(localDay(), signal),
  });
}

export interface StepDone {
  step: LessonStep;
  score?: number;
}

/**
 * Records a finished step. The read-only demo teacher never posts (the API would refuse with 403
 * anyway): the call resolves with null and nothing is written. Afterwards the course path, the
 * lesson and the review deck (finishing practice adds the lesson's words) are refetched.
 */
export function useRecordStep(slug: string) {
  const client = useQueryClient();
  const { data: user } = useMe();
  return useMutation({
    mutationFn: async ({ step, score }: StepDone) => {
      if (user?.readOnly) return null;
      return postLessonProgress(slug, {
        step,
        day: localDay(),
        ...(score !== undefined && { score }),
      });
    },
    onSuccess: () =>
      Promise.all([
        client.invalidateQueries({ queryKey: keys.course }),
        client.invalidateQueries({ queryKey: keys.lesson(slug) }),
        client.invalidateQueries({ queryKey: keys.reviewDue }),
      ]),
  });
}

/**
 * The talk step is done once the partner has answered the learner in a chat on this lesson. Posted
 * once per open chat, after the first reply that finished; a failure is ignored (the chat itself
 * matters more, and the next reply in a later visit tries again). The API pays XP only once.
 */
export function useRecordTalkOnReply(slug: string, replied: boolean) {
  const { mutate } = useRecordStep(slug);
  const sent = useRef(false);
  useEffect(() => {
    if (!replied || sent.current) return;
    sent.current = true;
    mutate({ step: 'talk' }, { onError: () => undefined });
  }, [replied, mutate]);
}
