import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { en } from '../i18n';
import { jsonError, renderAt, stubApi } from '../test-utils';

const TOKEN = 'T'.repeat(43);
const NEW = 'a brand new passphrase';

async function fill(password: string, again: string) {
  await userEvent.type(await screen.findByLabelText(en['settings.password.new']), password);
  await userEvent.type(screen.getByLabelText(en['settings.password.confirm']), again);
  await userEvent.click(screen.getByRole('button', { name: en['reset.submit'] }));
}

describe('reset password page', () => {
  it('sets the new password with the link token and offers the sign-in', async () => {
    const calls = stubApi({ 'POST /auth/reset': () => new Response(null, { status: 204 }) });
    renderAt(`/reset/${TOKEN}`);
    expect(await screen.findByRole('heading', { level: 1, name: en['page.reset'] })).toBeVisible();
    await fill(NEW, NEW);
    expect(await screen.findByRole('status')).toHaveTextContent(en['reset.done']);
    expect(calls.find((c) => c.key === 'POST /auth/reset')?.body).toEqual({
      token: TOKEN,
      password: NEW,
    });
    expect(
      within(screen.getByTestId('reset-card')).getByRole('link', { name: en['auth.submit.login'] }),
    ).toHaveAttribute('href', '/login');
  });

  it('checks the password locally and sends nothing when it is weak or mistyped', async () => {
    const calls = stubApi({});
    renderAt(`/reset/${TOKEN}`);
    await fill('short', 'short');
    expect(await screen.findByText(/at least 10/i)).toBeVisible();

    await userEvent.clear(screen.getByLabelText(en['settings.password.new']));
    await userEvent.type(screen.getByLabelText(en['settings.password.new']), NEW);
    await userEvent.click(screen.getByRole('button', { name: en['reset.submit'] }));
    expect(await screen.findByText(en['settings.password.mismatch'])).toBeVisible();
    expect(calls.some((c) => c.key === 'POST /auth/reset')).toBe(false);
  });

  it('explains a link that expired, was used or never existed (404), in place of the form', async () => {
    stubApi({ 'POST /auth/reset': () => jsonError('NOT_FOUND', 404) });
    renderAt(`/reset/${TOKEN}`);
    await fill(NEW, NEW);
    expect(await screen.findByText(en['reset.invalid.title'])).toBeVisible();
    expect(screen.queryByLabelText(en['settings.password.new'])).toBeNull();
  });

  it('keeps the form and says so when rate limited', async () => {
    stubApi({ 'POST /auth/reset': () => jsonError('RATE_LIMITED', 429) });
    renderAt(`/reset/${TOKEN}`);
    await fill(NEW, NEW);
    expect(await screen.findByRole('alert')).toHaveTextContent(en['auth.error.rateLimited']);
    expect(screen.getByLabelText(en['settings.password.new'])).toBeVisible();
  });
});
