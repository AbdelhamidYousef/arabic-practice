import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';

import { ApiError } from '../api/client';

// Retrying a 4xx is pointless (the same request fails the same way); a 5xx or a dropped
// connection may be a blip, so those get two more tries.
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false;
  return error instanceof ApiError && (error.status >= 500 || error.code === 'NETWORK');
}

// Query keys are the cache identity. Defined once so no component spells a key by hand.
export const keys = {
  // Signed-in user (or null). Written directly on login/logout, so it never needs a refetch.
  me: ['me'] as const,
  // The API's own health check, polled by the "server is waking up" notice.
  health: ['health'] as const,
  // True once a request came back 401 while the page believed someone was signed in.
  sessionExpired: ['session-expired'] as const,
  lessons: ['lessons'] as const,
  // Not under 'lessons': invalidating the list must not refetch the whole course, and back.
  course: ['course'] as const,
  lesson: (slug: string) => ['lessons', slug] as const,
  conversation: (id: string) => ['conversation', id] as const,
  gloss: (messageId: string) => ['gloss', messageId] as const,
  invite: (code: string) => ['invite', code] as const,
  progress: ['progress'] as const,
  reviewDue: ['review', 'due'] as const,
  teacher: {
    lessons: ['teacher', 'lessons'] as const,
    lesson: (id: string) => ['teacher', 'lessons', id] as const,
    learners: ['teacher', 'learners'] as const,
    learner: (id: string) => ['teacher', 'learners', id] as const,
    transcript: (id: string) => ['teacher', 'conversations', id] as const,
    invites: ['teacher', 'invites'] as const,
    usage: ['teacher', 'usage'] as const,
  },
};

// A 401 for someone the page believes is signed in means the session ended behind its back (it
// expired, or the server restarted). The cached user is stale: drop it, so the header turns back
// into "Sign in", and drop every other cache, because the next person to sign in must not see
// this account's lessons, chats or progress. Only when `me` holds a user: a wrong password at the
// login form is also a 401, and that is just a failed attempt.
export function handleUnauthenticated(client: QueryClient, error: unknown): void {
  if (!(error instanceof ApiError) || error.status !== 401) return;
  if (!client.getQueryData(keys.me)) return;
  client.setQueryData(keys.me, null);
  client.setQueryData(keys.sessionExpired, true);
  // Deferred so the failing query finishes its own error handling first.
  setTimeout(() => {
    client.removeQueries({
      predicate: (q) => q.queryKey[0] !== keys.me[0] && q.queryKey[0] !== keys.sessionExpired[0],
    });
  }, 0);
}

export function createQueryClient(): QueryClient {
  const client: QueryClient = new QueryClient({
    queryCache: new QueryCache({ onError: (error) => handleUnauthenticated(client, error) }),
    mutationCache: new MutationCache({ onError: (error) => handleUnauthenticated(client, error) }),
    defaultOptions: {
      queries: { staleTime: 30_000, retry: shouldRetry, refetchOnWindowFocus: false },
    },
  });
  return client;
}
