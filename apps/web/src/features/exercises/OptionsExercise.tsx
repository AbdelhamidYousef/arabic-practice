import { useId, useMemo, useState, type ReactNode } from 'react';

import { ArabicText } from '../../components/ui/ArabicText';
import { Button } from '../../components/ui/Button';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';
import { shuffledOrder } from '../../lib/shuffle';

import { Feedback } from './Feedback';

export interface OptionsState {
  picked: number | null;
  checked: boolean;
}

export interface OptionsExerciseProps {
  /** The question, in English. */
  prompt: string;
  /** What sits between the question and the options: an Arabic word, a play button, a sentence. */
  stem?: (state: OptionsState) => ReactNode;
  /** Arabic options; `answer` is the index of the right one in this array. */
  options: readonly string[];
  answer: number;
  /** Shuffles the options in a fixed order for this seed; without one they keep their order. */
  seed?: string;
  onAnswered?: (correct: boolean) => void;
}

// Pick one, then Check. Real radio buttons in a fieldset: arrow keys move between options, Tab
// goes on to Check, and a screen reader announces "1 of 4". Options are rendered in a shuffled
// order, but every comparison uses the index into the original `options`, so `answer` stays true.
export function OptionsExercise({
  prompt,
  stem,
  options,
  answer,
  seed,
  onAnswered,
}: OptionsExerciseProps) {
  const { t } = useT();
  const name = useId();
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const order = useMemo(
    () => (seed ? shuffledOrder(options.length, seed) : options.map((_, i) => i)),
    [options, seed],
  );

  return (
    <fieldset className="space-y-5">
      <legend className="text-lg font-semibold">{prompt}</legend>
      {stem?.({ picked, checked })}
      <div className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2">
        {order.map((i) => {
          const option = options[i] ?? '';
          const state = !checked ? null : i === answer ? 'right' : i === picked ? 'wrong' : null;
          return (
            <label
              key={i}
              className={cn(
                'flex min-h-14 cursor-pointer items-center justify-center rounded-ui border-2 bg-surface px-3 py-2 text-center transition-colors',
                'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary',
                state === 'right' && 'border-success bg-success-soft',
                state === 'wrong' && 'border-danger bg-danger-soft',
                !state && picked === i && 'border-primary bg-primary-soft',
                !state && picked !== i && 'border-line hover:border-primary',
                checked && 'cursor-default',
              )}
            >
              <input
                type="radio"
                name={name}
                className="sr-only"
                checked={picked === i}
                disabled={checked}
                onChange={() => setPicked(i)}
              />
              <ArabicText className="text-xl">{option}</ArabicText>
            </label>
          );
        })}
      </div>
      {!checked ? (
        <Button
          size="lg"
          className="w-full"
          disabled={picked === null}
          onClick={() => {
            setChecked(true);
            onAnswered?.(picked === answer);
          }}
        >
          {t('exercise.check')}
        </Button>
      ) : (
        <Feedback correct={picked === answer} answer={options[answer] ?? ''} />
      )}
    </fieldset>
  );
}
