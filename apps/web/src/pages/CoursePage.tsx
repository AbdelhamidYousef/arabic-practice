import {
  cefrLabel,
  type CourseLesson,
  type CourseResponse,
  type CourseUnit,
  type LessonSummary,
} from '@arabic/shared';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { Badge } from '../components/ui/Badge';
import { buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Icon } from '../components/ui/Icon';
import { Tabs } from '../components/ui/Tabs';
import { MixedText } from '../features/course/MixedText';
import { useCourse } from '../features/course/queries';
import { StatsStrip } from '../features/course/StatsStrip';
import { firstOpenStep, learnPath } from '../features/course/steps';
import { useLessons } from '../features/lessons/queries';
import { useT } from '../i18n';
import { cn } from '../lib/cn';

// The learner's start page: the course as levels (tabs), units (sections) and lessons (a path of
// cards). Nothing is locked; the first unfinished lesson is "Next up". The older chat lessons and
// teacher-made ones are not in the course; they stay reachable in a section below.
export default function CoursePage() {
  const { t } = useT();
  const course = useCourse();
  return (
    <Container className="py-8 sm:py-12">
      <Seo title={t('page.course')} />
      <h1 className="text-3xl">{t('page.course')}</h1>
      <p className="mt-2 text-muted">{t('course.lead')}</p>
      <LoadState query={course}>{(data) => <CourseView data={data} />}</LoadState>
    </Container>
  );
}

function CourseView({ data }: { data: CourseResponse }) {
  const { t } = useT();
  const { levels, nextUp, stats } = data;
  const lessons = useLessons();
  const courseSlugs = new Set(
    levels.flatMap((l) => l.units.flatMap((u) => u.lessons.map((lesson) => lesson.slug))),
  );
  const chats = (lessons.data?.levels ?? [])
    .flatMap((l) => l.lessons)
    .filter((lesson) => !courseSlugs.has(lesson.slug));

  // Open on the level that holds the next lesson; after that the learner's choice wins.
  const nextLevel =
    levels.find((l) => l.units.some((u) => u.lessons.some((x) => x.slug === nextUp)))?.level ??
    levels[0]?.level;
  const [picked, setPicked] = useState<string | null>(null);
  const selected = picked ?? nextLevel ?? '';

  const empty = levels.length === 0 && chats.length === 0 && !lessons.isPending;

  return (
    <div className="mt-6 space-y-10">
      <StatsStrip stats={stats} />

      {empty && <EmptyState title={t('course.empty.title')} description={t('course.empty.body')} />}

      {levels.length > 0 && (
        <div>
          {nextUp === null && (
            <p className="mb-4 flex items-center gap-2 rounded-ui bg-success-soft px-4 py-3 text-success">
              <Icon name="trophy" />
              {t('course.allDone')}
            </p>
          )}
          <Tabs
            label={t('course.levels')}
            selectedId={selected}
            onSelect={setPicked}
            panelClassName="pt-6"
            fill
            tabs={levels.map(({ level, units }) => ({
              id: level,
              name: `${level} · ${cefrLabel[level]}`,
              label: (
                <>
                  <span className="block text-lg">{level}</span>
                  <span className="block text-xs font-normal">{cefrLabel[level]}</span>
                </>
              ),
              panel: (
                <div className="space-y-10">
                  {units.map((unit) => (
                    <UnitSection key={unit.code} unit={unit} nextUp={nextUp} />
                  ))}
                </div>
              ),
            }))}
          />
        </div>
      )}

      {chats.length > 0 && <MoreConversation lessons={chats} />}
    </div>
  );
}

function UnitSection({ unit, nextUp }: { unit: CourseUnit; nextUp: string | null }) {
  const { t } = useT();
  const id = `unit-${unit.code.replace(/\W/g, '-')}`;
  return (
    <section aria-labelledby={id}>
      <p className="text-sm font-medium text-primary">{t('course.unit', { code: unit.code })}</p>
      <h2 id={id} className="mt-1 text-2xl">
        {unit.title}
      </h2>
      <p className="mt-1 max-w-prose text-muted">{unit.summary}</p>
      <ol className="mt-5 grid gap-3 md:grid-cols-2">
        {unit.lessons.map((lesson, i) => (
          <li key={lesson.slug}>
            <LessonNode lesson={lesson} number={i + 1} isNext={lesson.slug === nextUp} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function LessonNode({
  lesson,
  number,
  isNext,
}: {
  lesson: CourseLesson;
  number: number;
  isNext: boolean;
}) {
  const { t } = useT();
  const done = lesson.steps.filter((s) => lesson.stepsDone.includes(s)).length;
  const started = done > 0;
  const open = firstOpenStep(lesson.steps, lesson.stepsDone) ?? lesson.steps[0] ?? 'words';

  let state: string;
  if (lesson.finished) state = t('course.state.done');
  else if (started) state = t('course.state.steps', { done, total: lesson.steps.length });
  else state = t('course.state.notStarted');

  return (
    <Card
      className={cn(
        'relative flex h-full items-start gap-4 p-4 transition-colors focus-within:ring-2 focus-within:ring-primary hover:bg-primary-soft/40 sm:p-5',
        isNext && 'border-2 border-primary bg-primary-soft/40',
      )}
      data-state={lesson.finished ? 'done' : isNext ? 'next' : started ? 'started' : 'new'}
    >
      <span
        className={cn(
          'inline-flex size-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold',
          lesson.finished
            ? 'bg-success-soft text-success'
            : isNext
              ? 'bg-primary text-surface'
              : 'bg-primary-soft text-primary',
        )}
      >
        {lesson.finished ? (
          <Icon name="check" className="size-6" />
        ) : lesson.kind === 'letters' ? (
          <Icon name="letter" className="size-6" />
        ) : (
          <span aria-hidden="true">{number}</span>
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {isNext && <Badge tone="primary">{t('course.nextUp')}</Badge>}
          {lesson.kind === 'letters' && <Badge>{t('course.letters')}</Badge>}
        </div>
        <h3 className="mt-1 text-lg">
          {/* The link's ::after stretches over the whole card, so the card is one click target. */}
          <Link
            to={`/lessons/${lesson.slug}`}
            className="[overflow-wrap:anywhere] after:absolute after:inset-0 after:rounded-ui focus:outline-none"
          >
            <MixedText text={lesson.title} />
          </Link>
        </h3>
        <p
          className={cn(
            'mt-1 flex flex-wrap gap-x-3 text-sm',
            lesson.finished ? 'text-success' : 'text-muted',
          )}
        >
          <span>{state}</span>
          {lesson.practiceScore !== null && (
            <span className="text-muted">
              {t('course.state.score', { score: lesson.practiceScore })}
            </span>
          )}
        </p>
        {started && !lesson.finished && (
          <div className="mt-2 h-1.5 rounded-full bg-primary-soft" aria-hidden="true">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${(done / Math.max(1, lesson.steps.length)) * 100}%` }}
            />
          </div>
        )}
        {isNext && (
          // Above the stretched link (z-10), straight into the player at the open step.
          <Link
            to={learnPath(lesson.slug, open)}
            className={cn(buttonClasses('primary'), 'relative z-10 mt-4 max-sm:w-full')}
          >
            {started ? t('course.continue') : t('course.start')}
            <span className="sr-only">: {lesson.title}</span>
            <Icon name="arrow" />
          </Link>
        )}
      </div>
    </Card>
  );
}

function MoreConversation({ lessons }: { lessons: LessonSummary[] }) {
  const { t, tn } = useT();
  return (
    <section aria-labelledby="more-heading">
      <h2 id="more-heading" className="text-2xl">
        {t('course.more')}
      </h2>
      <p className="mt-1 text-muted">{t('course.more.lead')}</p>
      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Card className="relative flex h-full flex-col gap-1 p-4 transition-colors sm:p-5 focus-within:ring-2 focus-within:ring-primary hover:bg-primary-soft/40">
              <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 text-lg">
                  <Link
                    to={`/lessons/${lesson.slug}`}
                    className="[overflow-wrap:anywhere] after:absolute after:inset-0 focus:outline-none"
                  >
                    {lesson.title}
                  </Link>
                </h3>
                <Badge tone="primary">{lesson.level}</Badge>
              </div>
              <p className="text-sm text-muted">{lesson.topic}</p>
              <p className="mt-auto pt-1 text-sm">
                {tn('lessons.practised', lesson.conversationCount)}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}
