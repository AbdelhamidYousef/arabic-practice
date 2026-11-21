import { expect, test } from '@playwright/test';

import { E2E_GUEST_TURN_CAP } from '../playwright.config';

import {
  RIGHT_SENTENCE,
  composer,
  sendTurn,
  startAsGuest,
  startGreetingsPractice,
} from './helpers';

test('the turn after the daily guest cap shows the limit message', async ({ page }) => {
  await startAsGuest(page);
  await startGreetingsPractice(page);
  for (let turn = 0; turn < E2E_GUEST_TURN_CAP; turn += 1) {
    await sendTurn(page, RIGHT_SENTENCE, turn);
  }

  await composer(page).fill(RIGHT_SENTENCE);
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText("You've reached today's practice limit.")).toBeVisible();
  await expect(page.getByText(/It resets at/)).toBeVisible();
});
