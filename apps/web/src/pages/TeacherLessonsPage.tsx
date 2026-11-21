import { Link } from 'react-router-dom';

import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { Badge } from '../components/ui/Badge';
import { buttonClasses } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Td, TableScroll, Th, THead, Tr } from '../components/ui/Table';
import { useTeacherLessons } from '../features/teacher/queries';
import { useReadOnly } from '../features/teacher/ReadOnly';
import { useT } from '../i18n';
import { cn } from '../lib/cn';

export default function TeacherLessonsPage() {
  const { t } = useT();
  const query = useTeacherLessons();
  const readOnly = useReadOnly();
  return (
    <Container className="py-8 sm:py-12">
      <Seo title={t('page.teacherLessons')} noindex />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">{t('page.teacherLessons')}</h1>
          <p className="mt-2 text-muted">{t('tlessons.lead')}</p>
        </div>
        {readOnly ? (
          <span>
            <span
              aria-disabled="true"
              title={t('readOnly.hint')}
              className={cn(buttonClasses('primary'), 'cursor-not-allowed opacity-60')}
            >
              {t('tlessons.new')}
            </span>
          </span>
        ) : (
          <Link to="/teacher/lessons/new" className={buttonClasses('primary')}>
            {t('tlessons.new')}
          </Link>
        )}
      </div>
      {readOnly && <p className="mt-2 text-sm text-muted">{t('readOnly.hint')}</p>}
      <LoadState query={query}>
        {({ lessons }) =>
          lessons.length === 0 ? (
            <EmptyState title={t('tlessons.empty.title')} description={t('tlessons.empty.body')} />
          ) : (
            <div className="mt-6">
              <TableScroll label={t('page.teacherLessons')}>
                <THead>
                  <tr>
                    <Th>{t('tlessons.col.title')}</Th>
                    <Th>{t('teacher.col.level')}</Th>
                    <Th>{t('tlessons.col.status')}</Th>
                    <Th className="text-right">{t('tlessons.col.position')}</Th>
                    <Th className="text-right">{t('tlessons.col.vocab')}</Th>
                    <Th className="text-right">{t('tlessons.col.conversations')}</Th>
                  </tr>
                </THead>
                <tbody>
                  {lessons.map((l) => (
                    <Tr key={l.id}>
                      <Td className="max-w-72 break-words">
                        <Link
                          to={`/teacher/lessons/${l.id}`}
                          className="font-medium text-primary underline underline-offset-4"
                        >
                          {l.title}
                        </Link>
                        <p className="text-muted">{l.topic}</p>
                      </Td>
                      <Td>
                        <Badge tone="primary">{l.level}</Badge>
                      </Td>
                      <Td>
                        <Badge tone={l.status === 'published' ? 'success' : 'neutral'}>
                          {t(
                            l.status === 'published'
                              ? 'editor.status.published'
                              : 'editor.status.draft',
                          )}
                        </Badge>
                      </Td>
                      <Td className="text-right tabular-nums">{l.position}</Td>
                      <Td className="text-right tabular-nums">{l.vocabCount}</Td>
                      <Td className="text-right tabular-nums">{l.conversationCount}</Td>
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
