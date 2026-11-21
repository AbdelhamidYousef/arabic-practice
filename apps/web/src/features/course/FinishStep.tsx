import type { LessonDetailResponse } from '@arabic/shared';
import { Link } from 'react-router-dom';

import { buttonClasses } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';
import { formatNumber } from '../../lib/format';

import { MixedText } from './MixedText';
import { useCourse } from './queries';

export interface Session {
  /** XP the posts in this visit earned. */
  xp: number;
  /** The streak from the last post, or null when nothing was posted in this visit. */
  streak: number | null;
}

// The end of a lesson: XP gained on the way, the streak, and the way on (the course's next lesson,
// or back to the course). After a reload nothing was earned "in this visit", so it shows today's
// XP and the streak from the course instead of a misleading +0.
export function FinishStep({ data, session }: { data: LessonDetailResponse; session: Session }) {
  const { t, tn } = useT();
  const course = useCourse();
  const posted = session.streak !== null;
  const streak = session.streak ?? course.data?.stats.streak ?? 0;
  const nextUp = course.data?.nextUp;
  const next = nextUp && nextUp !== data.lesson.slug ? nextUp : null;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <span className="inline-flex size-20 items-center justify-center rounded-full bg-success-soft text-success">
        <Icon name="trophy" className="size-[2.5rem]" />
      </span>
      <div>
        <h1 className="text-3xl">{t('finish.title')}</h1>
        <p className="mt-2 text-muted">
          <MixedText text={data.lesson.title} />
        </p>
      </div>

      <div className="grid w-full grid-cols-2 gap-3">
        <Card className="flex flex-col items-center gap-1 p-5">
          <Icon name="bolt" className="size-6 text-primary" />
          <span className="text-3xl font-semibold tabular-nums">
            {posted
              ? t('finish.xpGained', { xp: formatNumber(session.xp) })
              : formatNumber(course.data?.stats.xpToday ?? 0)}
          </span>
          <span className="text-sm text-muted">
            {posted ? t('finish.xpLesson') : t('course.stat.xpToday')}
          </span>
        </Card>
        <Card className="flex flex-col items-center gap-1 p-5">
          <Icon name="flame" className="size-6 text-accent-strong" />
          <span className="text-3xl font-semibold tabular-nums">{formatNumber(streak)}</span>
          <span className="text-sm text-muted">{tn('course.stat.streak', streak)}</span>
        </Card>
      </div>
      {posted && session.xp === 0 && <p className="text-sm text-muted">{t('finish.noNewXp')}</p>}

      <div className="flex w-full flex-col gap-3">
        {next && (
          <Link to={`/lessons/${next}`} className={cn(buttonClasses('primary', 'lg'))}>
            {t('finish.next')}
            <Icon name="arrow" />
          </Link>
        )}
        <Link to="/lessons" className={buttonClasses(next ? 'secondary' : 'primary', 'lg')}>
          {t('finish.toCourse')}
        </Link>
      </div>
    </div>
  );
}
