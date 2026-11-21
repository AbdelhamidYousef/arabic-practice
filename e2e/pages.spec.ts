import { expect, test } from '@playwright/test';

test('an invite link says invites are closed', async ({ page }) => {
  await page.goto('/register?code=ABCD-EFGH-1234');
  await expect(page.getByRole('heading', { name: 'Invites are closed' })).toBeVisible();
  await expect(page.getByLabel('Password')).toHaveCount(0);
});

test('an unknown address shows the 404 page', async ({ page }) => {
  await page.goto('/no-such-page');
  await expect(page.getByTestId('page-not-found')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'We could not find that page' })).toBeVisible();
  await page.getByRole('link', { name: 'Back to the home page' }).click();
  await expect(page).toHaveURL(/\/$/);
});
