import { expect, test } from '@playwright/test';

import { WRONG_SENTENCE, sendTurn, startAsGuest, startGreetingsPractice } from './helpers';

test('progress shows the mistakes, review runs through to the summary', async ({ page }) => {
  await startAsGuest(page);
  await startGreetingsPractice(page);
  await sendTurn(page, WRONG_SENTENCE, 0);

  await page.getByRole('link', { name: 'Progress', exact: true }).click();
  await expect(page).toHaveURL(/\/progress$/);
  await expect(page.getByRole('heading', { name: 'Your progress', level: 1 })).toBeVisible();
  await expect(page.getByText('Corrections by type')).toBeVisible();
  await expect(page.getByText('No corrections yet. Nicely done.')).toHaveCount(0);
  const recent = page.getByRole('region', { name: 'Recent corrections' });
  await expect(recent.getByText('Grammar').first()).toBeVisible();

  await page.getByRole('link', { name: 'Review', exact: true }).click();
  await expect(page).toHaveURL(/\/review$/);
  const session = page.getByRole('region', { name: 'Review session' });
  await expect(session).toBeVisible();
  await expect(session.getByText('Greetings and your name')).toBeVisible();

  // Reveal, answer, repeat: alternate "knew it" and "not yet" until the summary appears.
  const summary = page.getByRole('heading', { name: 'Session complete' });
  for (let card = 0; card < 25 && !(await summary.isVisible()); card += 1) {
    await session.getByRole('button', { name: 'Show meaning' }).click();
    const answer = card % 2 === 0 ? 'I knew it' : 'Not yet';
    await session.getByRole('button', { name: answer }).click();
    await expect(session.getByRole('button', { name: 'Show meaning' }).or(summary)).toBeVisible();
  }
  await expect(summary).toBeVisible();
  await expect(page.getByText(/You knew \d+ of \d+\./)).toBeVisible();
});
