import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { en } from '../i18n';
import { jsonError, learner, renderAt, stubApi } from '../test-utils';

const signedIn = { 'GET /auth/me': () => Response.json({ user: learner }) };

const card = (n: number) => ({
  vocabId: `v${n}`,
  arabic: `كَلِمَةٌ${n}`,
  english: `word ${n}`,
  note: n === 1 ? 'a note' : null,
  lessonTitle: 'Greetings',
  box: 1,
  dueAt: '2026-11-21T00:00:00.000Z',
});
const answered = {
  vocabId: 'v1',
  box: 2,
  dueAt: '2026-11-22T00:00:00.000Z',
  reviews: 1,
  lapses: 0,
};

describe('review page', () => {
  const due = (n: number, total = n) => ({
    ...signedIn,
    'GET /review/due': () =>
      Response.json({ cards: Array.from({ length: n }, (_, i) => card(i + 1)), totalDue: total }),
    'POST /review/v1': () => Response.json(answered),
    'POST /review/v2': () => Response.json({ ...answered, vocabId: 'v2' }),
    'POST /review/v3': () => Response.json({ ...answered, vocabId: 'v3' }),
  });

  it('runs a session with the keyboard: Space reveals, 1 and 2 answer, then a summary', async () => {
    const calls = stubApi(due(3, 57));
    renderAt('/review');
    expect(await screen.findByText('1 of 3')).toBeVisible();
    expect(screen.getByText(/3 of 57 due today/)).toBeVisible();
    expect(screen.getByTestId('card-arabic').querySelector('[lang="ar"]')).not.toBeNull();
    expect(screen.queryByText('word 1')).not.toBeInTheDocument();

    // Answering before the meaning is shown does nothing.
    await userEvent.keyboard('1');
    expect(calls.some((c) => c.key.startsWith('POST /review'))).toBe(false);

    await userEvent.keyboard(' ');
    expect(screen.getByText('word 1')).toBeVisible();
    expect(screen.getByText('a note')).toBeVisible();
    await userEvent.keyboard('1');
    expect(await screen.findByText('2 of 3')).toBeVisible();
    expect(calls.find((c) => c.key === 'POST /review/v1')?.body).toEqual({ correct: true });
    expect(screen.queryByText('word 1')).not.toBeInTheDocument();

    await userEvent.keyboard(' ');
    await userEvent.keyboard('2');
    expect(await screen.findByText('3 of 3')).toBeVisible();
    expect(calls.find((c) => c.key === 'POST /review/v2')?.body).toEqual({ correct: false });

    await userEvent.click(screen.getByRole('button', { name: en['review.show'] }));
    await userEvent.click(screen.getByRole('button', { name: /I knew it/ }));
    expect(await screen.findByText(en['review.done'])).toBeVisible();
    expect(screen.getByText('You knew 2 of 3.')).toBeVisible();
    expect(screen.getByText('1 word to see again')).toBeVisible();
    expect(screen.getByText('word 2')).toBeVisible();
  });

  it('does not hijack typing or stray keys', async () => {
    stubApi(due(1));
    renderAt('/review');
    await screen.findByText('1 of 1');
    await userEvent.keyboard('x');
    expect(screen.queryByText('word 1')).not.toBeInTheDocument();
  });

  it('keeps the card and says so when saving an answer fails', async () => {
    stubApi({ ...due(2), 'POST /review/v1': () => jsonError('FORBIDDEN', 403) });
    renderAt('/review');
    await screen.findByText('1 of 2');
    await userEvent.keyboard(' ');
    await userEvent.keyboard('1');
    expect(await screen.findByText(en['review.answerError'])).toBeVisible();
    expect(screen.getByText('1 of 2')).toBeVisible();
  });

  it('shows the empty state with a link to the lessons', async () => {
    stubApi(due(0));
    renderAt('/review');
    expect(await screen.findByText(en['review.empty.title'])).toBeVisible();
    expect(screen.getByRole('link', { name: en['review.empty.action'] })).toHaveAttribute(
      'href',
      '/lessons',
    );
  });

  it('shows an error with a retry', async () => {
    stubApi({ ...signedIn, 'GET /review/due': () => jsonError('FORBIDDEN', 403) });
    renderAt('/review');
    expect(await screen.findByRole('button', { name: en['load.retry'] })).toBeVisible();
  });
});
