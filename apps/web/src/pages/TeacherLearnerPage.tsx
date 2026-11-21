import {
  CEFR_LEVELS,
  cefrLabel,
  cefrLevelSchema,
  type TeacherLearnerDetailResponse,
} from '@arabic/shared';
import { Link, useParams } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { Alert } from '../components/ui/Alert';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { MistakeBars, RecentMistakes } from '../features/progress/MistakeViews';
import { useSetLearnerLevel, useTeacherLearner } from '../features/teacher/queries';
import { TeacherError, useReadOnlyProps } from '../features/teacher/ReadOnly';
import { useT } from '../i18n';
import { formatDateTime } from '../lib/format';

export default function TeacherLearnerPage() {
  const { t } = useT();
  const { id = '' } = useParams();
  const query = useTeacherLearner(id);
  return (
    <Container className="py-8 sm:py-12">
      <Link to="/teacher" className="text-sm font-medium text-primary underline underline-offset-4">
        {t('teacher.back')}
      </Link>
      <LoadState query={query}>{(data) => <LearnerView data={data} />}</LoadState>
    </Container>
  );
}

function LearnerView({ data }: { data: TeacherLearnerDetailResponse }) {
  const { t, tn } = useT();
  const { learner, conversations, mistakesByType, recentMistakes } = data;
  const setLevel = useSetLearnerLevel(learner.id);
  const readOnly = useReadOnlyProps();

  return (
    <>
      <Seo title={learner.displayName} noindex />
      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="[overflow-wrap:anywhere] text-3xl">{learner.displayName}</h1>
          <p className="mt-1 text-sm text-muted">
            {learner.email && <>{learner.email} · </>}
            {t('teacher.learner.lastSeen', { when: formatDateTime(learner.lastSeenAt) })}
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Select
            label={t('teacher.learner.level')}
            value={learner.level}
            onChange={(e) => {
              const level = cefrLevelSchema.safeParse(e.target.value);
              if (level.success) setLevel.mutate(level.data);
            }}
            {...readOnly}
            {...(setLevel.isPending ? { disabled: true } : {})}
          >
            {CEFR_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l} · {cefrLabel[l]}
              </option>
            ))}
          </Select>
        </div>
      </header>
      {setLevel.isError && (
        <div className="mt-3">
          <TeacherError error={setLevel.error} />
        </div>
      )}
      {setLevel.isSuccess && !setLevel.isPending && (
        <Alert tone="success" className="mt-3">
          {t('teacher.learner.levelSaved')}
        </Alert>
      )}

      <div className="mt-8 space-y-10">
        <section aria-labelledby="types-heading">
          <Card>
            <h2 id="types-heading" className="text-xl">
              {t('progress.byType')}
            </h2>
            <div className="mt-4">
              {mistakesByType.length === 0 ? (
                <p className="text-muted">{t('progress.noMistakes')}</p>
              ) : (
                <MistakeBars items={mistakesByType} />
              )}
            </div>
          </Card>
        </section>

        <section aria-labelledby="recent-heading">
          <h2 id="recent-heading" className="text-xl">
            {t('progress.recent')}
          </h2>
          <div className="mt-4">
            {recentMistakes.length === 0 ? (
              <p className="text-muted">{t('progress.noMistakes')}</p>
            ) : (
              <RecentMistakes items={recentMistakes} linkLessons={false} />
            )}
          </div>
        </section>

        <section aria-labelledby="convs-heading">
          <h2 id="convs-heading" className="text-xl">
            {t('teacher.learner.conversations')}
          </h2>
          {conversations.length === 0 ? (
            <p className="mt-4 text-muted">{t('teacher.learner.noConversations')}</p>
          ) : (
            <ul className="mt-4 divide-y divide-line rounded-ui border border-line bg-surface">
              {conversations.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 p-4"
                >
                  <div className="min-w-0">
                    <p className="[overflow-wrap:anywhere] font-medium">{c.lessonTitle}</p>
                    <p className="text-sm text-muted">
                      {tn('lesson.turns', c.turnCount)} · {formatDateTime(c.lastMessageAt)}
                    </p>
                  </div>
                  <Link
                    to={`/teacher/conversations/${c.id}`}
                    className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4"
                  >
                    {t('teacher.learner.readTranscript')}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
