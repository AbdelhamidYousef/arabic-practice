import { ArabicText } from '../../components/ui/ArabicText';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';
import { useArabicAudio } from '../../lib/audio';

import { OptionsExercise } from './OptionsExercise';

export interface ListenExerciseProps {
  prompt: string;
  /** The Arabic that is played (its recorded clip, or the device voice). */
  audio: string;
  options: readonly string[];
  answer: number;
  seed?: string;
  onAnswered?: (correct: boolean) => void;
}

// Hear it, pick it. With no recorded clip and no Arabic device voice there is no sound to play, so
// the exercise turns into a reading question (the same Arabic, written) instead of a dead end.
export function ListenExercise({ prompt, audio, ...rest }: ListenExerciseProps) {
  const { t } = useT();
  const player = useArabicAudio();
  return (
    <OptionsExercise
      {...rest}
      prompt={player.canPlay(audio) ? prompt : t('exercise.listen.read')}
      stem={() =>
        player.canPlay(audio) ? (
          <div className="flex justify-center">
            <Button
              size="lg"
              className="size-20 rounded-full p-0"
              aria-label={t('exercise.play')}
              onClick={() => player.play(audio)}
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
