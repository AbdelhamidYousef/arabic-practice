import type { Exercise } from '@arabic/shared';
import { useEffect, useRef, useState } from 'react';

import { Button } from '../../components/ui/Button';
import { useT } from '../../i18n';

import { BuildExercise } from './BuildExercise';
import { ChooseExercise } from './ChooseExercise';
import { GapExercise } from './GapExercise';
import { ListenExercise } from './ListenExercise';
import { MatchExercise } from './MatchExercise';

interface Turn {
  index: number;
  attempt: number;
}

export interface ExercisePlayerProps {
  exercises: readonly Exercise[];
  /** Fixes the shuffles for this lesson. */
  seed: string;
  onFinish: (score: number) => void;
  onProgress?: (fraction: number) => void;
  saving?: boolean;
}

/** First-try right answers as a share of all exercises, 0..100. */
export function scoreOf(firstTry: Record<number, boolean>, total: number): number {
  if (total === 0) return 0;
  return Math.round((Object.values(firstTry).filter(Boolean).length / total) * 100);
}

// One exercise at a time: answer, Check, see right or wrong, Continue. A wrong exercise comes back
// once at the end (a second miss does not come back again). The score counts first tries only, so
// getting it right the second time teaches without inflating the score.
export function ExercisePlayer({
  exercises,
  seed,
  onFinish,
  onProgress,
  saving = false,
}: ExercisePlayerProps) {
  const { t } = useT();
  const [queue, setQueue] = useState<Turn[]>(() =>
    exercises.map((_, index) => ({ index, attempt: 0 })),
  );
  const [position, setPosition] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);
  const [firstTry, setFirstTry] = useState<Record<number, boolean>>({});
  const continueRef = useRef<HTMLButtonElement>(null);
  const turn = queue[position];
  const last = position === queue.length - 1;

  useEffect(() => {
    onProgress?.((position + (result === null ? 0 : 1)) / Math.max(1, queue.length));
  }, [position, result, queue.length, onProgress]);

  // Check disappears once answered; focus goes to Continue so Enter moves on.
  useEffect(() => {
    if (result !== null) continueRef.current?.focus();
  }, [result]);

  if (!turn) return null;
  const exercise = exercises[turn.index];
  if (!exercise) return null;

  const answered = (correct: boolean) => {
    setResult(correct);
    if (turn.attempt === 0) {
      setFirstTry((f) => ({ ...f, [turn.index]: correct }));
      if (!correct) setQueue((q) => [...q, { index: turn.index, attempt: 1 }]);
    }
  };

  const next = () => {
    if (position + 1 < queue.length) {
      setPosition(position + 1);
      setResult(null);
    } else {
      onFinish(scoreOf(firstTry, exercises.length));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-2xl">{t('practice.title')}</h1>
        <p className="shrink-0 text-sm text-muted tabular-nums">
          {t('practice.counter', { current: position + 1, total: queue.length })}
        </p>
      </div>
      {turn.attempt > 0 && result === null && (
        <p className="-mt-3 text-sm text-muted">{t('practice.retry')}</p>
      )}

      <ExerciseView
        // A fresh component per turn: a requeued exercise starts clean.
        key={position}
        exercise={exercise}
        seed={`${seed}-${turn.index}-${turn.attempt}`}
        onAnswered={answered}
      />

      {result !== null && (
        <div className="space-y-3">
          {result === false && turn.attempt === 0 && (
            <p className="text-sm text-muted">{t('practice.again')}</p>
          )}
          <Button ref={continueRef} size="lg" className="w-full" loading={saving} onClick={next}>
            {last ? t('practice.finish') : t('player.continue')}
          </Button>
        </div>
      )}
    </div>
  );
}

function ExerciseView({
  exercise,
  seed,
  onAnswered,
}: {
  exercise: Exercise;
  seed: string;
  onAnswered: (correct: boolean) => void;
}) {
  switch (exercise.type) {
    case 'choose':
      return (
        <ChooseExercise
          prompt={exercise.prompt}
          {...(exercise.promptArabic !== undefined && { promptArabic: exercise.promptArabic })}
          options={exercise.options}
          answer={exercise.answer}
          seed={seed}
          onAnswered={onAnswered}
        />
      );
    case 'listen':
      return (
        <ListenExercise
          prompt={exercise.prompt}
          audio={exercise.audio}
          options={exercise.options}
          answer={exercise.answer}
          seed={seed}
          onAnswered={onAnswered}
        />
      );
    case 'gap':
      return (
        <GapExercise
          prompt={exercise.prompt}
          before={exercise.before}
          after={exercise.after}
          english={exercise.english}
          options={exercise.options}
          answer={exercise.answer}
          seed={seed}
          onAnswered={onAnswered}
        />
      );
    case 'match':
      return (
        <MatchExercise
          prompt={exercise.prompt}
          pairs={exercise.pairs}
          seed={seed}
          onAnswered={onAnswered}
        />
      );
    case 'build':
      return (
        <BuildExercise
          prompt={exercise.prompt}
          english={exercise.english}
          words={exercise.words}
          distractors={exercise.distractors}
          seed={seed}
          onAnswered={onAnswered}
        />
      );
  }
}
