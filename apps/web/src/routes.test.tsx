import { QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { en } from './i18n';
import { createQueryClient } from './lib/query-client';
import { routes } from './routes';

const learner = {
  id: 'u1',
  displayName: 'Sara',
  role: 'learner',
  level: 'A2',
  isGuest: false,
  readOnly: false,
  email: null,
};
const teacher = { ...learner, id: 't1', displayName: 'Omar', role: 'teacher', level: 'A1' };

type Who = typeof learner | typeof teacher | null;

// Routes the stubbed API by path; `health` can be made slow or failing.
function stubApi(who: Who, health: 'ok' | 'down' | 'slow' = 'ok') {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      if (url.endsWith('/auth/me')) {
        return Promise.resolve(
          who
            ? Response.json({ user: who })
            : Response.json({ error: { code: 'UNAUTHENTICATED', message: 'No' } }, { status: 401 }),
        );
      }
      if (url.endsWith('/health')) {
        if (health === 'down') return Promise.reject(new TypeError('offline'));
        if (health === 'slow') return new Promise(() => undefined);
        return Promise.resolve(Response.json({ status: 'ok' }));
      }
      return Promise.resolve(Response.json({}, { status: 404 }));
    }),
  );
}

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}

const navLinks = () =>
  within(screen.getByRole('navigation', { name: en['shell.mainNav'] }))
    .getAllByRole('link')
    .map((a) => a.textContent);

describe('layout', () => {
  beforeEach(() => stubApi(null));

  it('has the landmarks, the skip link first, and the honest footer line', async () => {
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1, name: en['home.title'] })).toBeVisible();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main');
    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      "Practice chats on this demo are processed by Google's Gemini free tier. Please don't type personal information.",
    );
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByTestId('skip-link')).toHaveFocus();
    expect(screen.getByTestId('skip-link')).toHaveAttribute('href', '#main');
  });

  it('shows the not-found page for an unknown address, inside the layout', async () => {
    renderAt('/no/such/page');
    expect(await screen.findByTestId('page-not-found')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(en['notFound.heading']);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(document.title).toBe(`${en['notFound.title']} | ${en['app.name']}`);
  });

  it('moves focus to <main> on a route change, but not on first load', async () => {
    const router = renderAt('/');
    await screen.findByRole('heading', { level: 1, name: en['home.title'] });
    expect(screen.getByRole('main')).not.toHaveFocus();
    await act(() => router.navigate('/login'));
    await screen.findByRole('heading', { level: 1, name: en['page.login'] });
    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus());
  });

  it('sets the document title from <Seo>', async () => {
    renderAt('/login');
    await screen.findByRole('heading', { level: 1, name: en['page.login'] });
    expect(document.title).toBe(`${en['page.login']} | ${en['app.name']}`);
  });
});

describe('routes', () => {
  const cases: [string, string][] = [
    ['/', en['home.title']],
    ['/login', en['page.login']],
    ['/register', en['page.register']],
    ['/lessons', en['page.lessons']],
    ['/practice/c1', en['page.practice']],
    ['/progress', en['page.progress']],
    ['/review', en['page.review']],
    ['/teacher', en['page.teacher']],
    ['/teacher/lessons', en['page.teacherLessons']],
    ['/teacher/lessons/l1', en['page.teacherLesson']],
    ['/teacher/learners/u1', en['page.teacherLearner']],
    ['/teacher/conversations/c1', en['page.teacherConversation']],
    ['/teacher/invites', en['page.teacherInvites']],
    ['/teacher/usage', en['page.teacherUsage']],
  ];

  it.each(cases)('%s renders its page', async (path, heading) => {
    stubApi(null);
    renderAt(path);
    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
  });
});

describe('role-aware navigation', () => {
  it('offers only "Sign in" to a visitor', async () => {
    stubApi(null);
    renderAt('/');
    await screen.findByRole('heading', { level: 1, name: en['home.title'] });
    expect(navLinks()).toEqual([en['nav.signIn']]);
  });

  it('offers Lessons, Review and Progress to a learner', async () => {
    stubApi(learner);
    renderAt('/progress');
    await screen.findByRole('heading', { level: 1, name: en['page.progress'] });
    await screen.findByRole('link', { name: en['nav.review'] });
    expect(navLinks()).toEqual([en['nav.lessons'], en['nav.review'], en['nav.progress']]);
  });

  it('offers Lessons, Learners, Invites and Usage to a teacher', async () => {
    stubApi(teacher);
    renderAt('/teacher');
    await screen.findByRole('heading', { level: 1, name: en['page.teacher'] });
    await screen.findByRole('link', { name: en['nav.learners'] });
    expect(navLinks()).toEqual([
      en['nav.lessons'],
      en['nav.learners'],
      en['nav.invites'],
      en['nav.usage'],
    ]);
  });

  it('marks the current page, and only Learners on the teacher home', async () => {
    stubApi(teacher);
    renderAt('/teacher');
    await screen.findByRole('heading', { level: 1, name: en['page.teacher'] });
    await screen.findByRole('link', { name: en['nav.learners'] });
    const current = within(screen.getByRole('navigation', { name: en['shell.mainNav'] }))
      .getAllByRole('link')
      .filter((a) => a.getAttribute('aria-current') === 'page')
      .map((a) => a.textContent);
    expect(current).toEqual([en['nav.learners']]);
  });
});

describe('server notice', () => {
  afterEach(() => vi.useRealTimers());

  it('says nothing while the server answers', async () => {
    stubApi(null);
    renderAt('/');
    await screen.findByRole('heading', { level: 1, name: en['home.title'] });
    expect(screen.queryByTestId('server-notice')).toBeNull();
  });

  it('explains a slow first answer as the server waking up', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    stubApi(null, 'slow');
    renderAt('/');
    await screen.findByRole('heading', { level: 1, name: en['home.title'] });
    expect(screen.queryByTestId('server-notice')).toBeNull();
    await act(() => vi.advanceTimersByTimeAsync(4_100));
    expect(screen.getByTestId('server-notice')).toHaveTextContent(en['shell.waking']);
  });

  it('says the server is not answering when the health check fails', async () => {
    stubApi(null, 'down');
    renderAt('/');
    expect(await screen.findByTestId('server-notice')).toHaveTextContent(en['shell.unreachable']);
  });
});
