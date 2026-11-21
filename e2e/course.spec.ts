import { expect, test } from '@playwright/test';

import { startAsGuest } from './helpers';

// The course path end to end on the seeded A0 lesson: Start on the next-up card, go through the
// words, and the step shows as done when the learner comes back to the lesson.
test('a guest starts the next lesson, finishes the words and sees the step done', async ({
  page,
}) => {
  await startAsGuest(page);
  await page.getByRole('link', { name: /^Start/ }).click();
  await expect(page).toHaveURL(/\/lessons\/a0-letters-alif-ba\/learn\/words$/);
  await expect(page.getByRole('heading', { name: 'New words', level: 1 })).toBeVisible();
  // No site header in the player.
  await expect(page.getByRole('banner')).toHaveCount(0);

  await page.keyboard.press('Space');
  await expect(page.getByRole('button', { pressed: true })).toBeVisible();
  const next = page.getByRole('button', { name: 'Next', exact: true });
  while (await next.isVisible()) await next.click();
  await page.getByRole('button', { name: 'Done with the words' }).click();
  await expect(page).toHaveURL(/\/learn\/practice$/);
  await expect(page.getByRole('heading', { name: 'Practice', level: 1 })).toBeVisible();

  await page.getByRole('link', { name: 'Close the lesson' }).click();
  await expect(page).toHaveURL(/\/lessons\/a0-letters-alif-ba$/);
  await expect(page.getByRole('link', { name: /Words/ })).toContainText('Done');
  await expect(page.getByRole('link', { name: 'Continue' })).toHaveAttribute(
    'href',
    '/lessons/a0-letters-alif-ba/learn/practice',
  );
});
