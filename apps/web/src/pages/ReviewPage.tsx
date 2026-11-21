import type { ReviewCard } from '@arabic/shared';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { Alert } from '../components/ui/Alert';
import { ArabicText } from '../components/ui/ArabicText';
import { Button, buttonClasses } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { useAnswerCard, useDueCards } from '../features/review/queries';
import { useT } from '../i18n';

export default function ReviewPage() {
  const { t } = useT();
  const query = useDueCards();
  return (
    <Container className="max-w-2xl py-8 sm:py-12">
      <Seo title={t('page.review')} />
      <h1 className="text-3xl">{t('page.review')}</h1>
      <LoadState query={query}>
        {({ cards, totalDue }) =>
          cards.length === 0 ? (
            <EmptyState
              title={t('review.empty.title')}
              description={t('review.empty.body')}
              action={
                <Link to="/lessons" className={buttonClasses('primary')}>
                  {t('review.empty.action')}
                </Link>
              }
            />
          ) : (
            <Session
              key={query.dataUpdatedAt}
              cards={cards}
              totalDue={totalDue}
              onMore={() => void query.refetch()}
            />
          )
        }
      </LoadState>
    </Container>
  );
}

interface Result {
  card: ReviewCard;
  knew: boolean;
}

// One session: the cards that were due when the page opened, one at a time. State is local; the
// only thing sent to the server is each answer (it moves the card between Leitner boxes).
function Session({
  cards,
  totalDue,
  onMore,
}: {
  cards: ReviewCard[];
  totalDue: number;
  onMore: () => void;
}) {
  const { t } = useT();
  const answer = useAnswerCard();
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const revealRef = useRef<HTMLButtonElement>(null);
  const card = cards[index];

  const reveal = () => setRevealed(true);
  const submit = (knew: boolean) => {
    if (!card || !revealed || answer.isPending) return;
    answer.mutate(
      { vocabId: card.vocabId, correct: knew },
      {
        onSuccess: () => {
          setResults((r) => [...r, { card, knew }]);
          setIndex((i) => i + 1);
          setRevealed(false);
        },
      },
    );
  };

  // Keyboard: Space shows the meaning, 1 = "I knew it", 2 = "Not yet". A focused button handles
  // Space itself (a click), so the shortcut only acts when focus is elsewhere. Typing in a field
  // is never hijacked.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === ' ' && target?.closest('button, a')) return;
      if (event.key === ' ' && card && !revealed) {
        event.preventDefault();
        reveal();
      } else if (event.key === '1' || event.key === '2') {
        submit(event.key === '1');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // A new card puts focus on its reveal button, so Space works from the keyboard straight away.
  useEffect(() => {
    if (!revealed) revealRef.current?.focus({ preventScroll: true });
  }, [index, revealed]);

  if (!card) return <Summary results={results} onMore={onMore} />;

  return (
    <section aria-label={t('review.session')} className="mt-6">
      <p className="text-sm text-muted">
        <span aria-live="polite">
          {t('review.progress', { current: index + 1, total: cards.length })}
        </span>
        {totalDue > cards.length && (
          <> · {t('review.totalDue', { shown: cards.length, total: totalDue })}</>
        )}
      </p>
      <div
        role="progressbar"
        aria-label={t('review.session')}
        aria-valuemin={0}
        aria-valuemax={cards.length}
        aria-valuenow={index}
        className="mt-2 h-2 w-full rounded-full bg-primary-soft"
      >
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${(index / cards.length) * 100}%` }}
        />
      </div>

      <Card className="mt-4 flex min-h-72 flex-col items-center justify-center gap-4 text-center">
        <p className="text-sm text-muted">{card.lessonTitle}</p>
        <p className="max-w-full break-words text-4xl" data-testid="card-arabic">
          <ArabicText>{card.arabic}</ArabicText>
        </p>
        {revealed ? (
          <div className="space-y-1" aria-live="polite">
            <p className="text-2xl" data-testid="card-english">
              {card.english}
            </p>
            {card.note && <p className="text-sm text-muted">{card.note}</p>}
          </div>
        ) : (
          <Button ref={revealRef} size="lg" onClick={reveal}>
            {t('review.show')}
          </Button>
        )}
      </Card>

      {revealed && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="lg"
            disabled={answer.isPending}
            onClick={() => submit(false)}
          >
            {t('review.notYet')} <kbd className="text-xs text-muted">2</kbd>
          </Button>
          <Button size="lg" disabled={answer.isPending} onClick={() => submit(true)}>
            {t('review.knew')} <kbd className="text-xs opacity-80">1</kbd>
          </Button>
        </div>
      )}
      {answer.isError && (
        <Alert tone="danger" className="mt-4">
          {t('review.answerError')}
        </Alert>
      )}
      <p className="mt-4 text-center text-sm text-muted">{t('review.keys')}</p>
    </section>
  );
}

function Summary({ results, onMore }: { results: Result[]; onMore: () => void }) {
  const { t, tn } = useT();
  const missed = results.filter((r) => !r.knew);
  return (
    <section aria-labelledby="summary-heading" className="mt-6 space-y-6">
      <Card>
        <h2 id="summary-heading" className="text-xl">
          {t('review.done')}
        </h2>
        <p className="mt-2 text-lg">
          {t('review.score', { knew: results.length - missed.length, total: results.length })}
        </p>
        {missed.length > 0 && (
          <>
            <h3 className="mt-4 text-base">{tn('review.again', missed.length)}</h3>
            <ul className="mt-2 divide-y divide-line">
              {missed.map(({ card }) => (
                <li key={card.vocabId} className="flex flex-wrap items-baseline gap-x-4 py-2">
                  <ArabicText className="text-xl">{card.arabic}</ArabicText>
                  <span>{card.english}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onMore}>{t('review.more')}</Button>
        <Link to="/lessons" className={buttonClasses('secondary')}>
          {t('review.toLessons')}
        </Link>
      </div>
    </section>
  );
}
