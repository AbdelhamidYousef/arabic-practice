import { useQuery } from '@tanstack/react-query';

import { fetchProgress } from '../../api/progress';
import { keys } from '../../lib/query-client';

export function useProgress() {
  return useQuery({ queryKey: keys.progress, queryFn: ({ signal }) => fetchProgress(signal) });
}
