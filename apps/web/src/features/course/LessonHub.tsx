import type { LessonDetailResponse } from '@arabic/shared';
import { Link } from 'react-router-dom';

import { Seo } from '../../components/Seo';
import { Badge } from '../../components/ui/Badge';
import { buttonClasses } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';
import { RecentConversation } from '../../pages/LessonPage';

import { MixedText } from './MixedText';
import { STEP_META, firstOpenStep, isFinished, learnPath, stepsOf } from './steps';

// A course lesson's start page: what it is, its steps with their done state, and one big button
// that goes to the first step not done yet. Every step stays open: nothing is locked.
export function LessonHub({ data }: { data: LessonDetailResponse }) {
  const { t } = useT();
  const { lesson, progress, conversations } = data;
  const steps = stepsOf(data);
  const done = progress.stepsDone;
  const open = firstOpenStep(steps, done);
  const finished = isFinished(steps, done);
  const started = steps.some((s) => done.includes(s));
  const target = open && !finished ? open : (steps[0] ?? 'words');
  const label = finished ? t('hub.again') : started ? t('hub.continue') : t('hub.start');

  return (
    <>
      <Seo title={lesson.title} description={lesson.summary} />
      <header className="mt-4 rounded-3xl bg-[radial-gradient(ellipse_at_top_right,var(--color-primary-soft),transparent_70%)] py-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="primary">{lesson.level}</Badge>
          {lesson.kind === 'letters' && <Badge>{t('course.letters')}</Badge>}
          {lesson.unit && (
            <span className="text-sm text-muted">
              {t('hub.unit', { code: lesson.unit.code, title: lesson.unit.title })}
            </span>
          )}
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl">
          <MixedText text={lesson.title} />
        </h1>
        <p className="mt-3 max-w-prose text-lg text-muted">{lesson.summary}</p>
        {finished && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-sm text-success">
            <Icon name="check" className="size-4" />
            {t('hub.finished')}
          </p>
        )}
        <div className="mt-6">
          <Link
            to={learnPath(lesson.slug, target)}
            className={cn(buttonClasses('primary', 'lg'), 'max-sm:w-full')}
          >
            {label}
            <Icon name="arrow" />
          </Link>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section aria-labelledby="steps-heading" className="min-w-0">
          <h2 id="steps-heading" className="text-xl">
            {t('hub.steps')}
          </h2>
          <ol className="mt-4 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-surface shadow-card">
            {steps.map((step, i) => {
              const meta = STEP_META[step];
              const isDone = done.includes(step);
              const isOpen = step === open && !finished;
              return (
                <li key={step}>
                  <Link
                    to={learnPath(lesson.slug, step)}
                    className={cn(
                      'flex min-h-16 items-center gap-4 px-4 py-4 transition-colors hover:bg-primary-soft/40 focus-visible:-outline-offset-2 sm:px-5',
                      isOpen && 'bg-primary-soft/40',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-flex size-11 shrink-0 items-center justify-center rounded-xl',
                        isDone ? 'bg-success-soft text-success' : 'bg-primary-soft text-primary',
                      )}
                    >
                      <Icon name={isDone ? 'check' : meta.icon} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-muted">{i + 1}</span>
                        <span className="font-semibold">{t(meta.title)}</span>
                        {step === 'talk' && <Badge>{t('hub.optional')}</Badge>}
                      </span>
                      <span className="block text-sm text-muted">{t(meta.body)}</span>
                    </span>
                    {isDone ? (
                      <span className="shrink-0 text-sm text-success">{t('hub.done')}</span>
                    ) : (
                      <Icon name="arrow" className="text-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="space-y-6">
          {lesson.goals.length > 0 && (
            <Card className="p-5">
              <h2 className="text-lg">{t('hub.goals')}</h2>
              <ul className="mt-3 space-y-2">
                {lesson.goals.map((goal) => (
                  <li key={goal} className="flex items-start gap-2 text-sm">
                    <Icon name="check" className="mt-0.5 size-4 text-primary" />
                    <span className="min-w-0">
                      <MixedText text={goal} />
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {conversations.length > 0 && (
            <Card className="p-5">
              <h2 className="text-lg">{t('lesson.recent')}</h2>
              <ul className="mt-3 divide-y divide-line">
                {conversations.map((c) => (
                  <RecentConversation key={c.id} conversation={c} />
                ))}
              </ul>
            </Card>
          )}
        </aside>
      </div>
    </>
  );
}
