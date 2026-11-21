import { useEffect, useMemo, useState } from 'react';

import { ArabicText } from '../../components/ui/ArabicText';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';
import { shuffledOrder } from '../../lib/shuffle';

import { Feedback } from './Feedback';

export interface MatchExerciseProps {
  prompt: string;
  pairs: readonly { arabic: string; english: string }[];
  seed?: string;
  onAnswered?: (correct: boolean) => void;
}

type Side = 'arabic' | 'english';
// How long a wrong pair stays red before both items can be picked again.
const FLASH_MS = 700;

// Tap an item on one side, then its partner on the other (either side first). A right pair locks
// in the success colours; a wrong pair flashes red and is counted. Every item is a button, so Tab
// and Enter/Space do it all; a matched item stays focusable (aria-disabled) so focus is not lost.
// It is right only when no wrong pair was tried; it finishes by itself when all pairs are found.
export function MatchExercise({ prompt, pairs, seed = 'match', onAnswered }: MatchExerciseProps) {
  const { t, tn } = useT();
  const arabicOrder = useMemo(() => shuffledOrder(pairs.length, `${seed}-ar`), [pairs, seed]);
  const englishOrder = useMemo(() => shuffledOrder(pairs.length, `${seed}-en`), [pairs, seed]);
  const [selected, setSelected] = useState<{ side: Side; index: number } | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState<{ arabic: number; english: number } | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [message, setMessage] = useState('');
  const done = matched.length === pairs.length;

  useEffect(() => {
    if (!wrong) return;
    const timer = setTimeout(() => setWrong(null), FLASH_MS);
    return () => clearTimeout(timer);
  }, [wrong]);

  const pick = (side: Side, index: number) => {
    if (done || matched.includes(index)) return;
    if (!selected || selected.side === side) {
      setSelected(selected?.side === side && selected.index === index ? null : { side, index });
      return;
    }
    const arabic = side === 'arabic' ? index : selected.index;
    const english = side === 'english' ? index : selected.index;
    setSelected(null);
    if (arabic === english) {
      const next = [...matched, arabic];
      setMatched(next);
      setMessage(t('exercise.match.right'));
      if (next.length === pairs.length) onAnswered?.(mistakes === 0);
    } else {
      setWrong({ arabic, english });
      setMistakes((m) => m + 1);
      setMessage(t('exercise.match.wrong'));
    }
  };

  const item = (side: Side, index: number) => {
    const pair = pairs[index];
    if (!pair) return null;
    const isMatched = matched.includes(index);
    const isSelected = selected?.side === side && selected.index === index;
    const isWrong = wrong?.[side] === index;
    return (
      <li key={index}>
        <button
          type="button"
          aria-pressed={isSelected}
          aria-disabled={isMatched || undefined}
          onClick={() => !isMatched && pick(side, index)}
          className={cn(
            'flex min-h-14 w-full items-center justify-center gap-2 rounded-ui border-2 px-3 py-2 text-center transition-colors',
            isMatched && 'cursor-default border-success bg-success-soft text-success',
            !isMatched && isWrong && 'shake border-danger bg-danger-soft',
            !isMatched && !isWrong && isSelected && 'border-primary bg-primary-soft',
            !isMatched && !isWrong && !isSelected && 'border-line bg-surface hover:border-primary',
          )}
        >
          {isMatched && <Icon name="check" className="size-4" />}
          {side === 'arabic' ? (
            <ArabicText className="text-xl">{pair.arabic}</ArabicText>
          ) : (
            <span>{pair.english}</span>
          )}
        </button>
      </li>
    );
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">{prompt}</h2>
      <div className="grid grid-cols-2 gap-3">
        <ul aria-label={t('exercise.match.arabic')} className="space-y-3">
          {arabicOrder.map((i) => item('arabic', i))}
        </ul>
        <ul aria-label={t('exercise.match.english')} className="space-y-3">
          {englishOrder.map((i) => item('english', i))}
        </ul>
      </div>
      {done ? (
        <Feedback
          correct={mistakes === 0}
          message={
            mistakes === 0 ? t('exercise.match.done') : tn('exercise.match.doneMistakes', mistakes)
          }
        />
      ) : (
        <p role="status" className="min-h-6 text-center text-sm text-muted">
          {message}
        </p>
      )}
    </div>
  );
}
