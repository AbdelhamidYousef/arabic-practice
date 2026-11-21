import { useState } from 'react';

import { Alert } from '../../components/ui/Alert';
import { ArabicText } from '../../components/ui/ArabicText';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';

import { useGloss } from './queries';

const bubble = 'min-w-0 max-w-[88%] rounded-ui border px-4 py-2.5 sm:max-w-[80%]';

export function LearnerBubble({
  text,
  hideHarakat,
  pending = false,
}: {
  text: string;
  hideHarakat: boolean;
  pending?: boolean;
}) {
  const { t } = useT();
  return (
    <div className="flex justify-end">
      <div className={cn(bubble, 'border-primary/30 bg-primary-soft', pending && 'opacity-80')}>
        <p className="sr-only">{t('chat.you')}</p>
        <ArabicText
          as="p"
          hideHarakat={hideHarakat}
          className="whitespace-pre-wrap break-words text-lg"
        >
          {text}
        </ArabicText>
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
            className="whitespace-pre-wrap break-words text-lg"
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
              className="break-words border-t border-line pt-2"
            >
              {text}
            </p>
          )}
          {gloss.isError && text === null && (
            <Alert tone="danger" className="mt-1">
              {t('chat.translate.error')}{' '}
              <button
                type="button"
                onClick={() => void gloss.refetch()}
                className="font-medium underline underline-offset-4"
              >
                {t('chat.translate.retry')}
              </button>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
