import type { ProgressResponse } from '@arabic/shared';
import { Link } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { MistakeBars, RecentMistakes } from '../features/progress/MistakeViews';
import { useProgress } from '../features/progress/queries';
import { useT } from '../i18n';
import { formatDay, formatDayNumber, formatMonthShort, formatNumber } from '../lib/format';

export default function ProgressPage() {
  const { t } = useT();
  const query = useProgress();
  return (
    <Container className="py-8 sm:py-12">
      <Seo title={t('page.progress')} />
      <h1 className="text-3xl">{t('page.progress')}</h1>
      <p className="mt-2 text-muted">{t('progress.lead')}</p>
      <LoadState query={query}>{(data) => <ProgressView data={data} />}</LoadState>
    </Container>
  );
}

function ProgressView({ data }: { data: ProgressResponse }) {
  const { t, tn } = useT();
  const { totals, mistakesByType, weeks, recentMistakes } = data;

  if (totals.turns === 0 && recentMistakes.length === 0) {
    return (
      <EmptyState
        title={t('progress.empty.title')}
        description={t('progress.empty.body')}
        action={
          <Link to="/lessons" className={buttonClasses('primary')}>
            {t('progress.empty.action')}
          </Link>
        }
      />
    );
  }

  const stats = [
    { label: tn('progress.stat.conversations', totals.conversations), value: totals.conversations },
    { label: tn('progress.stat.turns', totals.turns), value: totals.turns },
    { label: tn('progress.stat.mistakes', totals.mistakes), value: totals.mistakes },
  ];
  const maxRate = Math.max(0.01, ...weeks.map((w) => w.mistakesPerTurn));

  return (
    <div className="mt-8 space-y-10">
      <ul className="grid grid-cols-3 gap-2 sm:gap-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Card className="p-3 sm:p-5">
              <p className="text-2xl tabular-nums sm:text-3xl">{formatNumber(s.value)}</p>
              <p className="mt-1 break-words text-xs text-muted sm:text-sm">{s.label}</p>
            </Card>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="by-type-heading">
          <Card className="h-full">
            <h2 id="by-type-heading" className="text-xl">
              {t('progress.byType')}
            </h2>
            <div className="mt-4">
              {mistakesByType.length === 0 ? (
                <p className="text-muted">{t('progress.noMistakes')}</p>
              ) : (
                <MistakeBars items={mistakesByType} />
              )}
            </div>
          </Card>
        </section>

        <section aria-labelledby="weeks-heading">
          <Card className="h-full">
            <h2 id="weeks-heading" className="text-xl">
              {t('progress.weeks')}
            </h2>
            <p className="mt-1 text-sm text-muted">{t('progress.weeks.hint')}</p>
            <ol className="mt-4 grid grid-cols-8 items-end gap-2" data-testid="weeks">
              {weeks.map((w) => (
                <li
                  key={w.weekStart}
                  className="flex min-w-0 flex-col items-center gap-1"
                  title={t('progress.week.title', {
                    week: formatDay(w.weekStart),
                    turns: w.turns,
                    mistakes: w.mistakes,
                  })}
                >
                  <span className="text-xs tabular-nums">
                    {w.turns === 0 ? '–' : w.mistakesPerTurn.toFixed(1)}
                  </span>
                  <span className="flex h-24 w-full items-end rounded bg-primary-soft">
                    <span
                      className="block w-full rounded bg-primary"
                      style={{
                        height: `${w.turns === 0 ? 0 : (w.mistakesPerTurn / maxRate) * 100}%`,
                      }}
                    />
                  </span>
                  {/* Two short lines ("12" over "Oct") fit a column at 320 px; the full date is for
                      screen readers (and the hover title on the item). */}
                  <span className="sr-only">{formatDay(w.weekStart)}</span>
                  <span
                    aria-hidden="true"
                    className="flex flex-col items-center text-[0.7rem] leading-tight text-muted"
                  >
                    <span>{formatDayNumber(w.weekStart)}</span>
                    <span>{formatMonthShort(w.weekStart)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </Card>
        </section>
      </div>

      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="text-xl">
          {t('progress.recent')}
        </h2>
        <div className="mt-4">
          {recentMistakes.length === 0 ? (
            <p className="text-muted">{t('progress.noMistakes')}</p>
          ) : (
            <RecentMistakes items={recentMistakes} />
          )}
        </div>
      </section>
    </div>
  );
}
