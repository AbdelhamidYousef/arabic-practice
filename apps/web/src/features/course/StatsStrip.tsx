import type { CourseStats } from '@arabic/shared';

import { Card } from '../../components/ui/Card';
import { Icon, type IconName } from '../../components/ui/Icon';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';
import { formatNumber } from '../../lib/format';

// Streak, XP today and words learned: three small cards in one row at every width. On a phone the
// icon sits above the number so three fit side by side at 390 px.
export function StatsStrip({
  stats,
  xp = 'today',
  className,
}: {
  stats: CourseStats;
  /** The course page shows today's XP, the progress page the total. */
  xp?: 'today' | 'total';
  className?: string;
}) {
  const { t, tn } = useT();
  const items: { icon: IconName; value: number; label: string; chip: string }[] = [
    {
      icon: 'flame',
      value: stats.streak,
      label: tn('course.stat.streak', stats.streak),
      // The flame is the one warm highlight on the page.
      chip: 'bg-accent-soft text-accent-strong',
    },
    {
      icon: 'bolt',
      value: xp === 'today' ? stats.xpToday : stats.xpTotal,
      label: xp === 'today' ? t('course.stat.xpToday') : t('progress.stat.xpTotal'),
      chip: 'bg-primary-soft text-primary',
    },
    {
      icon: 'book',
      value: stats.wordsLearned,
      label: tn('course.stat.words', stats.wordsLearned),
      chip: 'bg-primary-soft text-primary',
    },
  ];
  return (
    <ul aria-label={t('course.stats')} className={cn('grid grid-cols-3 gap-2 sm:gap-4', className)}>
      {items.map((item) => (
        <li key={item.icon}>
          <Card className="flex h-full flex-col items-start gap-2 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
            <span
              className={cn(
                'inline-flex size-9 shrink-0 items-center justify-center rounded-xl sm:size-11',
                item.chip,
              )}
            >
              <Icon name={item.icon} className="size-5 sm:size-6" />
            </span>
            <span className="min-w-0">
              <span className="block text-2xl font-semibold tabular-nums">
                {formatNumber(item.value)}
              </span>
              <span className="block text-xs text-muted [overflow-wrap:anywhere] sm:text-sm">
                {item.label}
              </span>
            </span>
          </Card>
        </li>
      ))}
    </ul>
  );
}
