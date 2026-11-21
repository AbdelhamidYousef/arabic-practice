import { cefrLabel, type LessonSummary } from '@arabic/shared';
import { Link } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { useLessons } from '../features/lessons/queries';
import { useT } from '../i18n';

export default function LessonsPage() {
  const { t, tn } = useT();
  const query = useLessons();
  return (
    <Container className="py-8 sm:py-12">
      <Seo title={t('page.lessons')} />
      <h1 className="text-3xl">{t('page.lessons')}</h1>
      <p className="mt-2 text-muted">{t('lessons.lead')}</p>
      <LoadState query={query}>
        {({ levels }) =>
          levels.length === 0 ? (
            <EmptyState title={t('lessons.empty.title')} description={t('lessons.empty.body')} />
          ) : (
            <div className="mt-8 space-y-10">
              {levels.map(({ level, lessons }) => (
                <section key={level} aria-labelledby={`level-${level}`}>
                  <h2
                    id={`level-${level}`}
                    className="flex flex-wrap items-baseline gap-x-3 text-xl"
                  >
                    {t('lessons.level', { level })}
                    <span className="text-sm font-normal text-muted">{cefrLabel[level]}</span>
                  </h2>
                  <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <LessonCard
                          lesson={lesson}
                          practised={tn('lessons.practised', lesson.conversationCount)}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )
        }
      </LoadState>
    </Container>
  );
}

function LessonCard({ lesson, practised }: { lesson: LessonSummary; practised: string }) {
  return (
    <Card className="relative flex h-full flex-col gap-2 p-5 transition-colors focus-within:ring-2 focus-within:ring-primary hover:bg-primary-soft/40">
      <div className="flex items-start justify-between gap-3">
        <h3 className="min-w-0 text-lg">
          {/* The link's ::after stretches over the whole card, so the card is one click target. */}
          <Link
            to={`/lessons/${lesson.slug}`}
            className="[overflow-wrap:anywhere] after:absolute after:inset-0 focus:outline-none"
          >
            {lesson.title}
          </Link>
        </h3>
        <Badge tone="primary">{lesson.level}</Badge>
      </div>
      <p className="text-sm text-muted">{lesson.topic}</p>
      <p className="mt-auto pt-2 text-sm">{practised}</p>
    </Card>
  );
}
