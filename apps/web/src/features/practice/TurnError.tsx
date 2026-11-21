import { ErrorCode } from '@arabic/shared';

import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { useT, type StringKey } from '../../i18n';

import { ResetLine } from './limits';
import { canRetry, type TurnFailure } from './turn';

function messageKey(failure: TurnFailure): StringKey {
  switch (failure.code) {
    case ErrorCode.AI_LIMIT_USER:
      return 'chat.error.limitUser';
    case ErrorCode.AI_LIMIT_GLOBAL:
      return 'chat.error.limitGlobal';
    case ErrorCode.AI_BUSY:
      return 'chat.error.busy';
    case ErrorCode.AI_DISABLED:
      return 'chat.error.disabled';
    case ErrorCode.RATE_LIMITED:
      return 'chat.error.slowDown';
    case 'NETWORK':
      return 'chat.error.network';
    default:
      return failure.stage === 'reply' ? 'chat.error.replyFailed' : 'chat.error.generic';
  }
}

export function TurnError({
  failure,
  onRetry,
  now = new Date(),
}: {
  failure: TurnFailure;
  onRetry: () => void;
  now?: Date;
}) {
  const { t } = useT();
  return (
    <Alert tone="danger">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p>{t(messageKey(failure))}</p>
          {(failure.code === ErrorCode.AI_LIMIT_USER ||
            failure.code === ErrorCode.AI_LIMIT_GLOBAL) && <ResetLine now={now} />}
        </div>
        {canRetry(failure) && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            {t('chat.retry')}
          </Button>
        )}
      </div>
    </Alert>
  );
}
