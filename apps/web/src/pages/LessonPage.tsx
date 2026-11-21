import type { LessonConversation, LessonDetailResponse } from '@arabic/shared';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ApiError } from '../api/client';
import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { Alert } from '../components/ui/Alert';
import { ArabicText } from '../components/ui/ArabicText';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LessonHub } from '../features/course/LessonHub';
import { isCourseLesson } from '../features/course/steps';
import { useLesson } from '../features/lessons/queries';
import { useStartConversation } from '../features/practice/mutations';
import { useT } from '../i18n';

export default function LessonPage() {
  const { t } = useT();
  const { slug = '' } = useParams();
  const query = useLesson(slug);
  const course = query.data ? isCourseLesson(query.data) : false;
  return (
    <Container className="py-8 sm:py-12">
      <Link
        to="/lessons"
        className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4"
      >
        {course ? t('hub.back') : t('lesson.back')}
      </Link>
      <LoadState query={query}>
        {(data) =>
          // Course lessons get the five-step hub; the older chat lessons keep their page.
          isCourseLesson(data) ? <LessonHub data={data} /> : <LessonView data={data} />
        }
      </LoadState>
    </Container>
  );
}

function LessonView({ data }: { data: LessonDetailResponse }) {
  const { t } = useT();
  const navigate = useNavigate();
  const start = useStartConversation();
  const [showHarakat, setShowHarakat] = useState(true);
  const { lesson, vocab, conversations } = data;

  const startPractice = () =>
    start.mutate(lesson.id, {
      onSuccess: ({ conversation }) => navigate(`/practice/${conversation.id}`),
    });

  return (
    <>
      <Seo title={lesson.title} description={lesson.summary} />
      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="primary">{lesson.level}</Badge>
            <span className="text-sm text-muted">{lesson.topic}</span>
          </div>
          <h1 className="mt-2 [overflow-wrap:anywhere] text-3xl">{lesson.title}</h1>
        </div>
        <Button
          size="lg"
          loading={start.isPending}
          onClick={startPractice}
          className="max-sm:w-full"
        >
          {t('lesson.start')}
        </Button>
      </header>
      {start.error && (
        <Alert tone="danger" className="mt-4">
          {start.error instanceof ApiError && start.error.code === 'RATE_LIMITED'
            ? t('auth.error.rateLimited')
            : t('lesson.startError')}
        </Alert>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-8">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="text-xl">
              {t('lesson.summary')}
            </h2>
            <p className="mt-2 max-w-prose">{lesson.summary}</p>
          </section>

          <section aria-labelledby="goals-heading">
            <h2 id="goals-heading" className="text-xl">
              {t('lesson.goals')}
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {lesson.goals.map((goal) => (
                <li key={goal}>{goal}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="grammar-heading">
            <h2 id="grammar-heading" className="text-xl">
              {t('lesson.grammar')}
            </h2>
            <p className="mt-2 max-w-prose">{lesson.grammarFocus}</p>
          </section>

          <section aria-labelledby="vocab-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="vocab-heading" className="text-xl">
                {t('lesson.vocab')}
              </h2>
              <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  checked={showHarakat}
                  onChange={(e) => setShowHarakat(e.target.checked)}
                />
                {t('lesson.harakat.toggle')}
              </label>
            </div>
            {vocab.length === 0 ? (
              <p className="mt-2 text-muted">{t('lesson.vocab.empty')}</p>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-ui border border-line bg-surface">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-primary-soft/50">
                    <tr>
                      <th scope="col" className="px-4 py-2 font-medium">
                        {t('lesson.vocab.arabic')}
                      </th>
                      <th scope="col" className="px-4 py-2 font-medium">
                        {t('lesson.vocab.english')}
                      </th>
                      <th scope="col" className="px-4 py-2 font-medium">
                        {t('lesson.vocab.note')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vocab.map((word) => (
                      <tr key={word.id} className="border-b border-line last:border-b-0">
                        <td className="px-4 py-2 text-lg">
                          <ArabicText hideHarakat={!showHarakat}>{word.arabic}</ArabicText>
                        </td>
                        <td className="px-4 py-2">{word.english}</td>
                        <td className="px-4 py-2 text-muted">{word.note ?? ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <aside aria-labelledby="recent-heading">
          <Card className="p-5">
            <h2 id="recent-heading" className="text-lg">
              {t('lesson.recent')}
            </h2>
            {conversations.length === 0 ? (
              <p className="mt-2 text-sm text-muted">{t('lesson.recent.empty')}</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {conversations.map((c) => (
                  <RecentConversation key={c.id} conversation={c} />
                ))}
              </ul>
            )}
          </Card>
        </aside>
      </div>
    </>
  );
}

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });

export function RecentConversation({ conversation }: { conversation: LessonConversation }) {
  const { t, tn } = useT();
  const when = dateFormat.format(new Date(conversation.lastMessageAt));
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3">
      <div className="min-w-0 text-sm">
        <p>{tn('lesson.turns', conversation.turnCount)}</p>
        <p className="text-muted">{t('lesson.lastActive', { when })}</p>
      </div>
      <Link
        to={`/practice/${conversation.id}`}
        className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
      >
        {t('lesson.continue')}
        <span className="sr-only"> {when}</span>
      </Link>
    </li>
  );
}
