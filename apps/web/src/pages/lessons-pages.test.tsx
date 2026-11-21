import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { en } from '../i18n';
import { jsonError, learner, renderAt, stubApi } from '../test-utils';

const lesson = (over: object) => ({
  id: 'l1',
  slug: 'greetings',
  title: 'Greetings',
  level: 'A1',
  topic: 'Meeting people',
  summary: 'Say hello and ask how someone is.',
  goals: ['Greet a friend', 'Ask how they are'],
  grammarFocus: 'Questions with كيف',
  conversationCount: 0,
  ...over,
});

const signedIn = { 'GET /auth/me': () => Response.json({ user: learner }) };

const detail = {
  lesson: {
    ...lesson({ conversationCount: 2 }),
    unit: null,
    kind: 'lesson',
    grammarNote: [],
    cultureTip: null,
  },
  vocab: [
    {
      id: 'v1',
      arabic: 'مَرْحَبًا',
      translit: 'marḥaban',
      english: 'hello',
      note: 'informal',
      position: 0,
    },
    {
      id: 'v2',
      arabic: 'شُكْرًا',
      translit: 'shukran',
      english: 'thank you',
      note: null,
      position: 1,
    },
  ],
  exercises: [],
  progress: { stepsDone: [], practiceScore: null },
  conversations: [
    {
      id: 'c9',
      turnCount: 4,
      lastMessageAt: '2026-11-20T10:00:00.000Z',
      createdAt: '2026-11-20T09:00:00.000Z',
    },
  ],
};

const conversation = {
  id: 'c10',
  lessonId: 'l1',
  turnCount: 0,
  lastMessageAt: '2026-11-21T10:00:00.000Z',
  createdAt: '2026-11-21T10:00:00.000Z',
};
const opening = {
  id: 'm1',
  role: 'partner',
  text: 'مَرْحَبًا',
  glossEn: null,
  levelMetrics: null,
  createdAt: '2026-11-21T10:00:00.000Z',
};

describe('lesson page', () => {
  const api = {
    ...signedIn,
    'GET /lessons/greetings': () => Response.json(detail),
  };

  it('shows summary, goals, grammar focus, vocabulary and recent conversations', async () => {
    stubApi(api);
    renderAt('/lessons/greetings');
    expect(await screen.findByRole('heading', { level: 1, name: 'Greetings' })).toBeVisible();
    expect(screen.getByText('Say hello and ask how someone is.')).toBeVisible();
    expect(screen.getByText('Greet a friend')).toBeVisible();
    const table = screen.getByRole('table');
    expect(within(table).getByText('hello')).toBeVisible();
    expect(within(table).getByText('informal')).toBeVisible();
    expect(within(table).getByText('مَرْحَبًا')).toHaveAttribute('lang', 'ar');
    expect(screen.getByText('4 turns')).toBeVisible();
    expect(screen.getByRole('link', { name: /Continue/ })).toHaveAttribute('href', '/practice/c9');
  });

  it('hides and shows the harakat with the toggle', async () => {
    stubApi(api);
    renderAt('/lessons/greetings');
    const toggle = await screen.findByRole('checkbox', { name: en['lesson.harakat.toggle'] });
    expect(toggle).toBeChecked();
    await userEvent.click(toggle);
    expect(screen.getByText('مرحبا')).toBeVisible();
    expect(screen.queryByText('مَرْحَبًا')).not.toBeInTheDocument();
    await userEvent.click(toggle);
    expect(screen.getByText('مَرْحَبًا')).toBeVisible();
  });

  it('starts a conversation and opens the practice page', async () => {
    const calls = stubApi({
      ...api,
      'POST /conversations': () =>
        Response.json(
          {
            conversation: { ...conversation, id: 'c10' },
            messages: [{ ...opening, id: 'm1' }],
          },
          { status: 201 },
        ),
      'GET /conversations/c10': () =>
        Response.json({
          conversation: { ...conversation, id: 'c10' },
          lesson: { id: 'l1', slug: 'greetings', title: 'Greetings', level: 'A1' },
          messages: [{ ...opening, id: 'm1', correction: null }],
        }),
    });
    const router = renderAt('/lessons/greetings');
    await userEvent.click(await screen.findByRole('button', { name: en['lesson.start'] }));
    await screen.findByLabelText(en['chat.composer.label']);
    expect(router.state.location.pathname).toBe('/practice/c10');
    expect(calls.find((c) => c.key === 'POST /conversations')?.body).toEqual({ lessonId: 'l1' });
  });

  it('says so when the practice cannot start', async () => {
    stubApi({ ...api, 'POST /conversations': () => jsonError('INTERNAL', 500) });
    renderAt('/lessons/greetings');
    await userEvent.click(await screen.findByRole('button', { name: en['lesson.start'] }));
    expect(await screen.findByRole('alert')).toHaveTextContent(en['lesson.startError']);
  });

  it('explains the daily conversation limit and when it resets', async () => {
    stubApi({ ...api, 'POST /conversations': () => jsonError('CONVERSATION_LIMIT', 429) });
    renderAt('/lessons/greetings');
    await userEvent.click(await screen.findByRole('button', { name: en['lesson.start'] }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(en['limit.conversations']);
    expect(alert).toHaveTextContent('resets at');
    expect(alert).not.toHaveTextContent(en['lesson.startError']);
  });

  it('handles a lesson with no vocabulary and no conversations', async () => {
    stubApi({
      ...signedIn,
      'GET /lessons/greetings': () => Response.json({ ...detail, vocab: [], conversations: [] }),
    });
    renderAt('/lessons/greetings');
    expect(await screen.findByText(en['lesson.vocab.empty'])).toBeVisible();
    expect(screen.getByText(en['lesson.recent.empty'])).toBeVisible();
  });
});
