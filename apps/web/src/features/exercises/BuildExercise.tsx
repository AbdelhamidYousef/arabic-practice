import { normalizeArabic } from '@arabic/shared';
import { useMemo, useState } from 'react';

import { ArabicText } from '../../components/ui/ArabicText';
import { Button } from '../../components/ui/Button';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';
import { shuffled } from '../../lib/shuffle';

import { Feedback } from './Feedback';

export interface BuildExerciseProps {
  prompt: string;
  english: string;
  /** The Arabic words in the right order. */
  words: readonly string[];
  distractors: readonly string[];
  seed?: string;
  onAnswered?: (correct: boolean) => void;
}

const tile =
  'inline-flex min-h-12 min-w-12 items-center justify-center rounded-ui border-2 px-3 py-1 transition-colors';

// Word tiles, shuffled with a few distractors, go up to an answer line that reads right to left.
// Every tile is a button: tap (or Enter/Space) adds it to the line, tapping it on the line takes
// it back. A used tile leaves an empty slot behind so the bank does not jump around.
export function BuildExercise({
  prompt,
  english,
  words,
  distractors,
  seed = 'build',
  onAnswered,
}: BuildExerciseProps) {
  const { t } = useT();
  const tiles = useMemo(
    () =>
      shuffled(
        [...words, ...distractors].map((text, id) => ({ id, text })),
        seed,
      ),
    [words, distractors, seed],
  );
  const [chosen, setChosen] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const built = chosen.map((id) => tiles.find((x) => x.id === id)?.text ?? '');
  const correct =
    built.length === words.length &&
    built.every((w, i) => normalizeArabic(w) === normalizeArabic(words[i] ?? ''));

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">{prompt}</h2>
      <p className="rounded-ui bg-bg px-4 py-3 text-center text-lg">{english}</p>

      <div
        role="group"
        aria-label={t('exercise.build.answer')}
        dir="rtl"
        className={cn(
          'flex min-h-16 flex-wrap items-center gap-2 border-b-2 pb-3',
          checked ? (correct ? 'border-success' : 'border-danger') : 'border-line',
        )}
      >
        {chosen.length === 0 && (
          <span dir="ltr" className="w-full text-center text-sm text-muted">
            {t('exercise.build.empty')}
          </span>
        )}
        {chosen.map((id) => {
          const word = tiles.find((x) => x.id === id)?.text ?? '';
          return (
            <button
              key={id}
              type="button"
              disabled={checked}
              onClick={() => setChosen((c) => c.filter((x) => x !== id))}
              className={cn(tile, 'border-primary bg-primary-soft disabled:cursor-default')}
            >
              <span className="sr-only">{t('exercise.build.remove')} </span>
              <ArabicText className="text-xl">{word}</ArabicText>
            </button>
          );
        })}
      </div>

      <div
        role="group"
        aria-label={t('exercise.build.bank')}
        dir="rtl"
        className="flex flex-wrap justify-center gap-2"
      >
        {tiles.map(({ id, text }) =>
          chosen.includes(id) ? (
            <span
              key={id}
              aria-hidden="true"
              className={cn(tile, 'border-dashed border-line bg-transparent')}
            >
              <ArabicText className="invisible text-xl">{text}</ArabicText>
            </span>
          ) : (
            <button
              key={id}
              type="button"
              disabled={checked}
              onClick={() => setChosen((c) => [...c, id])}
              className={cn(
                tile,
                'border-line bg-surface hover:border-primary disabled:cursor-default disabled:opacity-60',
              )}
            >
              <ArabicText className="text-xl">{text}</ArabicText>
            </button>
          ),
        )}
      </div>

      {!checked ? (
        <Button
          size="lg"
          className="w-full"
          disabled={chosen.length === 0}
          onClick={() => {
            setChecked(true);
            onAnswered?.(correct);
          }}
        >
          {t('exercise.check')}
        </Button>
      ) : (
        <Feedback correct={correct} answer={words.join(' ')} />
      )}
    </div>
  );
}
