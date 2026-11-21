import { diffWords, isArabic, stripHarakat, type Correction, type Mistake } from '@arabic/shared';

import { ArabicText } from '../../components/ui/ArabicText';
import { Badge } from '../../components/ui/Badge';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';

import type { CorrectionState } from './turn';

const cardClasses = 'rounded-ui border px-3 py-2.5 text-sm';

interface CorrectionCardProps {
  /** The learner's own text, for the word diff. */
  original: string;
  /** `null` is a saved message with no correction (it failed, or never ran). */
  state: CorrectionState | null;
  hideHarakat: boolean;
}

export function CorrectionCard({ original, state, hideHarakat }: CorrectionCardProps) {
  const { t } = useT();
  if (state?.status === 'pending') {
    return (
      <p className={cn(cardClasses, 'border-line bg-surface text-muted')} role="status">
        {t('chat.correction.checking')}
      </p>
    );
  }
  if (state === null || state.status === 'error') {
    return (
      <p className={cn(cardClasses, 'border-line bg-surface text-muted')}>
        {t('chat.correction.failed')}
      </p>
    );
  }
  return (
    <CorrectionResult original={original} correction={state.correction} hideHarakat={hideHarakat} />
  );
}

function Praise({ text, hideHarakat }: { text: string; hideHarakat: boolean }) {
  return isArabic(text) ? <ArabicText hideHarakat={hideHarakat}>{text}</ArabicText> : <>{text}</>;
}

function CorrectionResult({
  original,
  correction,
  hideHarakat,
}: {
  original: string;
  correction: Correction;
  hideHarakat: boolean;
}) {
  const { t } = useT();
  if (correction.isCorrect) {
    return (
      <div className={cn(cardClasses, 'border-success bg-success-soft text-ink')}>
        <p className="font-semibold text-success">
          <span aria-hidden="true">✓ </span>
          {t('chat.correction.correct')}
        </p>
        {correction.praise && (
          <p className="mt-0.5">
            <Praise text={correction.praise} hideHarakat={hideHarakat} />
          </p>
        )}
      </div>
    );
  }
  const words = diffWords(original, correction.corrected);
  return (
    <div className={cn(cardClasses, 'border-accent bg-accent-soft text-ink')}>
      <p className="font-semibold text-accent-strong">{t('chat.correction.title')}</p>
      {/* Word by word so a changed word can be marked; the spaces keep the line breakable. */}
      <p lang="ar" dir="rtl" className="arabic mt-1 [overflow-wrap:anywhere] text-lg">
        {words.map((word, index) => {
          const text = hideHarakat ? stripHarakat(word.text) : word.text;
          return (
            <span key={`${index}-${word.text}`}>
              {index > 0 && ' '}
              {word.changed ? (
                <mark className="rounded-md bg-surface px-2 py-0.5 box-decoration-clone font-medium text-accent-strong underline decoration-accent-strong underline-offset-4">
                  {text}
                </mark>
              ) : (
                text
              )}
            </span>
          );
        })}
      </p>
      <p className="mt-1 text-xs text-muted">{t('chat.correction.changed')}</p>
      {correction.mistakes.length > 0 && (
        <ul
          aria-label={t('chat.correction.mistakes')}
          className="mt-3 space-y-3 border-t border-accent/40 pt-3"
        >
          {correction.mistakes.map((mistake) => (
            <MistakeItem key={mistake.id} mistake={mistake} hideHarakat={hideHarakat} />
          ))}
        </ul>
      )}
    </div>
  );
}

function MistakeItem({ mistake, hideHarakat }: { mistake: Mistake; hideHarakat: boolean }) {
  const { t } = useT();
  return (
    <li className="min-w-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Badge tone="accent" className="border border-accent-strong/30">
          {t(`mistake.${mistake.type}`)}
        </Badge>
        <span className="min-w-0 [overflow-wrap:anywhere] text-base">
          <ArabicText hideHarakat={hideHarakat} className="text-muted line-through decoration-1">
            {mistake.original}
          </ArabicText>
          <span aria-hidden="true"> → </span>
          <span className="sr-only"> {t('chat.correction.becomes')} </span>
          <ArabicText hideHarakat={hideHarakat} className="font-medium">
            {mistake.correction}
          </ArabicText>
        </span>
      </div>
      <p className="mt-1">{mistake.explanation}</p>
    </li>
  );
}
