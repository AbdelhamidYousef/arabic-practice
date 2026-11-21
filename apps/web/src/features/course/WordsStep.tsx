import type { LessonVocab } from '@arabic/shared';
import { useEffect, useState } from 'react';

import { ArabicText } from '../../components/ui/ArabicText';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';
import { useArabicAudio } from '../../lib/audio';
import { cn } from '../../lib/cn';

import type { StepProps } from './step-props';

// Flashcards, one word at a time. The card is a real button: a tap, Space or Enter flips it to the
// transliteration and meaning, and a polite live region reads the back out. Space and Enter also
// flip it when focus is on the page rather than on another control, so a keyboard user never has
// to Tab to the card first.
export function WordsStep({ data, onComplete, onProgress, saving }: StepProps) {
  const { t } = useT();
  const words = data.vocab;
  const player = useArabicAudio();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const word = words[index];
  const last = index === words.length - 1;

  useEffect(
    () => onProgress((index + 1) / Math.max(1, words.length)),
    [index, words.length, onProgress],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('button, a, input, textarea, select, [role="tab"]')) return;
      event.preventDefault();
      setFlipped((f) => !f);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!word) return null;
  const go = (next: number) => {
    setIndex(next);
    setFlipped(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-3">
        <h1 className="text-2xl">{t('words.title')}</h1>
        <p className="shrink-0 text-sm text-muted tabular-nums">
          {t('words.counter', { current: index + 1, total: words.length })}
        </p>
      </div>

      <button
        type="button"
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
        className="w-full rounded-3xl border border-line bg-surface shadow-card transition-colors hover:border-primary"
      >
        <span
          // A new key per face replays the flip animation.
          key={`${index}-${flipped ? 'back' : 'front'}`}
          className="flip-in flex min-h-72 flex-col items-center justify-center gap-2 px-6 py-10 text-center"
        >
          <FlashFace word={word} flipped={flipped} />
        </span>
      </button>
      <p className="sr-only" role="status">
        {flipped ? t('words.flipped', { translit: word.translit, english: word.english }) : ''}
      </p>
      <p className="-mt-2 text-center text-sm text-muted">
        {flipped ? t('words.flipBackHint') : t('words.flipHint')}
      </p>

      {player.canPlay(word.arabic) && (
        <Button
          variant="secondary"
          className="self-center"
          onClick={() => player.play(word.arabic)}
        >
          <Icon name="speaker" />
          {t('words.listen')}
        </Button>
      )}

      <div className="mt-2 grid grid-cols-2 gap-3">
        <Button variant="secondary" size="lg" disabled={index === 0} onClick={() => go(index - 1)}>
          <Icon name="arrow" className="rotate-180" />
          {t('words.previous')}
        </Button>
        {last ? (
          <Button size="lg" loading={saving} onClick={() => onComplete()}>
            {t('words.finish')}
          </Button>
        ) : (
          <Button size="lg" onClick={() => go(index + 1)}>
            {t('words.next')}
            <Icon name="arrow" />
          </Button>
        )}
      </div>
    </div>
  );
}

function FlashFace({ word, flipped }: { word: LessonVocab; flipped: boolean }) {
  if (!flipped) {
    return (
      <ArabicText as="span" className="block text-5xl sm:text-6xl">
        {word.arabic}
      </ArabicText>
    );
  }
  return (
    <>
      <ArabicText as="span" className="block text-3xl">
        {word.arabic}
      </ArabicText>
      <span className="block text-lg text-muted">{word.translit}</span>
      <span className={cn('block text-2xl font-semibold')}>{word.english}</span>
      {word.note && <span className="mt-2 block max-w-sm text-sm text-muted">{word.note}</span>}
    </>
  );
}
