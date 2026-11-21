import { useQuery } from '@tanstack/react-query';

import { fetchConversation, glossMessage } from '../../api/practice';
import { keys } from '../../lib/query-client';

export function useConversation(id: string) {
  return useQuery({
    queryKey: keys.conversation(id),
    queryFn: ({ signal }) => fetchConversation(id, signal),
    // The chat writes its own events into this cache; a background refetch would only race them.
    staleTime: Infinity,
  });
}

/**
 * The English gloss of a partner message. Fetched only once asked for (`enabled`), kept for good in
 * the query cache so hiding and showing it again costs nothing. A gloss the API already holds comes
 * in as `known` and is used as is.
 */
export function useGloss(messageId: string, enabled: boolean, known: string | null) {
  return useQuery({
    queryKey: keys.gloss(messageId),
    queryFn: ({ signal }) => glossMessage(messageId, signal),
    enabled: enabled && known === null,
    staleTime: Infinity,
    retry: false,
  });
}
