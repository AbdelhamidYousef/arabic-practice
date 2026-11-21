import { ErrorCode } from '@arabic/shared';
import { useState } from 'react';

import { ApiError } from '../../api/client';
import { Alert } from '../../components/ui/Alert';
import { ArabicText } from '../../components/ui/ArabicText';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';

import { ResetLine } from './limits';
import { useGloss } from './queries';

const bubble = 'min-w-0 max-w-[88%] rounded-ui border px-4 py-2.5 sm:max-w-[80%]';

export function LearnerBubble({
  text,
  hideHarakat,
  pending = false,
  unanswered,
}: {
  text: string;
  hideHarakat: boolean;
  pending?: boolean;
  /** The partner never replied to this message: shown muted with a small label under it. */
  unanswered?: 'noReply' | 'history';
}) {
  const { t } = useT();
  return (
    <div className="flex justify-end">
      <div
        className={cn(
          bubble,
          'border-primary/30 bg-primary-soft',
          pending && 'opacity-80',
          unanswered && 'border-line bg-surface text-muted',
        )}
        {...(unanswered && { 'data-unanswered': unanswered })}
      >
        <p className="sr-only">{t('chat.you')}</p>
        <ArabicText
          as="p"
          hideHarakat={hideHarakat}
          className="whitespace-pre-wrap [overflow-wrap:anywhere] text-lg"
        >
          {text}
        </ArabicText>
        {unanswered && (
          <p className="mt-1 text-xs">
            {t(unanswered === 'noReply' ? 'chat.noReply' : 'chat.notAnswered')}
          </p>
        )}
      </div>
    </div>
  );
}

interface PartnerBubbleProps {
  /** Present for a saved message; a reply still streaming has no id yet, so no Translate. */
  messageId?: string;
  text: string;
  glossEn?: string | null;
  hideHarakat: boolean;
  streaming?: boolean;
}

export function PartnerBubble({
  messageId,
  text,
  glossEn = null,
  hideHarakat,
  streaming = false,
}: PartnerBubbleProps) {
  const { t } = useT();
  return (
    <div className="flex justify-start">
      <div className={cn(bubble, 'border-line bg-surface')}>
        <p className="sr-only">{t('chat.partner')}</p>
        {text === '' && streaming ? (
          <p className="flex h-8 items-center gap-1 text-muted" aria-hidden="true">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-2 w-2 rounded-full bg-muted motion-safe:animate-pulse"
                style={{ animationDelay: `${dot * 150}ms` }}
              />
            ))}
          </p>
        ) : (
          <ArabicText
            as="p"
            hideHarakat={hideHarakat}
            className="whitespace-pre-wrap [overflow-wrap:anywhere] text-lg"
          >
            {text}
          </ArabicText>
        )}
        {messageId && <Translate messageId={messageId} known={glossEn} />}
      </div>
    </div>
  );
}

function Translate({ messageId, known }: { messageId: string; known: string | null }) {
  const { t } = useT();
  const [shown, setShown] = useState(false);
  const gloss = useGloss(messageId, shown, known);
  const text = known ?? gloss.data?.glossEn ?? null;
  const loading = shown && text === null && gloss.isFetching;
  return (
    <div className="mt-1">
      <button
        type="button"
        aria-expanded={shown}
        onClick={() => setShown((s) => !s)}
        className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
      >
        {shown ? t('chat.translate.hide') : t('chat.translate')}
      </button>
      {shown && (
        <div aria-live="polite" className="text-sm">
          {loading && <p className="text-muted">{t('chat.translate.loading')}</p>}
          {text !== null && (
            <p
              lang="en"
              aria-label={t('chat.translate.label')}
              className="[overflow-wrap:anywhere] border-t border-line pt-2"
            >
              {text}
            </p>
          )}
          {gloss.isError && text === null && (
            <GlossError error={gloss.error} onRetry={gloss.refetch} />
          )}
        </div>
      )}
    </div>
  );
}

// A daily limit is not a hiccup: retrying changes nothing until the reset, so it gets its own
// sentence and the time, and no retry button.
function GlossError({ error, onRetry }: { error: unknown; onRetry: () => unknown }) {
  const { t } = useT();
  const code = error instanceof ApiError ? error.code : null;
  if (code === ErrorCode.AI_LIMIT_USER || code === ErrorCode.AI_LIMIT_GLOBAL) {
    return (
      <Alert tone="danger" className="mt-1">
        <p>
          {t(code === ErrorCode.AI_LIMIT_USER ? 'chat.translate.limit' : 'chat.error.limitGlobal')}
        </p>
        <ResetLine />
      </Alert>
    );
  }
  return (
    <Alert tone="danger" className="mt-1">
      {t('chat.translate.error')}{' '}
      <button
        type="button"
        onClick={() => void onRetry()}
        className="font-medium underline underline-offset-4"
      >
        {t('chat.translate.retry')}
      </button>
    </Alert>
  );
}
