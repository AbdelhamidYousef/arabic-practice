import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchMe, type User } from '../../api/auth';
import { keys } from '../../lib/query-client';

// The signed-in user, or null for a visitor (a 401 from /auth/me is "anonymous", not an error).
// Kept fresh by writing it directly on login and logout, so it never needs polling; it is
// re-checked on reconnect, which is when a session most likely ended.
export function useMe() {
  return useQuery({
    queryKey: keys.me,
    queryFn: ({ signal }) => fetchMe(signal),
    staleTime: Infinity,
    refetchOnReconnect: true,
  });
}

/** Call after login/register/logout so every screen sees the new person at once. */
export function useSetMe() {
  const client = useQueryClient();
  return (user: User | null) => {
    client.setQueryData(keys.me, user);
    client.setQueryData(keys.sessionExpired, false);
    // A different person means different data: drop everything that belonged to the last one.
    client.removeQueries({ predicate: (q) => q.queryKey[0] !== keys.me[0] });
  };
}
