import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { en } from '../i18n';
import { jsonError, renderAt, stubApi, teacher, type Handlers } from '../test-utils';

const demo = { ...teacher, displayName: 'Demo Teacher', readOnly: true };
const asTeacher = { 'GET /auth/me': () => Response.json({ user: teacher }) };
const asDemo = { 'GET /auth/me': () => Response.json({ user: demo }) };

const invite = (over: object) => ({
  id: 'i1',
  note: 'Class A',
  maxUses: 5,
  usedCount: 2,
  expiresAt: '2026-12-01T00:00:00.000Z',
  createdAt: '2026-11-20T00:00:00.000Z',
  status: 'active',
  ...over,
});

describe('invites page', () => {
  const open: Handlers = {};
  const list = (invites: object[], invitesOpen = true): Handlers => ({
    ...asTeacher,
    'GET /teacher/invites': () => Response.json({ invites, invitesOpen }),
  });
  const created = {
    invite: invite({ id: 'i2', note: 'New one', maxUses: 1, usedCount: 0 }),
    code: 'abcdefghijklmnop',
    invitePath: '/register?code=abcdefghijklmnop',
  };

  it('lists invites with uses, status and expiry', async () => {
    stubApi({
      ...open,
      ...list([invite({}), invite({ id: 'i3', note: '', status: 'expired', usedCount: 0 })]),
    });
    renderAt('/teacher/invites');
    expect(await screen.findByText('Class A')).toBeVisible();
    expect(screen.getByText('2 / 5')).toBeVisible();
    expect(screen.getByText(en['invites.status.expired'])).toBeVisible();
    expect(screen.getByText(en['invites.noNote'])).toBeVisible();
    expect(screen.queryByTestId('invites-closed')).not.toBeInTheDocument();
  });

  it('shows an empty state', async () => {
    stubApi({ ...open, ...list([]) });
    renderAt('/teacher/invites');
    expect(await screen.findByText(en['invites.empty.title'])).toBeVisible();
  });

  it('creates an invite and shows the link once, with a copy button', async () => {
    const calls = stubApi({
      ...open,
      ...list([]),
      'POST /teacher/invites': () => Response.json(created, { status: 201 }),
    });
    renderAt('/teacher/invites');
    // After the app is up: replace the clipboard so the copy can be observed.
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    await userEvent.type(await screen.findByLabelText(en['invites.field.note']), 'New one');
    await userEvent.click(screen.getByRole('button', { name: en['invites.submit'] }));
    const card = await screen.findByTestId('created-invite');
    expect(calls.find((c) => c.key === 'POST /teacher/invites')?.body).toEqual({
      note: 'New one',
      maxUses: 1,
      expiresInDays: 7,
    });
    expect(within(card).getByText(en['invites.created.once'])).toBeVisible();
    const link = `${window.location.origin}/register?code=abcdefghijklmnop`;
    expect(within(card).getByLabelText(en['invites.created.link'])).toHaveValue(link);
    await userEvent.click(within(card).getByRole('button', { name: en['invites.created.copy'] }));
    expect(await within(card).findByText(en['invites.created.copied'])).toBeVisible();
    expect(writeText).toHaveBeenCalledWith(link);
    await userEvent.click(within(card).getByRole('button', { name: en['invites.created.done'] }));
    expect(screen.queryByTestId('created-invite')).not.toBeInTheDocument();
  });

  it('validates the form before sending', async () => {
    const calls = stubApi({ ...open, ...list([]) });
    renderAt('/teacher/invites');
    const uses = await screen.findByLabelText(en['invites.field.maxUses']);
    await userEvent.clear(uses);
    await userEvent.type(uses, '500');
    await userEvent.click(screen.getByRole('button', { name: en['invites.submit'] }));
    expect(await screen.findByText(en['invites.error.maxUses'])).toBeVisible();
    expect(calls.some((c) => c.key === 'POST /teacher/invites')).toBe(false);
  });

  it('still lets the teacher create while sign-up is closed, with a notice', async () => {
    stubApi({
      ...list([], false),
      'POST /teacher/invites': () => Response.json(created, { status: 201 }),
    });
    renderAt('/teacher/invites');
    expect(await screen.findByTestId('invites-closed')).toHaveTextContent(
      /closed on the free tier/,
    );
    await userEvent.click(screen.getByRole('button', { name: en['invites.submit'] }));
    expect(await screen.findByTestId('created-invite')).toBeVisible();
  });

  it('is read-only for the demo teacher', async () => {
    stubApi({ ...open, ...list([]), ...asDemo });
    renderAt('/teacher/invites');
    expect(await screen.findByRole('button', { name: en['invites.submit'] })).toBeDisabled();
    expect(screen.getByLabelText(en['invites.field.note'])).toBeDisabled();
    expect(screen.getByText(en['readOnly.banner'])).toBeVisible();
  });

  it('explains a DEMO_READ_ONLY refusal from the server', async () => {
    stubApi({
      ...open,
      ...list([]),
      'POST /teacher/invites': () => jsonError('DEMO_READ_ONLY', 403),
    });
    renderAt('/teacher/invites');
    await userEvent.click(await screen.findByRole('button', { name: en['invites.submit'] }));
    expect(await screen.findByText(en['readOnly.error'])).toBeVisible();
  });

  it('shows an error with a retry', async () => {
    stubApi({ ...open, ...asTeacher, 'GET /teacher/invites': () => jsonError('FORBIDDEN', 403) });
    renderAt('/teacher/invites');
    expect(await screen.findByRole('button', { name: en['load.retry'] })).toBeVisible();
  });
});

const usage = {
  days: Array.from({ length: 30 }, (_, i) => ({
    date: `2026-11-${String(i + 1).padStart(2, '0')}`,
    calls: i === 29 ? 4 : 0,
    inputTokens: 0,
    outputTokens: 0,
    costMicroUsd: 0,
    limited: 0,
  })),
  byPurpose: [
    {
      purpose: 'practice_turn',
      calls: 40,
      inputTokens: 12000,
      outputTokens: 3000,
      costMicroUsd: 2500,
    },
  ],
  byModel: [
    {
      model: 'gemini-flash',
      calls: 40,
      inputTokens: 12000,
      outputTokens: 3000,
      costMicroUsd: 2500,
    },
  ],
  today: {
    date: '2026-11-30',
    caps: { learnerTurns: 30, guestTurns: 10, callsPerModel: 200 },
    models: [{ model: 'gemini-flash', calls: 12 }],
    people: [
      { userId: 'u1', displayName: 'Layla', isGuest: false, turns: 3 },
      { userId: 'u2', displayName: 'Guest 7', isGuest: true, turns: 1 },
    ],
  },
};

describe('usage page', () => {
  it('shows today against the caps and the 30-day tables', async () => {
    stubApi({ ...asTeacher, 'GET /teacher/usage': () => Response.json(usage) });
    renderAt('/teacher/usage');
    expect(await screen.findByText('12 / 200')).toBeVisible();
    expect(screen.getByText('3 / 30')).toBeVisible();
    expect(screen.getByText('1 / 10')).toBeVisible();
    expect(screen.getByText('practice_turn')).toBeVisible();
    expect(screen.getAllByText('$0.0025').length).toBeGreaterThan(0);
    expect(screen.getAllByText('12,000', { selector: 'td' })).toHaveLength(2);
  });

  it('says so when nothing was called', async () => {
    stubApi({
      ...asTeacher,
      'GET /teacher/usage': () =>
        Response.json({
          ...usage,
          byPurpose: [],
          byModel: [],
          today: { ...usage.today, models: [], people: [] },
        }),
    });
    renderAt('/teacher/usage');
    expect(await screen.findByText(en['usage.noCalls'])).toBeVisible();
    expect(screen.getByText(en['usage.noCallsToday'])).toBeVisible();
  });

  it('shows an error with a retry', async () => {
    stubApi({ ...asTeacher, 'GET /teacher/usage': () => jsonError('FORBIDDEN', 403) });
    renderAt('/teacher/usage');
    expect(await screen.findByRole('button', { name: en['load.retry'] })).toBeVisible();
  });
});
