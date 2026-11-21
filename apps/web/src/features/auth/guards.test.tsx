import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { en } from '../../i18n';
import { learner, renderAt, stubApi, teacher } from '../../test-utils';

const signedIn = { 'GET /auth/me': () => Response.json({ user: learner }) };

describe('guards and sign-out', () => {
  it('sends a visitor from a learner page to the sign-in', async () => {
    stubApi({});
    const router = renderAt('/progress');
    await screen.findByRole('heading', { level: 1, name: en['page.login'] });
    expect(router.state.location.pathname).toBe('/login');
  });

  it('sends a visitor from a teacher page to the sign-in', async () => {
    stubApi({});
    const router = renderAt('/teacher/usage');
    await screen.findByRole('heading', { level: 1, name: en['page.login'] });
    expect(router.state.location.pathname).toBe('/login');
  });

  it('sends a learner from a teacher page to the lessons', async () => {
    stubApi({ ...signedIn, 'GET /lessons': () => Response.json({ levels: [] }) });
    const router = renderAt('/teacher/invites');
    await screen.findByRole('heading', { level: 1, name: en['page.lessons'] });
    expect(router.state.location.pathname).toBe('/lessons');
  });

  it('lets a teacher in', async () => {
    stubApi({
      'GET /auth/me': () => Response.json({ user: teacher }),
      'GET /teacher/learners': () => Response.json({ learners: [] }),
    });
    renderAt('/teacher');
    expect(
      await screen.findByRole('heading', { level: 1, name: en['page.teacher'] }),
    ).toBeVisible();
  });

  it('signs out: posts the logout, forgets the person and goes to the start page', async () => {
    const calls = stubApi({
      ...signedIn,
      'GET /lessons': () => Response.json({ levels: [] }),
      'POST /auth/logout': () => new Response(null, { status: 204 }),
    });
    const router = renderAt('/lessons');
    await userEvent.click(await screen.findByRole('button', { name: en['nav.signOut'] }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/'));
    expect(calls.some((c) => c.key === 'POST /auth/logout')).toBe(true);
    expect(await screen.findAllByRole('link', { name: en['nav.signIn'] })).not.toHaveLength(0);
    expect(screen.queryByRole('button', { name: en['nav.signOut'] })).not.toBeInTheDocument();
  });
});
