import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { en } from '../i18n';
import { jsonError, learner, renderAt, stubApi } from '../test-utils';

const signedIn = { 'GET /auth/me': () => Response.json({ user: learner }) };

const week = (n: number, turns: number, mistakes: number) => ({
  weekStart: `2026-0${n}-01`,
  turns,
  mistakes,
  mistakesPerTurn: turns ? mistakes / turns : 0,
});
const progress = {
  totals: { conversations: 3, turns: 12, mistakes: 6 },
  mistakesByType: [
    { type: 'grammar', count: 4 },
    { type: 'harakat', count: 2 },
  ],
  weeks: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => week(n, n % 2 ? 0 : 4, n % 2 ? 0 : n)),
  recentMistakes: [
    {
      id: 'm1',
      type: 'grammar',
      original: 'ذهبت إلى المدرسةُ',
      correction: 'ذهبت إلى المدرسةِ',
      explanation: 'After a preposition the noun takes the genitive.',
      createdAt: '2026-11-20T10:00:00.000Z',
      lessonTitle: 'At school',
    },
  ],
};

describe('progress page', () => {
  it('shows totals, bars, the eight weeks and the recent corrections', async () => {
    stubApi({ ...signedIn, 'GET /progress': () => Response.json(progress) });
    renderAt('/progress');
    expect(await screen.findByText('12')).toBeVisible();
    expect(screen.getByText('conversations')).toBeVisible();
    expect(screen.getByTestId('bar-grammar')).toHaveStyle({ width: '100%' });
    expect(screen.getByTestId('bar-harakat')).toHaveStyle({ width: '50%' });
    expect(within(screen.getByTestId('weeks')).getAllByRole('listitem')).toHaveLength(8);
    expect(screen.getByText('ذهبت إلى المدرسةُ')).toHaveAttribute('lang', 'ar');
    expect(screen.getByText('ذهبت إلى المدرسةِ')).toBeVisible();
    expect(screen.getByText(/After a preposition/)).toBeVisible();
    expect(screen.getByText(/At school/)).toBeVisible();
  });

  it('shows a friendly empty state for someone who has not practised', async () => {
    stubApi({
      ...signedIn,
      'GET /progress': () =>
        Response.json({
          totals: { conversations: 0, turns: 0, mistakes: 0 },
          mistakesByType: [],
          weeks: progress.weeks.map((w) => ({ ...w, turns: 0, mistakes: 0, mistakesPerTurn: 0 })),
          recentMistakes: [],
        }),
    });
    renderAt('/progress');
    expect(await screen.findByText(en['progress.empty.title'])).toBeVisible();
    expect(screen.getByRole('link', { name: en['progress.empty.action'] })).toHaveAttribute(
      'href',
      '/lessons',
    );
  });

  it('offers a retry when loading fails', async () => {
    let calls = 0;
    stubApi({
      ...signedIn,
      'GET /progress': () =>
        ++calls === 1 ? jsonError('FORBIDDEN', 403) : Response.json(progress),
    });
    renderAt('/progress');
    await userEvent.click(await screen.findByRole('button', { name: en['load.retry'] }));
    expect(await screen.findByText('12')).toBeVisible();
  });

  it('shows a spinner while loading', async () => {
    stubApi({ ...signedIn, 'GET /progress': () => new Promise<Response>(() => {}) });
    renderAt('/progress');
    expect(await screen.findByRole('status')).toBeInTheDocument();
  });
});
