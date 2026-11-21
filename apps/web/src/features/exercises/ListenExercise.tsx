import { ArabicText } from '../../components/ui/ArabicText';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';
import { speakArabic, useArabicVoice } from '../../lib/speech';

import { OptionsExercise } from './OptionsExercise';

export interface ListenExerciseProps {
  prompt: string;
  /** The Arabic the browser voice reads aloud. */
  audio: string;
  options: readonly string[];
  answer: number;
  seed?: string;
  onAnswered?: (correct: boolean) => void;
}

// Hear it, pick it. A device without an Arabic voice cannot play the sound, so the exercise turns
// into a reading question (the same Arabic, written) instead of a dead end.
export function ListenExercise({ prompt, audio, ...rest }: ListenExerciseProps) {
  const { t } = useT();
  const hasVoice = useArabicVoice();
  return (
    <OptionsExercise
      {...rest}
      prompt={hasVoice ? prompt : t('exercise.listen.read')}
      stem={() =>
        hasVoice ? (
          <div className="flex justify-center">
            <Button
              size="lg"
              className="size-20 rounded-full p-0"
              aria-label={t('exercise.play')}
              onClick={() => speakArabic(audio)}
            >
              <Icon name="speaker" className="size-8" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2 text-center">
            <ArabicText as="p" className="text-3xl">
              {audio}
            </ArabicText>
            <p className="text-sm text-muted">{t('exercise.listen.noVoice')}</p>
          </div>
        )
      }
    />
  );
}
