import type { TeacherTranscriptResponse, TranscriptMessage } from '@arabic/shared';
import { Link, useParams } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { ArabicText } from '../components/ui/ArabicText';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { mistakeTypeKey } from '../features/progress/MistakeViews';
import { useTranscript } from '../features/teacher/queries';
import { useT } from '../i18n';
import { cn } from '../lib/cn';
import { formatDateTime } from '../lib/format';

export default function TeacherConversationPage() {
  const { id = '' } = useParams();
  const query = useTranscript(id);
  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <LoadState query={query}>{(data) => <Transcript data={data} />}</LoadState>
    </Container>
  );
}

function Transcript({ data }: { data: TeacherTranscriptResponse }) {
  const { t, tn } = useT();
  const { conversation, messages } = data;
  return (
    <>
      <Seo title={conversation.lessonTitle} noindex />
      <Link
        to={`/teacher/learners/${conversation.learner.id}`}
        className="text-sm font-medium text-primary underline underline-offset-4"
      >
        {t('teacher.transcript.back', { name: conversation.learner.displayName })}
      </Link>
      <h1 className="mt-3 break-words text-3xl">{conversation.lessonTitle}</h1>
      <p className="mt-1 text-sm text-muted">
        {conversation.learner.displayName} · {tn('lesson.turns', conversation.turnCount)} ·{' '}
        {formatDateTime(conversation.createdAt)}
      </p>
      <p className="mt-1 text-sm text-muted">{t('teacher.transcript.readOnly')}</p>
      {messages.length === 0 ? (
        <EmptyState title={t('teacher.transcript.empty')} />
      ) : (
        <ol className="mt-8 space-y-5">
          {messages.map((m) => (
            <li key={m.id}>
              <Message message={m} learnerName={conversation.learner.displayName} />
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function Message({ message: m, learnerName }: { message: TranscriptMessage; learnerName: string }) {
  const { t } = useT();
  const mine = m.role === 'learner';
  return (
    <div className={cn('flex flex-col gap-2', mine ? 'items-end' : 'items-start')}>
      <p className="text-xs text-muted">
        {mine ? learnerName : t('home.turn.partner')} · {formatDateTime(m.createdAt)}
      </p>
      <div
        className={cn(
          'max-w-[85%] rounded-ui border px-4 py-3',
          mine ? 'border-primary bg-primary-soft' : 'border-line bg-surface',
        )}
      >
        <ArabicText as="p" className="break-words text-xl">
          {m.text}
        </ArabicText>
        {m.glossEn && <p className="mt-1 text-sm text-muted">{m.glossEn}</p>}
      </div>
      {m.correction && (
        <div
          className="w-full max-w-[85%] rounded-ui border-l-4 border-accent bg-accent-soft px-4 py-3 text-sm"
          data-testid="correction"
        >
          {m.correction.isCorrect ? (
            <p className="text-success">{t('teacher.transcript.correct')}</p>
          ) : (
            <>
              <p className="text-accent-strong">{t('home.turn.corrected')}</p>
              <ArabicText as="p" className="break-words text-lg">
                {m.correction.corrected}
              </ArabicText>
            </>
          )}
          {m.correction.praise && <p className="mt-1">{m.correction.praise}</p>}
          {m.correction.mistakes.length > 0 && (
            <ul className="mt-2 space-y-2">
              {m.correction.mistakes.map((x) => (
                <li key={x.id} className="space-y-1">
                  <Badge tone="accent">{t(mistakeTypeKey(x.type))}</Badge>
                  <p className="flex flex-wrap items-baseline gap-x-2 text-base">
                    <ArabicText className="text-danger line-through decoration-1">
                      {x.original}
                    </ArabicText>
                    <span aria-label={t('progress.becomes')}>→</span>
                    <ArabicText className="text-success">{x.correction}</ArabicText>
                  </p>
                  <p>{x.explanation}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
