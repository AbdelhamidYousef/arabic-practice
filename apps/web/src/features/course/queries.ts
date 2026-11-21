import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
