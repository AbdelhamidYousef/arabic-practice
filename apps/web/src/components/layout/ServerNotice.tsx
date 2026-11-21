import { useQuery } from '@tanstack/react-query';

import { fetchHealth } from '../../api/health';
import { useT } from '../../i18n';
import { keys } from '../../lib/query-client';
import { useSlow } from '../../lib/use-slow';

import { Container } from './Container';

export const WAKING_AFTER_MS = 4_000;
export const HEALTHY_POLL_MS = 30_000;
export const DOWN_POLL_MS = 5_000;

// The free API host sleeps when idle, and the first call after a nap can take half a minute. A
// request that is merely slow says so after a few seconds (so it does not look broken); one that
// failed says the server is not answering, and the check repeats until it is back.
export function ServerNotice() {
  const { t } = useT();
  const { isPending, isError } = useQuery({
    queryKey: keys.health,
    queryFn: ({ signal }) => fetchHealth(signal),
    // This query IS the retry loop, and a stale "ok" is useless afterwards.
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: (query) => (query.state.status === 'error' ? DOWN_POLL_MS : HEALTHY_POLL_MS),
  });
  const slow = useSlow(isPending, WAKING_AFTER_MS);

  const message = isError ? t('shell.unreachable') : slow ? t('shell.waking') : null;
  if (!message) return null;
  return (
    <div role="status" data-testid="server-notice" className="bg-accent-soft text-ink">
      <Container className="py-2 text-sm">{message}</Container>
    </div>
  );
}
