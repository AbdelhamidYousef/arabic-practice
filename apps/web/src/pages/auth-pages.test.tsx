import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { en } from '../i18n';
import { jsonError, learner, renderAt, stubApi, teacher } from '../test-utils';

const lessonsStub = { 'GET /lessons': () => Response.json({ levels: [] }) };

describe('landing page', () => {
  it('shows the pitch, the example turn and the three actions to a visitor', async () => {
    stubApi({});
    renderAt('/');
    expect(await screen.findByRole('heading', { level: 1, name: en['home.title'] })).toBeVisible();
    expect(screen.getByRole('button', { name: en['home.cta.guest'] })).toBeVisible();
    expect(screen.getByRole('button', { name: en['home.cta.teacher'] })).toBeVisible();
    expect(screen.getAllByRole('link', { name: en['nav.signIn'] }).length).toBeGreaterThan(0);
    const example = screen.getByTestId('example-turn');
    expect(example).toHaveTextContent(en['home.turn.example']);
    expect(example).toHaveTextContent(en['home.turn.explanation']);
    expect(example.querySelectorAll('[lang="ar"]').length).toBeGreaterThanOrEqual(5);
  });

  it("the hero's start button starts a guest session and opens the lessons", async () => {
    const calls = stubApi({
      'POST /auth/guest': () => Response.json({ user: { ...learner, isGuest: true, email: null } }),
      ...lessonsStub,
    });
    const router = renderAt('/');
    await userEvent.click(await screen.findByRole('button', { name: en['home.cta.guest'] }));
    expect(
      await screen.findByRole('heading', { level: 1, name: en['page.lessons'] }),
    ).toBeVisible();
    expect(router.state.location.pathname).toBe('/lessons');
    expect(calls.some((c) => c.key === 'POST /auth/guest')).toBe(true);
  });

  it('"See the teacher view" signs in the demo teacher and opens /teacher', async () => {
    stubApi({ 'POST /auth/demo-teacher': () => Response.json({ user: teacher }) });
    const router = renderAt('/');
    await userEvent.click(await screen.findByRole('button', { name: en['home.cta.teacher'] }));
    await screen.findByRole('heading', { level: 1, name: en['page.teacher'] });
    expect(router.state.location.pathname).toBe('/teacher');
  });

  it('says so when the demo is not set up', async () => {
    stubApi({ 'POST /auth/guest': () => jsonError('DEMO_UNAVAILABLE', 503) });
    renderAt('/');
    await userEvent.click(await screen.findByRole('button', { name: en['home.cta.guest'] }));
    expect(await screen.findByRole('alert')).toHaveTextContent(en['auth.error.demoUnavailable']);
  });

  it('sends a signed-in learner to /lessons and a teacher to /teacher', async () => {
    stubApi({ 'GET /auth/me': () => Response.json({ user: learner }), ...lessonsStub });
    const first = renderAt('/');
    await screen.findByRole('heading', { level: 1, name: en['page.lessons'] });
    expect(first.state.location.pathname).toBe('/lessons');
  });

  it('sends a signed-in teacher to /teacher', async () => {
    stubApi({ 'GET /auth/me': () => Response.json({ user: teacher }) });
    const router = renderAt('/');
    await screen.findByRole('heading', { level: 1, name: en['page.teacher'] });
    expect(router.state.location.pathname).toBe('/teacher');
  });
});

describe('login page', () => {
  async function fill(email: string, password: string) {
    await userEvent.type(await screen.findByLabelText(en['auth.email']), email);
    if (password) await userEvent.type(screen.getByLabelText(en['auth.password']), password);
    await userEvent.click(screen.getByRole('button', { name: en['auth.submit.login'] }));
  }

  it('shows wrong credentials inline and keeps the form', async () => {
    stubApi({ 'POST /auth/login': () => jsonError('UNAUTHENTICATED', 401) });
    renderAt('/login');
    await fill('sara@example.com', 'wrong-password');
    expect(await screen.findByRole('alert')).toHaveTextContent(en['auth.error.credentials']);
    expect(screen.getByLabelText(en['auth.email'])).toHaveValue('sara@example.com');
  });

  it('shows the rate-limit message', async () => {
    stubApi({ 'POST /auth/login': () => jsonError('RATE_LIMITED', 429) });
    renderAt('/login');
    await fill('sara@example.com', 'whatever-it-is');
    expect(await screen.findByRole('alert')).toHaveTextContent(en['auth.error.rateLimited']);
  });

  it('validates before calling the API', async () => {
    const calls = stubApi({});
    renderAt('/login');
    await fill('not-an-email', '');
    expect(await screen.findByText(en['auth.error.emailRequired'])).toBeVisible();
    expect(screen.getByText(en['auth.error.passwordRequired'])).toBeVisible();
    expect(calls.some((c) => c.key === 'POST /auth/login')).toBe(false);
  });

  it('signs in, sends the normalised email, and opens the learner start page', async () => {
    const calls = stubApi({
      'POST /auth/login': () => Response.json({ user: learner }),
      ...lessonsStub,
    });
    const router = renderAt('/login');
    await fill('  Sara@Example.com ', 'a-long-password');
    await screen.findByRole('heading', { level: 1, name: en['page.lessons'] });
    expect(router.state.location.pathname).toBe('/lessons');
    expect(calls.find((c) => c.key === 'POST /auth/login')?.body).toEqual({
      email: 'sara@example.com',
      password: 'a-long-password',
    });
  });
});

describe('register page', () => {
  it('shows "invites are closed" while sign-up is off', async () => {
    stubApi({ 'GET /auth/invites/abcdefghijklmnop': () => jsonError('INVITES_CLOSED', 403) });
    renderAt('/register?code=abcdefghijklmnop');
    expect(await screen.findByText(en['register.closed.title'])).toBeVisible();
    expect(screen.queryByLabelText(en['auth.email'])).not.toBeInTheDocument();
  });

  it('explains a link with no code, and a code that does not work', async () => {
    stubApi({
      'GET /auth/invites/abcdefghijklmnop': () =>
        Response.json({ valid: false, teacherName: null }),
    });
    renderAt('/register');
    expect(await screen.findByText(en['register.noCode'])).toBeVisible();
  });

  it('shows the dead-link state for an invalid code', async () => {
    stubApi({
      'GET /auth/invites/abcdefghijklmnop': () =>
        Response.json({ valid: false, teacherName: null }),
    });
    renderAt('/register?code=abcdefghijklmnop');
    expect(await screen.findByText(en['register.invalid.title'])).toBeVisible();
  });

  it('shows the form for a valid invite and registers', async () => {
    const calls = stubApi({
      'GET /auth/invites/abcdefghijklmnop': () =>
        Response.json({ valid: true, teacherName: 'Omar' }),
      'POST /auth/register': () => Response.json({ user: learner }),
      ...lessonsStub,
    });
    const router = renderAt('/register?code=abcdefghijklmnop');
    expect(await screen.findByText('Invited by Omar')).toBeVisible();
    await userEvent.type(screen.getByLabelText(en['auth.displayName']), 'Sara');
    await userEvent.type(screen.getByLabelText(en['auth.email']), 'sara@example.com');
    await userEvent.type(screen.getByLabelText(en['auth.password']), 'a-fine-long-passphrase');
    await userEvent.click(screen.getByRole('button', { name: en['auth.submit.register'] }));
    await screen.findByRole('heading', { level: 1, name: en['page.lessons'] });
    expect(router.state.location.pathname).toBe('/lessons');
    expect(calls.find((c) => c.key === 'POST /auth/register')?.body).toEqual({
      code: 'abcdefghijklmnop',
      email: 'sara@example.com',
      password: 'a-fine-long-passphrase',
      displayName: 'Sara',
    });
  });

  it('shows the password rule from the shared schema', async () => {
    stubApi({
      'GET /auth/invites/abcdefghijklmnop': () => Response.json({ valid: true, teacherName: null }),
    });
    renderAt('/register?code=abcdefghijklmnop');
    await userEvent.type(await screen.findByLabelText(en['auth.displayName']), 'Sara');
    await userEvent.type(screen.getByLabelText(en['auth.email']), 'sara@example.com');
    await userEvent.type(screen.getByLabelText(en['auth.password']), 'short');
    await userEvent.click(screen.getByRole('button', { name: en['auth.submit.register'] }));
    expect(await screen.findByText('Use at least 10 characters')).toBeVisible();
  });
});
