import { lessonStepSchema, type LessonDetailResponse, type LessonStep } from '@arabic/shared';
import { useCallback, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { Alert } from '../components/ui/Alert';
import { Icon } from '../components/ui/Icon';
import { useRecordStep } from '../features/course/queries';
import { STEP_META, learnPath, stepsOf } from '../features/course/steps';
import { WordsStep } from '../features/course/WordsStep';
import { ExercisePlayer } from '../features/exercises/ExercisePlayer';
import { useLesson } from '../features/lessons/queries';
import { useT } from '../i18n';

// The lesson player: one step per URL (`/lessons/:slug/learn/:step`), in a focused frame with no
// site header or footer. The component stays mounted while the step changes (same route), so the
// XP earned on the way is kept for the finish screen.
export default function LessonPlayerPage() {
  const { slug = '', step = '' } = useParams();
  const query = useLesson(slug);
  return <LoadState query={query}>{(data) => <Player data={data} step={step} />}</LoadState>;
}

export interface Session {
  xp: number;
  streak: number | null;
}

function Player({ data, step }: { data: LessonDetailResponse; step: string }) {
  const { t } = useT();
  const navigate = useNavigate();
  const { lesson } = data;
  const steps = stepsOf(data);
  const record = useRecordStep(lesson.slug);
  const [, setSession] = useState<Session>({ xp: 0, streak: null });
  const [inner, setInner] = useState<{ step: string; fraction: number }>({ step, fraction: 0 });
  const onProgress = useCallback((fraction: number) => setInner({ step, fraction }), [step]);

  const parsed = lessonStepSchema.safeParse(step);
  const current: LessonStep | null =
    parsed.success && steps.includes(parsed.data) ? parsed.data : null;
  const hub = `/lessons/${lesson.slug}`;
  if (!current) return <Navigate to={hub} replace />;

  const index = steps.indexOf(current);
  const fraction = inner.step === step ? inner.fraction : 0;
  const overall = Math.round(((index + fraction) / steps.length) * 100);

  const complete = (score?: number) => {
    record.mutate(
      { step: current, ...(score !== undefined && { score }) },
      {
        onSuccess: (res) => {
          if (res) setSession((s) => ({ xp: s.xp + res.xpGained, streak: res.streak }));
          navigate(learnPath(lesson.slug, steps[index + 1] ?? 'done'));
        },
      },
    );
  };

  const stepProps = { data, onComplete: complete, onProgress, saving: record.isPending };

  return (
    <div className="min-h-dvh">
      <Seo title={`${t(STEP_META[current].title)} · ${lesson.title}`} noindex />
      <div className="sticky top-0 z-20 border-b border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-2 sm:px-6">
          <Link
            to={hub}
            aria-label={t('player.close')}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-ui text-muted hover:bg-primary-soft hover:text-ink"
          >
            <Icon name="close" className="size-6" />
          </Link>
          <div
            role="progressbar"
            aria-label={t('player.progress')}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={overall}
            className="h-3 flex-1 overflow-hidden rounded-full bg-primary-soft"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${overall}%` }}
            />
          </div>
          <p className="shrink-0 text-sm text-muted tabular-nums">
            {t('player.stepOf', { current: index + 1, total: steps.length })}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
        {current === 'words' && <WordsStep {...stepProps} />}
        {current === 'practice' && (
          <ExercisePlayer
            exercises={data.exercises}
            seed={lesson.slug}
            onFinish={(score) => complete(score)}
            onProgress={onProgress}
            saving={record.isPending}
          />
        )}
        {record.isError && (
          <Alert tone="danger" className="mt-4">
            {t('player.saveError')}
          </Alert>
        )}
      </div>
    </div>
  );
}
