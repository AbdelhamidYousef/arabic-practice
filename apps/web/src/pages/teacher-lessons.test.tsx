import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { en } from '../i18n';
import { jsonError, renderAt, stubApi, teacher, type Handlers } from '../test-utils';

const demo = { ...teacher, displayName: 'Demo Teacher', readOnly: true };
const asTeacher = { 'GET /auth/me': () => Response.json({ user: teacher }) };
const asDemo = { 'GET /auth/me': () => Response.json({ user: demo }) };

describe('teacher lessons list', () => {
  const lessons = {
    lessons: [
      {
        id: 'l1',
        slug: 'cafe',
        title: 'At the cafe',
        level: 'A1',
        topic: 'Ordering',
        status: 'published',
        position: 1,
        vocabCount: 8,
        conversationCount: 3,
        updatedAt: '2026-11-20T00:00:00.000Z',
      },
      {
        id: 'l2',
        slug: 'draft',
        title: 'Draft one',
        level: 'B1',
        topic: 'Travel',
        status: 'draft',
        position: 2,
        vocabCount: 0,
        conversationCount: 0,
        updatedAt: '2026-11-20T00:00:00.000Z',
      },
    ],
  };

  it('lists lessons with status and a new-lesson link', async () => {
    stubApi({ ...asTeacher, 'GET /teacher/lessons': () => Response.json(lessons) });
    renderAt('/teacher/lessons');
    expect(await screen.findByRole('link', { name: 'At the cafe' })).toHaveAttribute(
      'href',
      '/teacher/lessons/l1',
    );
    expect(screen.getByText(en['editor.status.draft'])).toBeVisible();
    expect(screen.getByRole('link', { name: en['tlessons.new'] })).toHaveAttribute(
      'href',
      '/teacher/lessons/new',
    );
  });

  it('turns the new-lesson link off for the demo teacher', async () => {
    stubApi({ ...asDemo, 'GET /teacher/lessons': () => Response.json(lessons) });
    renderAt('/teacher/lessons');
    await screen.findByRole('link', { name: 'At the cafe' });
    expect(screen.queryByRole('link', { name: en['tlessons.new'] })).not.toBeInTheDocument();
    expect(screen.getByText(en['tlessons.new'])).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows an empty state', async () => {
    stubApi({ ...asTeacher, 'GET /teacher/lessons': () => Response.json({ lessons: [] }) });
    renderAt('/teacher/lessons');
    expect(await screen.findByText(en['tlessons.empty.title'])).toBeVisible();
  });

  it('shows an error with a retry', async () => {
    stubApi({ ...asTeacher, 'GET /teacher/lessons': () => jsonError('FORBIDDEN', 403) });
    renderAt('/teacher/lessons');
    expect(await screen.findByRole('button', { name: en['load.retry'] })).toBeVisible();
  });
});

const LESSON_ID = '33333333-3333-4333-8333-333333333333';
const lessonDetail = {
  lesson: {
    id: LESSON_ID,
    slug: 'cafe',
    title: 'At the cafe',
    level: 'A1',
    topic: 'Ordering',
    summary: 'Order a drink.',
    goals: ['Order coffee'],
    grammarFocus: 'Polite requests',
    scenario: 'You are a waiter.',
    openingLine: 'أهلاً',
    status: 'draft',
    position: 1,
    updatedAt: '2026-11-20T00:00:00.000Z',
    vocab: [
      { id: 'a', arabic: 'قَهْوَة', translit: '', english: 'coffee', note: null, position: 0 },
      { id: 'b', arabic: 'شَاي', translit: '', english: 'tea', note: 'hot', position: 1 },
      { id: 'c', arabic: 'مَاء', translit: '', english: 'water', note: null, position: 2 },
    ],
    course: { unit: null, kind: 'lesson', exercises: [], grammarBlocks: 0, cultureTitle: null },
  },
};

describe('lesson editor', () => {
  const edit: Handlers = {
    ...asTeacher,
    [`GET /teacher/lessons/${LESSON_ID}`]: () => Response.json(lessonDetail),
  };
  const englishOrder = () =>
    screen
      .getAllByTestId('vocab-row')
      .map((row) => within(row).getByLabelText<HTMLInputElement>(/^English/).value);

  it('loads the lesson into the form, with Arabic fields right-to-left', async () => {
    stubApi(edit);
    renderAt(`/teacher/lessons/${LESSON_ID}`);
    expect(await screen.findByLabelText(en['editor.title'])).toHaveValue('At the cafe');
    expect(screen.getByLabelText(en['editor.opening'])).toHaveAttribute('dir', 'rtl');
    expect(englishOrder()).toEqual(['coffee', 'tea', 'water']);
    expect(screen.getByLabelText('Arabic, word 1')).toHaveAttribute('dir', 'rtl');
  });

  it('adds, moves and removes vocab rows', async () => {
    stubApi(edit);
    renderAt(`/teacher/lessons/${LESSON_ID}`);
    await screen.findByLabelText(en['editor.title']);

    await userEvent.click(screen.getByRole('button', { name: 'Move word 2 up' }));
    expect(englishOrder()).toEqual(['tea', 'coffee', 'water']);
    await userEvent.click(screen.getByRole('button', { name: 'Move word 2 down' }));
    expect(englishOrder()).toEqual(['tea', 'water', 'coffee']);
    expect(screen.getByRole('button', { name: 'Move word 1 up' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move word 3 down' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Remove word 2' }));
    expect(englishOrder()).toEqual(['tea', 'coffee']);

    await userEvent.click(screen.getByRole('button', { name: en['editor.addVocab'] }));
    expect(englishOrder()).toEqual(['tea', 'coffee', '']);
  });

  it('keeps what was typed in a row when the rows move', async () => {
    stubApi(edit);
    renderAt(`/teacher/lessons/${LESSON_ID}`);
    const note = await screen.findByLabelText('Note, word 2');
    await userEvent.type(note, '!');
    await userEvent.click(screen.getByRole('button', { name: 'Move word 2 up' }));
    expect(screen.getByLabelText('Note, word 1')).toHaveValue('hot!');
  });

  it('saves with a PUT of the whole lesson, in the new order', async () => {
    const calls = stubApi({
      ...edit,
      [`PUT /teacher/lessons/${LESSON_ID}`]: () => Response.json(lessonDetail),
    });
    renderAt(`/teacher/lessons/${LESSON_ID}`);
    await screen.findByLabelText(en['editor.title']);
    await userEvent.click(screen.getByRole('button', { name: 'Move word 3 up' }));
    await userEvent.selectOptions(screen.getByLabelText(en['editor.status']), 'published');
    await userEvent.click(screen.getByRole('button', { name: en['editor.save'] }));
    expect(await screen.findByText(en['editor.saved'])).toBeVisible();
    const body = calls.find((c) => c.key.startsWith('PUT'))?.body as {
      status: string;
      goals: string[];
      vocab: { english: string }[];
    };
    expect(body.status).toBe('published');
    expect(body.goals).toEqual(['Order coffee']);
    expect(body.vocab.map((v) => v.english)).toEqual(['coffee', 'water', 'tea']);
  });

  it('validates with the shared schema and marks the field, without calling the API', async () => {
    const calls = stubApi(edit);
    renderAt(`/teacher/lessons/${LESSON_ID}`);
    const title = await screen.findByLabelText(en['editor.title']);
    await userEvent.clear(title);
    await userEvent.clear(screen.getByLabelText('English, word 2'));
    await userEvent.click(screen.getByRole('button', { name: en['editor.save'] }));
    expect(await screen.findByText(en['editor.fixErrors'])).toBeVisible();
    expect(title).toHaveAccessibleDescription(en['editor.error.required']);
    expect(screen.getByLabelText('English, word 2')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('English, word 1')).not.toHaveAttribute('aria-invalid');
    expect(calls.some((c) => c.key.startsWith('PUT'))).toBe(false);
  });

  it('creates a new lesson with a POST and opens it', async () => {
    const calls = stubApi({
      ...asTeacher,
      'POST /teacher/lessons': () => Response.json(lessonDetail, { status: 201 }),
      [`GET /teacher/lessons/${LESSON_ID}`]: () => Response.json(lessonDetail),
    });
    const router = renderAt('/teacher/lessons/new');
    await userEvent.type(await screen.findByLabelText(en['editor.title']), 'At the cafe');
    await userEvent.type(screen.getByLabelText(en['editor.topic']), 'Ordering');
    await userEvent.type(screen.getByLabelText(en['editor.summary']), 'Order a drink.');
    await userEvent.type(screen.getByLabelText(en['editor.scenario']), 'You are a waiter.');
    await userEvent.type(screen.getByLabelText(en['editor.opening']), 'أهلاً');
    await userEvent.click(screen.getByRole('button', { name: en['editor.save'] }));
    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/teacher/lessons/${LESSON_ID}`),
    );
    expect(await screen.findByText(en['editor.saved'])).toBeVisible();
    // The spare empty goal and vocab rows are not sent.
    expect(calls.find((c) => c.key === 'POST /teacher/lessons')?.body).toMatchObject({
      goals: [],
      vocab: [],
    });
  });

  it('shows the conflict message when learners have practised the lesson', async () => {
    stubApi({
      ...edit,
      [`DELETE /teacher/lessons/${LESSON_ID}`]: () => jsonError('CONFLICT', 409),
    });
    renderAt(`/teacher/lessons/${LESSON_ID}`);
    await userEvent.click(await screen.findByRole('button', { name: en['editor.delete'] }));
    const dialog = screen.getByRole('dialog', { name: en['editor.delete.title'] });
    await userEvent.click(
      within(dialog).getByRole('button', { name: en['editor.delete.confirm'] }),
    );
    expect(await within(dialog).findByText(en['editor.delete.conflict'])).toBeVisible();
  });

  it('deletes after a confirmation and returns to the list', async () => {
    const calls = stubApi({
      ...edit,
      [`DELETE /teacher/lessons/${LESSON_ID}`]: () => new Response(null, { status: 204 }),
      'GET /teacher/lessons': () => Response.json({ lessons: [] }),
    });
    const router = renderAt(`/teacher/lessons/${LESSON_ID}`);
    await userEvent.click(await screen.findByRole('button', { name: en['editor.delete'] }));
    expect(calls.some((c) => c.key.startsWith('DELETE'))).toBe(false);
    await userEvent.click(screen.getByRole('button', { name: en['editor.delete.confirm'] }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/teacher/lessons'));
  });

  it('is fully read-only for the demo teacher', async () => {
    stubApi({ ...edit, ...asDemo });
    renderAt(`/teacher/lessons/${LESSON_ID}`);
    expect(await screen.findByLabelText(en['editor.title'])).toBeDisabled();
    expect(screen.getByRole('button', { name: en['editor.save'] })).toBeDisabled();
    expect(screen.getByRole('button', { name: en['editor.delete'] })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move word 2 up' })).toBeDisabled();
    expect(screen.getByRole('button', { name: en['editor.addVocab'] })).toBeDisabled();
    expect(screen.getByText(en['readOnly.banner'])).toBeVisible();
  });

  it('explains a DEMO_READ_ONLY refusal from the server', async () => {
    stubApi({
      ...edit,
      [`PUT /teacher/lessons/${LESSON_ID}`]: () => jsonError('DEMO_READ_ONLY', 403),
    });
    renderAt(`/teacher/lessons/${LESSON_ID}`);
    await userEvent.click(await screen.findByRole('button', { name: en['editor.save'] }));
    expect(await screen.findByText(en['readOnly.error'])).toBeVisible();
  });

  it('shows a server validation error inline', async () => {
    stubApi({
      ...edit,
      [`PUT /teacher/lessons/${LESSON_ID}`]: () =>
        Response.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'bad',
              details: { formErrors: [], fieldErrors: { topic: ['Topic is already taken'] } },
            },
          },
          { status: 400 },
        ),
    });
    renderAt(`/teacher/lessons/${LESSON_ID}`);
    await userEvent.click(await screen.findByRole('button', { name: en['editor.save'] }));
    expect(await screen.findByText('Topic is already taken')).toBeVisible();
  });

  it('shows an error with a retry when the lesson cannot load', async () => {
    stubApi({
      ...asTeacher,
      [`GET /teacher/lessons/${LESSON_ID}`]: () => jsonError('NOT_FOUND', 404),
    });
    renderAt(`/teacher/lessons/${LESSON_ID}`);
    expect(await screen.findByRole('button', { name: en['load.retry'] })).toBeVisible();
  });
});

describe('lesson editor: course content', () => {
  const courseLessonDetail = {
    lesson: {
      ...lessonDetail.lesson,
      vocab: [{ ...lessonDetail.lesson.vocab[0], translit: 'qahwa' }],
      course: {
        unit: { code: 'A1.1', title: 'Hello and who you are' },
        kind: 'lesson',
        exercises: [
          { type: 'choose', count: 3 },
          { type: 'match', count: 1 },
        ],
        grammarBlocks: 4,
        cultureTitle: 'Greetings of light',
      },
    },
  };

  it('shows the course parts read-only: unit, exercises by type, grammar, culture, transliteration', async () => {
    stubApi({
      ...asTeacher,
      [`GET /teacher/lessons/${LESSON_ID}`]: () => Response.json(courseLessonDetail),
    });
    renderAt(`/teacher/lessons/${LESSON_ID}`);
    const section = within(await screen.findByRole('region', { name: en['tcourse.title'] }));
    expect(section.getByText('Unit A1.1 · Hello and who you are')).toBeVisible();
    expect(section.getByText(en['tcourse.fromFiles'])).toBeVisible();
    expect(section.getByText('4 exercises')).toBeVisible();
    expect(section.getByText('Choose × 3')).toBeVisible();
    expect(section.getByText('Match × 1')).toBeVisible();
    expect(section.getByText('4 blocks')).toBeVisible();
    expect(section.getByText('Greetings of light')).toBeVisible();
    expect(section.getByRole('columnheader', { name: en['tcourse.translit'] })).toBeVisible();
    expect(section.getByText('qahwa')).toBeVisible();
  });

  it('shows nothing extra for a teacher-made lesson', async () => {
    stubApi({
      ...asTeacher,
      [`GET /teacher/lessons/${LESSON_ID}`]: () => Response.json(lessonDetail),
    });
    renderAt(`/teacher/lessons/${LESSON_ID}`);
    await screen.findByRole('heading', { level: 1, name: en['page.teacherLesson'] });
    expect(screen.queryByRole('region', { name: en['tcourse.title'] })).not.toBeInTheDocument();
  });
});
