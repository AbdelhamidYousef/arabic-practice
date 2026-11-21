import { useId, useState } from 'react';

import { ArabicText } from '../../components/ui/ArabicText';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';
import { speakArabic, useArabicVoice } from '../../lib/speech';

export interface ChooseExerciseProps {
  /** The question, in English ("Which word means "thank you"?"). */
  prompt: string;
  /** Optional Arabic shown big under the prompt (a word to read or hear). */
  promptArabic?: string;
  /** Arabic options; `answer` is the index of the right one. */
  options: readonly string[];
  answer: number;
  onAnswered?: (correct: boolean) => void;
}

// Multiple choice as real radio buttons inside a fieldset: arrow keys move between options and a
// screen reader announces "1 of 4". Check once; the result stays on screen with the right answer.
export function ChooseExercise({
  prompt,
  promptArabic,
  options,
  answer,
  onAnswered,
}: ChooseExerciseProps) {
  const { t } = useT();
  const name = useId();
  const hasVoice = useArabicVoice();
  const [picked, setPicked] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = checked && picked === answer;

  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold">{prompt}</legend>
      {promptArabic && (
        <div className="flex items-center justify-center gap-3">
          <ArabicText className="text-3xl">{promptArabic}</ArabicText>
          {hasVoice && (
            <Button
              variant="secondary"
              size="icon"
              aria-label={t('exercise.listen')}
              onClick={() => speakArabic(promptArabic)}
            >
              <Icon name="speaker" />
            </Button>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option, i) => {
          const state = !checked ? null : i === answer ? 'right' : i === picked ? 'wrong' : null;
          return (
            <label
              key={option}
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
        <p
          role="status"
          className={cn(
            'flex items-center gap-2 rounded-ui px-4 py-3 font-medium',
            correct ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
          )}
        >
          <Icon name={correct ? 'check' : 'close'} />
          <span>
            {correct ? t('exercise.right') : t('exercise.wrong')}{' '}
            {!correct && <ArabicText>{options[answer] ?? ''}</ArabicText>}
          </span>
        </p>
      )}
    </fieldset>
  );
}
