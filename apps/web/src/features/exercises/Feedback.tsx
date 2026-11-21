import type { ReactNode } from 'react';

import { ArabicText } from '../../components/ui/ArabicText';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';

interface FeedbackProps {
  correct: boolean;
  /** The right answer, shown after a wrong one. A string is Arabic. */
  answer?: ReactNode;
  /** Replaces the standard "Right" / "Not quite" line. */
  message?: string;
}

// Right or wrong after Check: a polite live region, so a screen reader hears the result without
// losing its place; success and danger colours only ever mean right and wrong.
export function Feedback({ correct, answer, message }: FeedbackProps) {
  const { t } = useT();
  return (
    <p
      role="status"
      className={cn(
        'flex items-start gap-2 rounded-ui px-4 py-3 font-medium',
        correct ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
      )}
    >
      <Icon name={correct ? 'check' : 'close'} className="mt-1" />
      <span className="min-w-0">
        {message ?? (correct ? t('exercise.right') : t('exercise.wrong'))}{' '}
        {!correct &&
          answer !== undefined &&
          (typeof answer === 'string' ? <ArabicText>{answer}</ArabicText> : answer)}
      </span>
    </p>
  );
}
