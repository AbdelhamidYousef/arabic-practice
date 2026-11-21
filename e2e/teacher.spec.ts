import { expect, test } from '@playwright/test';

import { startAsDemoTeacher } from './helpers';

test('the demo teacher reads learners and transcripts; nothing can be changed', async ({
  page,
}) => {
  await startAsDemoTeacher(page);

  // The seeded class.
  const table = page.getByRole('table');
  for (const name of ['Layla Hart', 'Omar Whitfield', 'Sofia Marin', 'Daniel Okafor']) {
    await expect(table.getByRole('link', { name })).toBeVisible();
  }

  await table.getByRole('link', { name: 'Layla Hart' }).click();
  await expect(page.getByRole('heading', { name: 'Layla Hart', level: 1 })).toBeVisible();
  await page.getByRole('link', { name: 'Read transcript' }).first().click();
  await expect(page).toHaveURL(/\/teacher\/conversations\/[0-9a-f-]+$/);
  await expect(page.getByText('Read-only transcript.')).toBeVisible();

  // The lessons editor: banner on, save disabled.
  await page.goto('/teacher/lessons');
  await page
    .getByRole('link', { name: /Greetings and introductions/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/teacher\/lessons\/[0-9a-f-]+$/);
  await expect(page.getByText('Demo teacher view — changes are switched off.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Save lesson' })).toBeDisabled();

  // Sign-up is closed on the free tier.
  await page.goto('/teacher/invites');
  await expect(page.getByText(/Sign-up is closed on the free tier/)).toBeVisible();
});
