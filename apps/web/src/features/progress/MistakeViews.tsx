import type { MistakeTypeCount, RecentMistake } from '@arabic/shared';

import { ArabicText } from '../../components/ui/ArabicText';
import { Badge } from '../../components/ui/Badge';
import { useT, type StringKey } from '../../i18n';
import { formatDate } from '../../lib/format';

export const mistakeTypeKey = (type: MistakeTypeCount['type']): StringKey => `mistake.type.${type}`;

// Simple horizontal bars, drawn with CSS: the widest bar is the most frequent type. The numbers
// are text too, so nothing depends on seeing the bar.
export function MistakeBars({ items }: { items: MistakeTypeCount[] }) {
  const { t } = useT();
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <ul className="space-y-3">
      {items.map(({ type, count }) => (
        <li key={type} className="grid grid-cols-[6.5rem_minmax(0,1fr)_2rem] items-center gap-3">
          <span className="text-sm">{t(mistakeTypeKey(type))}</span>
          <span className="h-3 rounded-full bg-primary-soft" aria-hidden="true">
            <span
              data-testid={`bar-${type}`}
              className="block h-3 rounded-full bg-primary"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </span>
          <span className="text-right text-sm tabular-nums">{count}</span>
        </li>
      ))}
    </ul>
  );
}

// "original → correction", then why. Arabic goes through ArabicText (lang, dir, font).
export function RecentMistakes({ items }: { items: RecentMistake[] }) {
  const { t } = useT();
  return (
    <ul className="divide-y divide-line rounded-ui border border-line bg-surface">
      {items.map((m) => (
        <li key={m.id} className="space-y-2 p-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Badge tone="accent">{t(mistakeTypeKey(m.type))}</Badge>
            <span className="text-sm text-muted">
              {m.lessonTitle} · {formatDate(m.createdAt)}
            </span>
          </div>
          <p className="flex flex-wrap items-baseline gap-x-3 text-lg">
            <ArabicText className="text-danger line-through decoration-1">{m.original}</ArabicText>
            <span aria-label={t('progress.becomes')}>→</span>
            <ArabicText className="text-success">{m.correction}</ArabicText>
          </p>
          <p className="max-w-prose text-sm">{m.explanation}</p>
        </li>
      ))}
    </ul>
  );
}
