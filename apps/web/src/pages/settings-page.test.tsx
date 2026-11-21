import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { en } from '../i18n';
import { jsonError, learner, renderAt, stubApi, teacher } from '../test-utils';

const signedInAs = (user: object) => ({ 'GET /auth/me': () => Response.json({ user }) });
const lessons = { 'GET /course': () => Response.json({}) };

async function fillPasswordForm(current: string, next: string, again: string) {
  await userEvent.type(await screen.findByLabelText(en['settings.password.current']), current);
  await userEvent.type(screen.getByLabelText(en['settings.password.new']), next);
  await userEvent.type(screen.getByLabelText(en['settings.password.confirm']), again);
  await userEvent.click(screen.getByRole('button', { name: en['settings.password.submit'] }));
}

describe('settings page: change password', () => {
  it('shows the account and sends the change, then confirms and clears the form', async () => {
    const calls = stubApi({
      ...signedInAs(learner),
      'POST /auth/password': () => new Response(null, { status: 204 }),
    });
    renderAt('/settings');
    expect(
      await screen.findByRole('heading', { level: 1, name: en['page.settings'] }),
    ).toBeVisible();
    expect(screen.getByText('sara@example.com')).toBeVisible();

    await fillPasswordForm('old password here', 'a brand new passphrase', 'a brand new passphrase');
    expect(await screen.findByRole('status')).toHaveTextContent(en['settings.password.done']);
    expect(calls.find((c) => c.key === 'POST /auth/password')?.body).toEqual({
      currentPassword: 'old password here',
      newPassword: 'a brand new passphrase',
    });
    expect(screen.getByLabelText(en['settings.password.current'])).toHaveValue('');
  });

  it('checks the new password locally and sends nothing when it is weak or mistyped', async () => {
    const calls = stubApi(signedInAs(learner));
    renderAt('/settings');
    await fillPasswordForm('old password here', 'short', 'short');
    expect(await screen.findByText(/at least 10/i)).toBeVisible();

    await userEvent.clear(screen.getByLabelText(en['settings.password.new']));
    await userEvent.type(
      screen.getByLabelText(en['settings.password.new']),
      'a brand new passphrase',
    );
    await userEvent.click(screen.getByRole('button', { name: en['settings.password.submit'] }));
    expect(await screen.findByText(en['settings.password.mismatch'])).toBeVisible();
    expect(calls.some((c) => c.key === 'POST /auth/password')).toBe(false);
  });

  it('says the current password is wrong without signing the person out', async () => {
    stubApi({
      ...signedInAs(learner),
      'POST /auth/password': () => jsonError('WRONG_PASSWORD', 403),
    });
    const router = renderAt('/settings');
    await fillPasswordForm('nope nope nope', 'a brand new passphrase', 'a brand new passphrase');
    expect(await screen.findByRole('alert')).toHaveTextContent(en['auth.error.wrongPassword']);
    expect(router.state.location.pathname).toBe('/settings');
  });

  it('is linked from the header for a signed-in learner', async () => {
    stubApi({ ...signedInAs(learner), ...lessons });
    renderAt('/progress');
    expect(await screen.findByRole('link', { name: en['nav.settings'] })).toHaveAttribute(
      'href',
      '/settings',
    );
  });

  it('sends a guest back to the lessons, and a visitor to the sign-in', async () => {
    stubApi({ ...signedInAs({ ...learner, isGuest: true, email: null }), ...lessons });
    const guest = renderAt('/settings');
    await screen.findByRole('heading', { level: 1, name: en['page.course'] });
    expect(guest.state.location.pathname).toBe('/lessons');
  });

  it('redirects a visitor to the sign-in', async () => {
    stubApi({});
    const router = renderAt('/settings');
    await screen.findByRole('heading', { level: 1, name: en['page.login'] });
    expect(router.state.location.pathname).toBe('/login');
  });

  it('shows the demo teacher a note instead of the forms', async () => {
    stubApi(signedInAs({ ...teacher, readOnly: true }));
    renderAt('/settings');
    expect(await screen.findByText(en['settings.demo'])).toBeVisible();
    expect(screen.queryByLabelText(en['settings.password.current'])).toBeNull();
  });
});
