import type { TeacherLessonDetail } from '@arabic/shared';

import { Alert } from '../../components/ui/Alert';
import { ArabicText } from '../../components/ui/ArabicText';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';

/** Whether the lesson has any course part to show (teacher-made lessons have none). */
export function hasCourseContent({ course }: TeacherLessonDetail): boolean {
  return (
    course.unit !== null ||
    course.exercises.length > 0 ||
    course.grammarBlocks > 0 ||
    course.cultureTitle !== null
  );
}

// The parts of a course lesson the form cannot edit, shown read-only above it: they come from the
// content files, so a teacher sees what learners get without being offered a change that the next
// seed would undo.
export function CourseContent({ lesson }: { lesson: TeacherLessonDetail }) {
  const { t, tn } = useT();
  const { course, vocab } = lesson;
  const exerciseTotal = course.exercises.reduce((n, e) => n + e.count, 0);
  return (
    <section aria-labelledby="course-content" className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="course-content" className="text-xl">
          {t('tcourse.title')}
        </h2>
        {course.unit && (
          <Badge tone="primary">
            {t('tcourse.unit', { code: course.unit.code, title: course.unit.title })}
          </Badge>
        )}
        {course.kind === 'letters' && <Badge>{t('course.letters')}</Badge>}
      </div>
      {course.unit && <Alert tone="info">{t('tcourse.fromFiles')}</Alert>}

      <ul className="grid gap-3 sm:grid-cols-3">
        <li>
          <Card className="h-full p-4">
            <p className="flex items-center gap-2 font-semibold">
              <Icon name="check" className="text-primary" />
              {tn('tcourse.exercises', exerciseTotal)}
            </p>
            {course.exercises.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-1.5" aria-label={t('tcourse.byType')}>
                {course.exercises.map((e) => (
                  <li key={e.type}>
                    <Badge>
                      {t('tcourse.type', { type: t(`exercise.type.${e.type}`), count: e.count })}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </li>
        <li>
          <Card className="h-full p-4">
            <p className="flex items-center gap-2 font-semibold">
              <Icon name="blocks" className="text-primary" />
              {t('step.grammar')}
            </p>
            <p className="mt-1 text-sm text-muted">
              {course.grammarBlocks > 0
                ? tn('tcourse.grammarBlocks', course.grammarBlocks)
                : t('tcourse.none')}
            </p>
          </Card>
        </li>
        <li>
          <Card className="h-full p-4">
            <p className="flex items-center gap-2 font-semibold">
              <Icon name="globe" className="text-primary" />
              {t('step.culture')}
            </p>
            <p className="mt-1 text-sm text-muted">{course.cultureTitle ?? t('tcourse.none')}</p>
          </Card>
        </li>
      </ul>

      {vocab.some((v) => v.translit) && (
        <div className="overflow-x-auto rounded-ui border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">{t('tcourse.words')}</caption>
            <thead className="border-b border-line bg-primary-soft/50">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">
                  {t('lesson.vocab.arabic')}
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  {t('tcourse.translit')}
                </th>
                <th scope="col" className="px-4 py-2 font-medium">
                  {t('lesson.vocab.english')}
                </th>
              </tr>
            </thead>
            <tbody>
              {vocab.map((word) => (
                <tr key={word.id} className="border-b border-line last:border-b-0">
                  <td className="px-4 py-2 text-lg">
                    <ArabicText>{word.arabic}</ArabicText>
                  </td>
                  <td className="px-4 py-2 text-muted">{word.translit}</td>
                  <td className="px-4 py-2">{word.english}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
