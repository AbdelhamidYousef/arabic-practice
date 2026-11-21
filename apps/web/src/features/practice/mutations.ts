import { useMutation, useQueryClient } from '@tanstack/react-query';

import { startConversation } from '../../api/practice';
import { keys } from '../../lib/query-client';

// Starting a conversation changes the lesson's "practised N times" and its recent list, so both
// caches are marked stale; the lesson page refetches them when the learner comes back.
export function useStartConversation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: startConversation,
    onSuccess: () => client.invalidateQueries({ queryKey: keys.lessons }),
  });
}
