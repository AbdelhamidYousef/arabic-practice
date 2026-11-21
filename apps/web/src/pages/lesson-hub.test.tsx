import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { en } from '../i18n';
import { localDay } from '../lib/local-day';
import { course, courseDetail } from '../test/course-fixtures';
import { courseKey, learner, renderAt, stubApi } from '../test-utils';

const signedIn = { 'GET /auth/me': () => Response.json({ user: learner }) };
const progressOk = () => Response.json({ xpGained: 5, xpToday: 5, streak: 1 });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('lesson hub', () => {
  it('shows the unit, the steps with their done state and Continue to the first open step', async () => {
    stubApi({
      ...signedIn,
      'GET /lessons/a1-greetings': () =>
        Response.json(courseDetail({ progress: { stepsDone: ['words'], practiceScore: null } })),
    });
    renderAt('/lessons/a1-greetings');
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Greetings and your name' }),
    ).toBeVisible();
    expect(screen.getByText('Unit A1.1 · Hello and who you are')).toBeVisible();
    expect(screen.getByRole('link', { name: en['hub.back'] })).toHaveAttribute('href', '/lessons');
    const steps = within(screen.getByRole('region', { name: en['hub.steps'] }));
    expect(steps.getAllByRole('listitem')).toHaveLength(5);
    expect(steps.getByRole('link', { name: /Words/ })).toHaveTextContent(en['hub.done']);
    expect(steps.getByRole('link', { name: /Talk/ })).toHaveTextContent(en['hub.optional']);
    expect(screen.getByRole('link', { name: en['hub.continue'] })).toHaveAttribute(
      'href',
      '/lessons/a1-greetings/learn/practice',
    );
  });

  it('skips the steps a lesson has no content for', async () => {
    const base = courseDetail();
    stubApi({
      ...signedIn,
      'GET /lessons/a1-greetings': () =>
        Response.json({ ...base, lesson: { ...base.lesson, grammarNote: [], cultureTip: null } }),
    });
    renderAt('/lessons/a1-greetings');
    const steps = within(await screen.findByRole('region', { name: en['hub.steps'] }));
    expect(steps.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
      expect.stringContaining('Words'),
      expect.stringContaining('Practice'),
      expect.stringContaining('Talk'),
    ]);
    expect(screen.getByRole('link', { name: en['hub.start'] })).toHaveAttribute(
      'href',
      '/lessons/a1-greetings/learn/words',
    );
  });

  it('keeps the old page for a chat lesson with no exercises', async () => {
    stubApi({
      ...signedIn,
      'GET /lessons/greetings': () =>
        Response.json(
          courseDetail({
            exercises: [],
            lesson: { ...courseDetail().lesson, unit: null, slug: 'greetings' },
          }),
        ),
    });
    renderAt('/lessons/greetings');
    expect(await screen.findByRole('button', { name: en['lesson.start'] })).toBeVisible();
    expect(screen.queryByRole('region', { name: en['hub.steps'] })).not.toBeInTheDocument();
  });
});

describe('words step', () => {
  const api = {
    ...signedIn,
    'GET /lessons/a1-greetings': () => Response.json(courseDetail()),
  };

  it('opens in a focused frame without the site header', async () => {
    stubApi(api);
    renderAt('/lessons/a1-greetings/learn/words');
    await screen.findByRole('heading', { level: 1, name: en['words.title'] });
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: en['player.close'] })).toHaveAttribute(
      'href',
      '/lessons/a1-greetings',
    );
    expect(screen.getByRole('progressbar', { name: en['player.progress'] })).toBeInTheDocument();
  });

  it('flips a card by click and announces the back', async () => {
    stubApi(api);
    renderAt('/lessons/a1-greetings/learn/words');
    const card = await screen.findByRole('button', { name: 'مَرْحَبًا' });
    expect(card).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByText('marḥaban')).not.toBeInTheDocument();
    await userEvent.click(card);
    expect(card).toHaveAttribute('aria-pressed', 'true');
    expect(within(card).getByText('marḥaban')).toBeVisible();
    expect(within(card).getByText('hello')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('marḥaban: hello');
  });

  it('flips with Space and Enter from the page, and walks the cards with Next and Previous', async () => {
    stubApi(api);
    renderAt('/lessons/a1-greetings/learn/words');
    const card = await screen.findByRole('button', { name: 'مَرْحَبًا' });
    await userEvent.keyboard(' ');
    expect(card).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard('{Enter}');
    expect(card).toHaveAttribute('aria-pressed', 'false');

    expect(screen.getByText('Word 1 of 2')).toBeVisible();
    expect(screen.getByRole('button', { name: en['words.previous'] })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: en['words.next'] }));
    expect(screen.getByText('Word 2 of 2')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: 'صَبَاحُ النُّورِ' }));
    expect(screen.getByText('Literally “morning of light”.')).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: en['words.previous'] }));
    expect(screen.getByText('Word 1 of 2')).toBeVisible();
  });

  it('posts the words step with the local day on finish and moves to practice', async () => {
    const calls = stubApi({
      ...api,
      'POST /lessons/a1-greetings/progress': progressOk,
      [courseKey()]: () => Response.json({}),
    });
    const router = renderAt('/lessons/a1-greetings/learn/words');
    await userEvent.click(await screen.findByRole('button', { name: en['words.next'] }));
    await userEvent.click(screen.getByRole('button', { name: en['words.finish'] }));
    await vi.waitFor(() =>
      expect(router.state.location.pathname).toBe('/lessons/a1-greetings/learn/practice'),
    );
    expect(calls.find((c) => c.key === 'POST /lessons/a1-greetings/progress')?.body).toEqual({
      step: 'words',
      day: localDay(),
    });
  });

  it('never posts for the read-only demo teacher', async () => {
    const calls = stubApi({
      ...api,
      'GET /auth/me': () =>
        Response.json({ user: { ...learner, role: 'teacher', readOnly: true } }),
    });
    const router = renderAt('/lessons/a1-greetings/learn/words');
    await userEvent.click(await screen.findByRole('button', { name: en['words.next'] }));
    await userEvent.click(screen.getByRole('button', { name: en['words.finish'] }));
    await vi.waitFor(() =>
      expect(router.state.location.pathname).toBe('/lessons/a1-greetings/learn/practice'),
    );
    expect(calls.some((c) => c.key.startsWith('POST'))).toBe(false);
  });

  it('shows an error and stays when the post fails', async () => {
    stubApi({
      ...api,
      'POST /lessons/a1-greetings/progress': () =>
        Response.json({ error: { code: 'INTERNAL', message: 'x' } }, { status: 500 }),
    });
    const router = renderAt('/lessons/a1-greetings/learn/words');
    await userEvent.click(await screen.findByRole('button', { name: en['words.next'] }));
    await userEvent.click(screen.getByRole('button', { name: en['words.finish'] }));
    expect(await screen.findByRole('alert')).toHaveTextContent(en['player.saveError']);
    expect(router.state.location.pathname).toBe('/lessons/a1-greetings/learn/words');
  });

  it('sends an unknown step back to the hub', async () => {
    stubApi(api);
    const router = renderAt('/lessons/a1-greetings/learn/nope');
    await vi.waitFor(() => expect(router.state.location.pathname).toBe('/lessons/a1-greetings'));
  });
});

describe('practice step', () => {
  it('posts the practice score with the local day and moves to the next step', async () => {
    const calls = stubApi({
      ...signedIn,
      'GET /lessons/a1-greetings': () => Response.json(courseDetail()),
      'POST /lessons/a1-greetings/progress': progressOk,
    });
    const router = renderAt('/lessons/a1-greetings/learn/practice');
    await userEvent.click(await screen.findByRole('radio', { name: 'مَرْحَبًا' }));
    await userEvent.click(screen.getByRole('button', { name: en['exercise.check'] }));
    await userEvent.click(screen.getByRole('button', { name: en['practice.finish'] }));
    await vi.waitFor(() =>
      expect(router.state.location.pathname).toBe('/lessons/a1-greetings/learn/grammar'),
    );
    expect(calls.find((c) => c.key === 'POST /lessons/a1-greetings/progress')?.body).toEqual({
      step: 'practice',
      score: 100,
      day: localDay(),
    });
  });
});

describe('grammar, culture, talk and finish', () => {
  const api = {
    ...signedIn,
    'GET /lessons/a1-greetings': () => Response.json(courseDetail()),
    [courseKey()]: () =>
      Response.json({ ...course, nextUp: 'a1-family', stats: { ...course.stats, streak: 4 } }),
  };

  it('renders the grammar blocks with every Arabic run marked, and posts grammar on Continue', async () => {
    const calls = stubApi({ ...api, 'POST /lessons/a1-greetings/progress': progressOk });
    const router = renderAt('/lessons/a1-greetings/learn/grammar');
    expect(
      await screen.findByRole('heading', { level: 1, name: en['grammar.title'] }),
    ).toBeVisible();
    // Inside a paragraph, the example phrase and the example row.
    expect(screen.getAllByText('أَنَا آدَمُ')).toHaveLength(2);
    for (const el of screen.getAllByText('أَنَا آدَمُ')) expect(el).toHaveAttribute('lang', 'ar');
    expect(screen.getByText('anā ādam')).toBeVisible();
    const table = screen.getByRole('table');
    expect(within(table).getByText('كَيْفَ حَالُكِ')).toHaveAttribute('lang', 'ar');
    expect(within(table).getByText('a woman')).not.toHaveAttribute('lang');
    await userEvent.click(screen.getByRole('button', { name: en['player.continue'] }));
    await vi.waitFor(() =>
      expect(router.state.location.pathname).toBe('/lessons/a1-greetings/learn/culture'),
    );
    expect(calls.find((c) => c.key.startsWith('POST'))?.body).toEqual({
      step: 'grammar',
      day: localDay(),
    });
  });

  it('shows the culture tip, then talk, then the finish screen with the XP earned', async () => {
    stubApi({
      ...api,
      'POST /lessons/a1-greetings/progress': () =>
        Response.json({ xpGained: 2, xpToday: 20, streak: 4 }),
    });
    const router = renderAt('/lessons/a1-greetings/learn/culture');
    expect(await screen.findByRole('heading', { name: 'Greetings of light' })).toBeVisible();
    await userEvent.click(screen.getByRole('button', { name: en['player.continue'] }));
    expect(await screen.findByRole('heading', { level: 1, name: en['talk.title'] })).toBeVisible();
    await userEvent.click(screen.getByRole('link', { name: en['talk.skip'] }));
    expect(
      await screen.findByRole('heading', { level: 1, name: en['finish.title'] }),
    ).toBeVisible();
    expect(router.state.location.pathname).toBe('/lessons/a1-greetings/learn/done');
    expect(screen.getByText('+2')).toBeVisible();
    expect(screen.getByText(en['finish.xpLesson'])).toBeVisible();
    expect(screen.getByText('4')).toBeVisible();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(await screen.findByRole('link', { name: en['finish.next'] })).toHaveAttribute(
      'href',
      '/lessons/a1-family',
    );
    expect(screen.getByRole('link', { name: en['finish.toCourse'] })).toHaveAttribute(
      'href',
      '/lessons',
    );
  });

  it('shows XP today and the course streak when the finish screen is opened fresh', async () => {
    stubApi(api);
    renderAt('/lessons/a1-greetings/learn/done');
    expect(await screen.findByText(en['course.stat.xpToday'])).toBeVisible();
    expect(await screen.findByText('18')).toBeVisible();
    expect(screen.getByText('4')).toBeVisible();
    expect(screen.queryByText(en['finish.xpLesson'])).not.toBeInTheDocument();
  });

  it('starts the conversation from the talk step and opens the chat', async () => {
    const calls = stubApi({
      ...api,
      'POST /conversations': () =>
        Response.json(
          {
            conversation: {
              id: 'c10',
              lessonId: 'cl1',
              turnCount: 0,
              lastMessageAt: '2026-11-21T10:00:00.000Z',
              createdAt: '2026-11-21T10:00:00.000Z',
            },
            messages: [],
          },
          { status: 201 },
        ),
    });
    const router = renderAt('/lessons/a1-greetings/learn/talk');
    await userEvent.click(await screen.findByRole('button', { name: en['talk.start'] }));
    await vi.waitFor(() => expect(router.state.location.pathname).toBe('/practice/c10'));
    expect(calls.find((c) => c.key === 'POST /conversations')?.body).toEqual({ lessonId: 'cl1' });
  });
});
