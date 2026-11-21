import { useQuery } from '@tanstack/react-query';

import { fetchLesson, fetchLessons } from '../../api/lessons';
import { keys } from '../../lib/query-client';

export function useLessons() {
  return useQuery({ queryKey: keys.lessons, queryFn: ({ signal }) => fetchLessons(signal) });
}

export function useLesson(slug: string) {
  return useQuery({
    queryKey: keys.lesson(slug),
    queryFn: ({ signal }) => fetchLesson(slug, signal),
  });
}
