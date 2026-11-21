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

const list = {
  levels: [
    {
      level: 'A1',
      lessons: [
        lesson({}),
        lesson({ id: 'l2', slug: 'food', title: 'Food', topic: 'Ordering', conversationCount: 1 }),
      ],
    },
    {
      level: 'B1',
      lessons: [
        lesson({ id: 'l3', slug: 'travel', title: 'Travel', level: 'B1', conversationCount: 3 }),
      ],
    },
  ],
};

const signedIn = { 'GET /auth/me': () => Response.json({ user: learner }) };

describe('lessons list', () => {
  it('groups lessons under level headings with badge and practised count', async () => {
    stubApi({ ...signedIn, 'GET /lessons': () => Response.json(list) });
    renderAt('/lessons');
    const headings = await screen.findAllByRole('heading', { level: 2 });
    expect(headings.map((h) => h.textContent)).toEqual([
      'Level A1Beginner',
      'Level B1Intermediate',
    ]);
    const a1 = within(screen.getByRole('region', { name: /Level A1/ }));
    expect(a1.getAllByRole('listitem')).toHaveLength(2);
    expect(a1.getByText('Not practised yet')).toBeVisible();
    expect(a1.getByText('Practised 1 time')).toBeVisible();
    expect(screen.getByText('Practised 3 times')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Food' })).toHaveAttribute('href', '/lessons/food');
  });

  it('shows an empty state when no lesson is published', async () => {
    stubApi({ ...signedIn, 'GET /lessons': () => Response.json({ levels: [] }) });
    renderAt('/lessons');
    expect(await screen.findByText(en['lessons.empty.title'])).toBeVisible();
  });

  it('offers a retry when loading fails', async () => {
    let calls = 0;
    stubApi({
      ...signedIn,
      'GET /lessons': () => {
        calls += 1;
        return calls < 4 ? jsonError('INTERNAL', 500) : Response.json(list);
      },
    });
    renderAt('/lessons');
    await userEvent.click(
      await screen.findByRole('button', { name: en['load.retry'] }, { timeout: 4000 }),
    );
    expect(await screen.findByText('Level A1')).toBeVisible();
  });

  it('sends a visitor to the sign-in page', async () => {
    stubApi({ 'GET /lessons': () => jsonError('UNAUTHENTICATED', 401) });
    const router = renderAt('/lessons');
    await screen.findByRole('heading', { level: 1, name: en['page.login'] });
    expect(router.state.location.pathname).toBe('/login');
  });
});

const detail = {
  lesson: lesson({ conversationCount: 2 }),
  vocab: [
    { id: 'v1', arabic: 'مَرْحَبًا', english: 'hello', note: 'informal', position: 0 },
    { id: 'v2', arabic: 'شُكْرًا', english: 'thank you', note: null, position: 1 },
  ],
  conversations: [
    {
      id: 'c9',
      turnCount: 4,
      lastMessageAt: '2026-11-20T10:00:00.000Z',
      createdAt: '2026-11-20T09:00:00.000Z',
    },
  ],
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
        Response.json({
          conversation: { id: 'c10', lessonId: 'l1' },
          messages: [{ id: 'm1', role: 'partner' }],
        }),
    });
    const router = renderAt('/lessons/greetings');
    await userEvent.click(await screen.findByRole('button', { name: en['lesson.start'] }));
    await screen.findByRole('heading', { level: 1, name: en['page.practice'] });
    expect(router.state.location.pathname).toBe('/practice/c10');
    expect(calls.find((c) => c.key === 'POST /conversations')?.body).toEqual({ lessonId: 'l1' });
  });

  it('says so when the practice cannot start', async () => {
    stubApi({ ...api, 'POST /conversations': () => jsonError('INTERNAL', 500) });
    renderAt('/lessons/greetings');
    await userEvent.click(await screen.findByRole('button', { name: en['lesson.start'] }));
    expect(await screen.findByRole('alert')).toHaveTextContent(en['lesson.startError']);
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
