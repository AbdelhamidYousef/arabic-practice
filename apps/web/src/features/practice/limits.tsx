import { ErrorCode } from '@arabic/shared';

import { ApiError } from '../../api/client';
import { Alert } from '../../components/ui/Alert';
import { useT, type StringKey } from '../../i18n';

import { nextUtcMidnight } from './turn';

const resetFormat = new Intl.DateTimeFormat('en', {
  weekday: 'short',
  hour: 'numeric',
  minute: '2-digit',
});

/** When the daily caps count from zero again, as the browser's local time ("Sun, 2:00 AM"). */
export const formatReset = (now = new Date()): string => resetFormat.format(nextUtcMidnight(now));

// The daily limits (practice turns, translations, new conversations, the shared model cap) all
// count the UTC day, so they all come back at the same moment: the next UTC midnight.
export function ResetLine({ now }: { now?: Date }) {
  const { t } = useT();
  return <p className="mt-0.5">{t('chat.error.resets', { when: formatReset(now) })}</p>;
}

function startErrorKey(error: unknown): StringKey {
  if (error instanceof ApiError) {
    if (error.code === ErrorCode.CONVERSATION_LIMIT) return 'limit.conversations';
    if (error.code === ErrorCode.RATE_LIMITED) return 'auth.error.rateLimited';
    if (error.code === 'NETWORK') return 'error.network';
  }
  return 'lesson.startError';
}

// The line under "Start practice" when starting a conversation fails. The daily conversation cap
// says so and when it resets, instead of the generic "try again" (which would be a lie: trying
// again changes nothing until the reset).
export function StartError({ error, now }: { error: unknown; now?: Date }) {
  const { t } = useT();
  const limited = error instanceof ApiError && error.code === ErrorCode.CONVERSATION_LIMIT;
  return (
    <Alert tone="danger">
      <p>{t(startErrorKey(error))}</p>
      {limited && <ResetLine {...(now && { now })} />}
    </Alert>
  );
}
