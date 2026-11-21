import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { en } from '../i18n';
import { jsonError, renderAt, stubApi, teacher, type Handlers } from '../test-utils';

const demo = { ...teacher, displayName: 'Demo Teacher', readOnly: true };
const asTeacher = { 'GET /auth/me': () => Response.json({ user: teacher }) };
const asDemo = { 'GET /auth/me': () => Response.json({ user: demo }) };

const LEARNER_ID = '11111111-1111-4111-8111-111111111111';
const CONV_ID = '22222222-2222-4222-8222-222222222222';

const learners = {
  learners: [
    {
      id: LEARNER_ID,
      displayName: 'Layla',
      email: 'layla@example.com',
      level: 'A2',
      lastActivityAt: '2026-11-20T10:00:00.000Z',
      turnsThisWeek: 7,
      topMistakeTypes: [
        { type: 'grammar', count: 5 },
        { type: 'spelling', count: 2 },
      ],
    },
    {
      id: 'x2',
      displayName: 'Newbie',
      email: null,
      level: 'A1',
      lastActivityAt: null,
      turnsThisWeek: 0,
      topMistakeTypes: [],
    },
  ],
};

describe('teacher home', () => {
  it('lists learners with level, activity, turns and top mistakes', async () => {
    stubApi({ ...asTeacher, 'GET /teacher/learners': () => Response.json(learners) });
    renderAt('/teacher');
    const link = await screen.findByRole('link', { name: 'Layla' });
    const row = link.closest('tr');
    if (!row) throw new Error('no row');
    expect(link).toHaveAttribute('href', `/teacher/learners/${LEARNER_ID}`);
    expect(within(row).getByText('A2')).toBeVisible();
    expect(within(row).getByText('7')).toBeVisible();
    expect(within(row).getByText('Grammar 5')).toBeVisible();
    expect(screen.getByText(en['teacher.neverActive'])).toBeVisible();
    expect(
      within(screen.getByRole('navigation', { name: en['teacher.quickLinks'] })).getByRole('link', {
        name: en['teacher.link.invites'],
      }),
    ).toHaveAttribute('href', '/teacher/invites');
    // The table scrolls inside its own region, never the page.
    expect(screen.getByRole('region', { name: en['teacher.learners'] })).toHaveClass(
      'overflow-x-auto',
    );
  });

  it('shows an empty state that points to the invites', async () => {
    stubApi({ ...asTeacher, 'GET /teacher/learners': () => Response.json({ learners: [] }) });
    renderAt('/teacher');
    expect(await screen.findByText(en['teacher.learners.empty.title'])).toBeVisible();
    expect(screen.getByRole('link', { name: en['teacher.learners.empty.action'] })).toHaveAttribute(
      'href',
      '/teacher/invites',
    );
  });

  it('shows an error with a retry', async () => {
    stubApi({ ...asTeacher, 'GET /teacher/learners': () => jsonError('FORBIDDEN', 403) });
    renderAt('/teacher');
    expect(await screen.findByRole('button', { name: en['load.retry'] })).toBeVisible();
  });
});

const detail = {
  learner: {
    id: LEARNER_ID,
    displayName: 'Layla',
    email: 'layla@example.com',
    level: 'A2',
    createdAt: '2026-10-01T10:00:00.000Z',
    lastSeenAt: '2026-11-20T10:00:00.000Z',
  },
  conversations: [
    {
      id: CONV_ID,
      lessonId: 'l1',
      lessonTitle: 'At the cafe',
      turnCount: 3,
      lastMessageAt: '2026-11-20T10:00:00.000Z',
      createdAt: '2026-11-20T09:00:00.000Z',
    },
  ],
  mistakesByType: [{ type: 'grammar', count: 5 }],
  recentMistakes: [
    {
      id: 'm1',
      type: 'grammar',
      original: 'خطأ',
      correction: 'صواب',
      explanation: 'Because.',
      createdAt: '2026-11-20T10:00:00.000Z',
      lessonTitle: 'At the cafe',
    },
  ],
};

describe('teacher learner page', () => {
  const api = (extra: Handlers = {}): Handlers => ({
    ...asTeacher,
    [`GET /teacher/learners/${LEARNER_ID}`]: () => Response.json(detail),
    ...extra,
  });

  it('shows mistakes, recent corrections and conversations with a transcript link', async () => {
    stubApi(api());
    renderAt(`/teacher/learners/${LEARNER_ID}`);
    expect(await screen.findByRole('heading', { level: 1, name: 'Layla' })).toBeVisible();
    expect(screen.getByTestId('bar-grammar')).toBeVisible();
    expect(screen.getByText('خطأ')).toHaveAttribute('lang', 'ar');
    expect(
      screen.getByRole('link', { name: en['teacher.learner.readTranscript'] }),
    ).toHaveAttribute('href', `/teacher/conversations/${CONV_ID}`);
  });

  it('changes the level with a PATCH', async () => {
    const calls = stubApi(
      api({
        [`PATCH /teacher/learners/${LEARNER_ID}`]: () =>
          Response.json({ learner: { ...detail.learner, level: 'B1' } }),
      }),
    );
    renderAt(`/teacher/learners/${LEARNER_ID}`);
    await userEvent.selectOptions(await screen.findByLabelText(en['teacher.learner.level']), 'B1');
    expect(await screen.findByText(en['teacher.learner.levelSaved'])).toBeVisible();
    expect(calls.find((c) => c.key.startsWith('PATCH'))?.body).toEqual({ level: 'B1' });
  });

  it('disables the level select for the demo teacher', async () => {
    stubApi({ ...api(), ...asDemo });
    renderAt(`/teacher/learners/${LEARNER_ID}`);
    expect(await screen.findByLabelText(en['teacher.learner.level'])).toBeDisabled();
    expect(screen.getByText(en['readOnly.banner'])).toBeVisible();
  });

  it('explains a DEMO_READ_ONLY refusal from the server', async () => {
    stubApi(
      api({ [`PATCH /teacher/learners/${LEARNER_ID}`]: () => jsonError('DEMO_READ_ONLY', 403) }),
    );
    renderAt(`/teacher/learners/${LEARNER_ID}`);
    await userEvent.selectOptions(await screen.findByLabelText(en['teacher.learner.level']), 'B1');
    expect(await screen.findByText(en['readOnly.error'])).toBeVisible();
  });

  it('shows an error with a retry', async () => {
    stubApi({
      ...asTeacher,
      [`GET /teacher/learners/${LEARNER_ID}`]: () => jsonError('NOT_FOUND', 404),
    });
    renderAt(`/teacher/learners/${LEARNER_ID}`);
    expect(await screen.findByRole('button', { name: en['load.retry'] })).toBeVisible();
  });
});

describe('transcript page', () => {
  const transcript = {
    conversation: {
      id: CONV_ID,
      lessonTitle: 'At the cafe',
      learner: { id: LEARNER_ID, displayName: 'Layla' },
      turnCount: 1,
      createdAt: '2026-11-20T09:00:00.000Z',
    },
    messages: [
      {
        id: 'a',
        role: 'partner',
        text: 'أهلاً وسهلاً',
        glossEn: 'Welcome',
        createdAt: '2026-11-20T09:00:00.000Z',
        correction: null,
      },
      {
        id: 'b',
        role: 'learner',
        text: 'اريد قهوه',
        glossEn: null,
        createdAt: '2026-11-20T09:01:00.000Z',
        correction: {
          isCorrect: false,
          corrected: 'أريد قهوةً',
          praise: 'Good try!',
          mistakes: [
            {
              id: 'mm',
              type: 'spelling',
              original: 'قهوه',
              correction: 'قهوة',
              explanation: 'Ta marbuta.',
            },
          ],
        },
      },
    ],
  };

  it('shows both sides, the corrections and no input', async () => {
    stubApi({
      ...asTeacher,
      [`GET /teacher/conversations/${CONV_ID}`]: () => Response.json(transcript),
    });
    renderAt(`/teacher/conversations/${CONV_ID}`);
    expect(await screen.findByRole('heading', { level: 1, name: 'At the cafe' })).toBeVisible();
    expect(screen.getByText('Welcome')).toBeVisible();
    const correction = screen.getByTestId('correction');
    expect(within(correction).getByText('أريد قهوةً')).toHaveAttribute('lang', 'ar');
    expect(within(correction).getByText('Ta marbuta.')).toBeVisible();
    expect(within(correction).getByText('Good try!')).toBeVisible();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to Layla/ })).toBeVisible();
  });

  it('shows an empty state for a conversation without messages', async () => {
    stubApi({
      ...asTeacher,
      [`GET /teacher/conversations/${CONV_ID}`]: () =>
        Response.json({ ...transcript, messages: [] }),
    });
    renderAt(`/teacher/conversations/${CONV_ID}`);
    expect(await screen.findByText(en['teacher.transcript.empty'])).toBeVisible();
  });

  it('shows an error with a retry', async () => {
    stubApi({
      ...asTeacher,
      [`GET /teacher/conversations/${CONV_ID}`]: () => jsonError('FORBIDDEN', 403),
    });
    renderAt(`/teacher/conversations/${CONV_ID}`);
    expect(await screen.findByRole('button', { name: en['load.retry'] })).toBeVisible();
  });
});
