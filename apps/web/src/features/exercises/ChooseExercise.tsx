import { ArabicText } from '../../components/ui/ArabicText';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';
import { useArabicAudio } from '../../lib/audio';

import { OptionsExercise } from './OptionsExercise';

export interface ChooseExerciseProps {
  /** The question, in English ("Which word means "thank you"?"). */
  prompt: string;
  /** Optional Arabic shown big under the prompt (a word to read or hear). */
  promptArabic?: string;
  /** Arabic options; `answer` is the index of the right one. */
  options: readonly string[];
  answer: number;
  seed?: string;
  onAnswered?: (correct: boolean) => void;
}

// Multiple choice: the homepage sample and the lesson player's `choose` exercise.
export function ChooseExercise({ promptArabic, ...rest }: ChooseExerciseProps) {
  const { t } = useT();
  const player = useArabicAudio();
  return (
    <OptionsExercise
      {...rest}
      stem={
        promptArabic
          ? () => (
              <div className="flex items-center justify-center gap-3">
                <ArabicText className="text-3xl">{promptArabic}</ArabicText>
                {player.canPlay(promptArabic) && (
                  <Button
                    variant="secondary"
                    size="icon"
                    aria-label={t('exercise.listen')}
                    onClick={() => player.play(promptArabic)}
                  >
                    <Icon name="speaker" />
                  </Button>
                )}
              </div>
            )
          : undefined
      }
    />
  );
}
