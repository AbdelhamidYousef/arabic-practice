import { Link } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { Badge } from '../components/ui/Badge';
import { buttonClasses } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Td, TableScroll, Th, THead, Tr } from '../components/ui/Table';
import { mistakeTypeKey } from '../features/progress/MistakeViews';
import { useTeacherLearners } from '../features/teacher/queries';
import { useT } from '../i18n';
import { formatDateTime } from '../lib/format';

export default function TeacherHomePage() {
  const { t } = useT();
  const query = useTeacherLearners();
  return (
    <Container className="py-8 sm:py-12">
      <Seo title={t('page.teacher')} noindex />
      <h1 className="text-3xl">{t('page.teacher')}</h1>
      <p className="mt-2 text-muted">{t('teacher.lead')}</p>
      <nav aria-label={t('teacher.quickLinks')} className="mt-4 flex flex-wrap gap-3">
        <Link to="/teacher/lessons" className={buttonClasses('secondary')}>
          {t('teacher.link.lessons')}
        </Link>
        <Link to="/teacher/invites" className={buttonClasses('secondary')}>
          {t('teacher.link.invites')}
        </Link>
        <Link to="/teacher/usage" className={buttonClasses('secondary')}>
          {t('teacher.link.usage')}
        </Link>
      </nav>

      <h2 className="mt-10 text-xl">{t('teacher.learners')}</h2>
      <LoadState query={query}>
        {({ learners }) =>
          learners.length === 0 ? (
            <EmptyState
              title={t('teacher.learners.empty.title')}
              description={t('teacher.learners.empty.body')}
              action={
                <Link to="/teacher/invites" className={buttonClasses('primary')}>
                  {t('teacher.learners.empty.action')}
                </Link>
              }
            />
          ) : (
            <div className="mt-4">
              <TableScroll label={t('teacher.learners')}>
                <THead>
                  <tr>
                    <Th>{t('teacher.col.name')}</Th>
                    <Th>{t('teacher.col.level')}</Th>
                    <Th>{t('teacher.col.lastActive')}</Th>
                    <Th className="text-right">{t('teacher.col.turnsWeek')}</Th>
                    <Th>{t('teacher.col.topMistakes')}</Th>
                  </tr>
                </THead>
                <tbody>
                  {learners.map((l) => (
                    <Tr key={l.id}>
                      <Td>
                        <Link
                          to={`/teacher/learners/${l.id}`}
                          className="font-medium text-primary underline underline-offset-4"
                        >
                          {l.displayName}
                        </Link>
                      </Td>
                      <Td>
                        <Badge tone="primary">{l.level}</Badge>
                      </Td>
                      <Td>
                        {l.lastActivityAt ? (
                          formatDateTime(l.lastActivityAt)
                        ) : (
                          <span className="text-muted">{t('teacher.neverActive')}</span>
                        )}
                      </Td>
                      <Td className="text-right tabular-nums">{l.turnsThisWeek}</Td>
                      <Td>
                        {l.topMistakeTypes.length === 0 ? (
                          <span className="text-muted">–</span>
                        ) : (
                          <ul className="flex flex-wrap gap-1.5">
                            {l.topMistakeTypes.map((m) => (
                              <li key={m.type}>
                                <Badge tone="accent">
                                  {t(mistakeTypeKey(m.type))} {m.count}
                                </Badge>
                              </li>
                            ))}
                          </ul>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </TableScroll>
            </div>
          )
        }
      </LoadState>
    </Container>
  );
}
