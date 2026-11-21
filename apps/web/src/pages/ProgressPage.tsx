import { cefrLabel, type ProgressResponse } from '@arabic/shared';
import { Link } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { useCourse } from '../features/course/queries';
import { StatsStrip } from '../features/course/StatsStrip';
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
      <CourseProgress />
      <LoadState query={query}>{(data) => <ProgressView data={data} />}</LoadState>
    </Container>
  );
}

// Streak, XP and lessons done per level from the course. Shown when the course loads; the
// conversation stats below have their own loading and error states.
function CourseProgress() {
  const { t } = useT();
  const { data } = useCourse();
  if (!data) return null;
  const levels = data.levels.map(({ level, units }) => {
    const lessons = units.flatMap((u) => u.lessons);
    return { level, total: lessons.length, done: lessons.filter((l) => l.finished).length };
  });
  return (
    <section aria-labelledby="course-progress" className="mt-8">
      <h2 id="course-progress" className="text-xl">
        {t('progress.course')}
      </h2>
      <StatsStrip stats={data.stats} xp="total" className="mt-4" />
      {levels.length > 0 && (
        <Card className="mt-4">
          <h3 className="text-lg">{t('progress.levels')}</h3>
          <ul className="mt-4 space-y-4">
            {levels.map((l) => (
              <li key={l.level}>
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium">
                    {t('progress.levelName', { level: l.level, name: cefrLabel[l.level] })}
                  </span>
                  <span className="shrink-0 text-muted tabular-nums">
                    {t('progress.levelDone', { done: l.done, total: l.total })}
                  </span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-primary-soft" aria-hidden="true">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(l.done / Math.max(1, l.total)) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </section>
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
              <p className="mt-1 [overflow-wrap:anywhere] text-xs text-muted sm:text-sm">
                {s.label}
              </p>
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
