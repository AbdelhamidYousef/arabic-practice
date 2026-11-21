import { CEFR_LEVELS, cefrLabel, cefrLevelSchema, lessonStatusSchema } from '@arabic/shared';
import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';

import { ApiError } from '../api/client';
import { Container } from '../components/layout/Container';
import { LoadState } from '../components/LoadState';
import { Seo } from '../components/Seo';
import { Alert } from '../components/ui/Alert';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Dialog } from '../components/ui/Dialog';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import {
  emptyForm,
  emptyGoal,
  emptyVocab,
  formFromLesson,
  move,
  serverFieldErrors,
  validateForm,
  type FieldErrors,
  type LessonForm,
} from '../features/teacher/lesson-form';
import { useDeleteLesson, useSaveLesson, useTeacherLesson } from '../features/teacher/queries';
import { teacherErrorKey, useReadOnly } from '../features/teacher/ReadOnly';
import { useT } from '../i18n';

export default function TeacherLessonPage() {
  const { t } = useT();
  const { id = '' } = useParams();
  const isNew = id === 'new';
  const query = useTeacherLesson(id, !isNew);
  return (
    <Container className="max-w-4xl py-8 sm:py-12">
      <Link
        to="/teacher/lessons"
        className="text-sm font-medium text-primary underline underline-offset-4"
      >
        {t('editor.back')}
      </Link>
      {isNew ? (
        <Editor key="new" lessonId={null} initial={emptyForm()} />
      ) : (
        <LoadState query={query}>
          {({ lesson }) => (
            <Editor key={lesson.id} lessonId={lesson.id} initial={formFromLesson(lesson)} />
          )}
        </LoadState>
      )}
    </Container>
  );
}

function Editor({ lessonId, initial }: { lessonId: string | null; initial: LessonForm }) {
  const { t } = useT();
  const navigate = useNavigate();
  const readOnly = useReadOnly();
  const save = useSaveLesson(lessonId);
  const del = useDeleteLesson();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const location = useLocation();
  const [saved, setSaved] = useState(
    (location.state as { saved?: boolean } | null)?.saved === true,
  );
  const [confirmOpen, setConfirmOpen] = useState(false);

  const set = <K extends keyof LessonForm>(key: K, value: LessonForm[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };
  const err = (path: string) => errors[path];

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);
    const { input, errors: found } = validateForm(form, (code) => t(`editor.error.${code}`));
    setErrors(found);
    if (!input) return;
    save.mutate(input, {
      onSuccess: ({ lesson }) => {
        setSaved(true);
        if (!lessonId)
          navigate(`/teacher/lessons/${lesson.id}`, { replace: true, state: { saved: true } });
      },
      onError: (error) => {
        if (error instanceof ApiError && error.code === 'VALIDATION_ERROR') {
          setErrors(serverFieldErrors(error.details));
        }
      },
    });
  };

  const confirmDelete = () => {
    if (!lessonId) return;
    del.mutate(lessonId, { onSuccess: () => navigate('/teacher/lessons') });
  };

  const title = lessonId ? t('page.teacherLesson') : t('editor.new');
  const saveError = save.error;
  const readOnlyProps = readOnly ? { disabled: true, title: t('readOnly.hint') } : {};

  return (
    <>
      <Seo title={title} noindex />
      <h1 className="mt-3 text-3xl">{title}</h1>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-8">
        <fieldset disabled={readOnly} className="space-y-8">
          <Card className="space-y-4">
            <Input
              label={t('editor.title')}
              value={form.title}
              error={err('title')}
              maxLength={120}
              onChange={(e) => set('title', e.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <Select
                label={t('editor.level')}
                value={form.level}
                onChange={(e) => {
                  const level = cefrLevelSchema.safeParse(e.target.value);
                  if (level.success) set('level', level.data);
                }}
              >
                {CEFR_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l} · {cefrLabel[l]}
                  </option>
                ))}
              </Select>
              <Select
                label={t('editor.status')}
                value={form.status}
                onChange={(e) => {
                  const status = lessonStatusSchema.safeParse(e.target.value);
                  if (status.success) set('status', status.data);
                }}
              >
                <option value="draft">{t('editor.status.draft')}</option>
                <option value="published">{t('editor.status.published')}</option>
              </Select>
              <Input
                label={t('editor.position')}
                type="number"
                inputMode="numeric"
                min={0}
                max={9999}
                value={form.position}
                error={err('position')}
                onChange={(e) => set('position', e.target.value)}
              />
            </div>
            <Input
              label={t('editor.topic')}
              value={form.topic}
              error={err('topic')}
              maxLength={120}
              onChange={(e) => set('topic', e.target.value)}
            />
            <Textarea
              label={t('editor.summary')}
              autoGrow
              rows={2}
              className="max-h-64 min-h-[5rem]"
              value={form.summary}
              error={err('summary')}
              maxLength={500}
              onChange={(e) => set('summary', e.target.value)}
            />
            <Input
              label={t('editor.grammar')}
              value={form.grammarFocus}
              error={err('grammarFocus')}
              maxLength={300}
              onChange={(e) => set('grammarFocus', e.target.value)}
            />
          </Card>

          <Card className="space-y-3">
            <h2 className="text-xl">{t('editor.goals')}</h2>
            <ul className="space-y-3">
              {form.goals.map((goal, i) => (
                <li key={goal.key} className="flex items-end gap-2">
                  <div className="min-w-0 flex-1">
                    <Input
                      label={t('editor.goalN', { n: i + 1 })}
                      value={goal.text}
                      error={err(`goals.${i}`)}
                      maxLength={200}
                      onChange={(e) =>
                        set(
                          'goals',
                          form.goals.map((g) =>
                            g.key === goal.key ? { ...g, text: e.target.value } : g,
                          ),
                        )
                      }
                    />
                  </div>
                  <Button
                    variant="secondary"
                    aria-label={t('editor.removeGoalN', { n: i + 1 })}
                    onClick={() =>
                      set(
                        'goals',
                        form.goals.filter((g) => g.key !== goal.key),
                      )
                    }
                  >
                    {t('editor.remove')}
                  </Button>
                </li>
              ))}
            </ul>
            {err('goals') && <p className="text-sm text-danger">{err('goals')}</p>}
            <Button variant="secondary" onClick={() => set('goals', [...form.goals, emptyGoal()])}>
              {t('editor.addGoal')}
            </Button>
          </Card>

          <Card className="space-y-4">
            <Textarea
              label={t('editor.scenario')}
              hint={t('editor.scenario.hint')}
              autoGrow
              rows={4}
              className="max-h-80 min-h-[8rem]"
              value={form.scenario}
              error={err('scenario')}
              maxLength={2000}
              onChange={(e) => set('scenario', e.target.value)}
            />
            <Textarea
              label={t('editor.opening')}
              hint={t('editor.opening.hint')}
              autoGrow
              rows={2}
              dir="rtl"
              lang="ar"
              className="arabic max-h-48 min-h-[5rem]"
              value={form.openingLine}
              error={err('openingLine')}
              maxLength={500}
              onChange={(e) => set('openingLine', e.target.value)}
            />
          </Card>

          <section aria-labelledby="vocab-heading" className="space-y-3">
            <h2 id="vocab-heading" className="text-xl">
              {t('editor.vocab')}
            </h2>
            <p className="text-sm text-muted">{t('editor.vocab.hint')}</p>
            <div
              aria-hidden="true"
              className="hidden gap-2 px-2 text-sm font-medium text-muted sm:grid sm:grid-cols-[1fr_1fr_1.4fr_9rem]"
            >
              <span>{t('editor.vocab.colArabic')}</span>
              <span>{t('editor.vocab.colEnglish')}</span>
              <span>{t('editor.vocab.colNote')}</span>
              <span />
            </div>
            <ol className="space-y-2">
              {form.vocab.map((row, i) => {
                const patch = (p: Partial<typeof row>) =>
                  set(
                    'vocab',
                    form.vocab.map((r) => (r.key === row.key ? { ...r, ...p } : r)),
                  );
                return (
                  <li
                    key={row.key}
                    data-testid="vocab-row"
                    className="grid grid-cols-2 items-start gap-2 rounded-ui border border-line bg-surface p-2 sm:grid-cols-[1fr_1fr_1.4fr_9rem]"
                  >
                    <Input
                      label={t('editor.vocab.arabicN', { n: i + 1 })}
                      hideLabel
                      placeholder={t('editor.vocab.colArabic')}
                      dir="rtl"
                      lang="ar"
                      className="arabic py-0 text-base leading-normal"
                      value={row.arabic}
                      error={err(`vocab.${i}.arabic`)}
                      maxLength={100}
                      onChange={(e) => patch({ arabic: e.target.value })}
                    />
                    <Input
                      label={t('editor.vocab.englishN', { n: i + 1 })}
                      hideLabel
                      placeholder={t('editor.vocab.colEnglish')}
                      value={row.english}
                      error={err(`vocab.${i}.english`)}
                      maxLength={200}
                      onChange={(e) => patch({ english: e.target.value })}
                    />
                    <div className="col-span-2 flex items-start gap-2 sm:contents">
                      <div className="min-w-0 flex-1">
                        <Input
                          label={t('editor.vocab.noteN', { n: i + 1 })}
                          hideLabel
                          placeholder={t('editor.vocab.colNote')}
                          value={row.note}
                          error={err(`vocab.${i}.note`)}
                          maxLength={300}
                          onChange={(e) => patch({ note: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-1 sm:justify-end">
                        <Button
                          size="icon"
                          variant="secondary"
                          disabled={i === 0}
                          aria-label={t('editor.moveUpN', { n: i + 1 })}
                          onClick={() => set('vocab', move(form.vocab, i, i - 1))}
                        >
                          <span aria-hidden="true">↑</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          disabled={i === form.vocab.length - 1}
                          aria-label={t('editor.moveDownN', { n: i + 1 })}
                          onClick={() => set('vocab', move(form.vocab, i, i + 1))}
                        >
                          <span aria-hidden="true">↓</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          aria-label={t('editor.removeRowN', { n: i + 1 })}
                          onClick={() =>
                            set(
                              'vocab',
                              form.vocab.filter((r) => r.key !== row.key),
                            )
                          }
                        >
                          <span aria-hidden="true">✕</span>
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
            {err('vocab') && <p className="text-sm text-danger">{err('vocab')}</p>}
            <Button variant="secondary" onClick={() => set('vocab', [...form.vocab, emptyVocab()])}>
              {t('editor.addVocab')}
            </Button>
          </section>
        </fieldset>

        {Object.keys(errors).length > 0 && <Alert tone="danger">{t('editor.fixErrors')}</Alert>}
        {saveError && !(saveError instanceof ApiError && saveError.code === 'VALIDATION_ERROR') && (
          <Alert tone="danger">{t(teacherErrorKey(saveError, 'editor.saveError'))}</Alert>
        )}
        {saved && <Alert tone="success">{t('editor.saved')}</Alert>}

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" size="lg" loading={save.isPending} {...readOnlyProps}>
            {t('editor.save')}
          </Button>
          {lessonId && (
            <Button
              variant="danger"
              size="lg"
              onClick={() => {
                del.reset();
                setConfirmOpen(true);
              }}
              {...readOnlyProps}
            >
              {t('editor.delete')}
            </Button>
          )}
          {readOnly && <p className="text-sm text-muted">{t('readOnly.hint')}</p>}
        </div>
      </form>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={t('editor.delete.title')}
        closeLabel={t('shell.close')}
      >
        <p>{t('editor.delete.body')}</p>
        {del.error && (
          <Alert tone="danger">
            {t(
              del.error instanceof ApiError && del.error.code === 'CONFLICT'
                ? 'editor.delete.conflict'
                : teacherErrorKey(del.error, 'editor.delete.error'),
            )}
          </Alert>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
            {t('editor.delete.cancel')}
          </Button>
          <Button variant="danger" loading={del.isPending} onClick={confirmDelete}>
            {t('editor.delete.confirm')}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
