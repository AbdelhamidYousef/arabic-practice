import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { en } from '../i18n';
import { chatLesson, course, courseLesson } from '../test/course-fixtures';
import { courseKey, emptyCourse, jsonError, learner, renderAt, stubApi } from '../test-utils';

const signedIn = { 'GET /auth/me': () => Response.json({ user: learner }) };
const chats = {
  levels: [
    {
      level: 'A1',
      lessons: [
        chatLesson(),
        // A course lesson also shows up in the plain list; the page must not list it twice.
        chatLesson({ id: 'cl1', slug: 'a1-greetings', title: 'Greetings and your name' }),
      ],
    },
  ],
};

function stub(over: object = {}) {
  return stubApi({
    ...signedIn,
    [courseKey()]: () => Response.json(course),
    'GET /lessons': () => Response.json(chats),
    ...over,
  });
}

describe('course page', () => {
  it('shows the stats strip with the streak, XP today and words learned', async () => {
    stub();
    renderAt('/lessons');
    const stats = await screen.findByRole('list', { name: en['course.stats'] });
    expect(within(stats).getByText('3')).toBeVisible();
    expect(within(stats).getByText('day streak')).toBeVisible();
    expect(within(stats).getByText('18')).toBeVisible();
    expect(within(stats).getByText('24')).toBeVisible();
    expect(within(stats).getByText('words learned')).toBeVisible();
  });

  it('opens on the level of the next lesson and marks it Next up with a Continue link', async () => {
    stub();
    renderAt('/lessons');
    const tab = await screen.findByRole('tab', { name: 'A1 · Beginner' });
    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('heading', { level: 2, name: 'Hello and who you are' })).toBeVisible();
    const next = screen.getByText(en['course.nextUp']).closest('[data-state]');
    expect(next).toHaveAttribute('data-state', 'next');
    expect(within(next as HTMLElement).getByText('2 of 5 steps')).toBeVisible();
    expect(within(next as HTMLElement).getByText('Practice 70%')).toBeVisible();
    // Continue goes straight to the first open step.
    expect(screen.getByRole('link', { name: /^Continue/ })).toHaveAttribute(
      'href',
      '/lessons/a1-greetings/learn/grammar',
    );
    expect(screen.getByRole('link', { name: 'My family' })).toHaveAttribute(
      'href',
      '/lessons/a1-family',
    );
    expect(screen.getByText(en['course.state.notStarted'])).toBeVisible();
  });

  it('shows a finished lesson as done and a letters lesson as letters', async () => {
    stub();
    renderAt('/lessons');
    await userEvent.click(await screen.findByRole('tab', { name: 'A0 · Starter' }));
    const card = screen.getByRole('link', { name: 'First letters' }).closest('[data-state]');
    expect(card).toHaveAttribute('data-state', 'done');
    expect(within(card as HTMLElement).getByText(en['course.state.done'])).toBeVisible();
    expect(within(card as HTMLElement).getByText(en['course.letters'])).toBeVisible();
  });

  it('only shows tabs for the levels the course returns', async () => {
    stub();
    renderAt('/lessons');
    await screen.findByRole('tab', { name: 'A1 · Beginner' });
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual([
      'A0 · Starter',
      'A1 · Beginner',
    ]);
  });

  it('lists the lessons outside the course under More conversation practice', async () => {
    stub();
    renderAt('/lessons');
    const more = await screen.findByRole('region', { name: en['course.more'] });
    expect(within(more).getAllByRole('listitem')).toHaveLength(1);
    expect(within(more).getByRole('link', { name: 'Greetings and introductions' })).toHaveAttribute(
      'href',
      '/lessons/greetings',
    );
    expect(within(more).getByText('Not practised yet')).toBeVisible();
  });

  it('says so when every lesson is finished', async () => {
    const done = courseLesson({ finished: true, stepsDone: ['words', 'practice'] });
    stub({
      [courseKey()]: () =>
        Response.json({
          ...course,
          levels: [{ level: 'A1', units: [{ ...course.levels[1]?.units[0], lessons: [done] }] }],
          nextUp: null,
        }),
    });
    renderAt('/lessons');
    expect(await screen.findByText(en['course.allDone'])).toBeVisible();
    expect(screen.queryByText(en['course.nextUp'])).not.toBeInTheDocument();
  });

  it('shows an empty state when there is nothing at all', async () => {
    stub({
      [courseKey()]: () => Response.json(emptyCourse),
      'GET /lessons': () => Response.json({ levels: [] }),
    });
    renderAt('/lessons');
    expect(await screen.findByText(en['course.empty.title'])).toBeVisible();
  });

  it('offers a retry when the course cannot load', async () => {
    let calls = 0;
    stub({
      [courseKey()]: () => {
        calls += 1;
        return calls < 4 ? jsonError('INTERNAL', 500) : Response.json(course);
      },
    });
    renderAt('/lessons');
    await userEvent.click(
      await screen.findByRole('button', { name: en['load.retry'] }, { timeout: 4000 }),
    );
    expect(await screen.findByRole('tab', { name: 'A1 · Beginner' })).toBeVisible();
  });

  it('sends a visitor to the sign-in page', async () => {
    stubApi({ [courseKey()]: () => jsonError('UNAUTHENTICATED', 401) });
    const router = renderAt('/lessons');
    await screen.findByRole('heading', { level: 1, name: en['page.login'] });
    expect(router.state.location.pathname).toBe('/login');
  });
});
