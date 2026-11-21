import { useT } from '../../i18n';
import { cn } from '../../lib/cn';

import { OptionsExercise } from './OptionsExercise';

export interface GapExerciseProps {
  prompt: string;
  before: string;
  after: string;
  english: string;
  options: readonly string[];
  answer: number;
  seed?: string;
  onAnswered?: (correct: boolean) => void;
}

// A sentence with one word missing. The blank shows the picked option as the learner chooses, and
// after Check it shows the right word.
export function GapExercise({
  before,
  after,
  english,
  options,
  answer,
  ...rest
}: GapExerciseProps) {
  const { t } = useT();
  return (
    <OptionsExercise
      {...rest}
      options={options}
      answer={answer}
      stem={({ picked, checked }) => {
        const shown = checked ? options[answer] : picked !== null ? options[picked] : undefined;
        return (
          <div className="rounded-ui bg-bg px-4 py-5 text-center">
            <p lang="ar" dir="rtl" className="arabic text-3xl">
              {before && <span>{before} </span>}
              <span
                className={cn(
                  'inline-block min-w-20 border-b-2 px-2',
                  checked ? 'border-success text-success' : 'border-dashed border-primary',
                )}
              >
                {shown ?? (
                  <span lang="en" dir="ltr" className="sr-only">
                    {t('exercise.gap.blank')}
                  </span>
                )}
                {shown === undefined && <span aria-hidden="true">&nbsp;</span>}
              </span>
              {after && <span> {after}</span>}
            </p>
            <p className="mt-2 text-muted">{english}</p>
          </div>
        );
      }}
    />
  );
}
