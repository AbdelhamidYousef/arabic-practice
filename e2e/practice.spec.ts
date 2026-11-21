import { expect, test } from '@playwright/test';

import {
  CORRECTED_SENTENCE,
  RIGHT_SENTENCE,
  WRONG_SENTENCE,
  bubbles,
  correctCard,
  sendTurn,
  startAsGuest,
  startGreetingsPractice,
} from './helpers';

test('a guest practises: reply streams, correction card, correct card, translate', async ({
  page,
}) => {
  await startAsGuest(page);
  await startGreetingsPractice(page);
  // The opening line is already there.
  await expect(bubbles(page)).toHaveCount(1);

  // A wrong sentence: the learner bubble, the partner reply and a correction with a mistake.
  await sendTurn(page, WRONG_SENTENCE, 0);
  const conversation = page.getByRole('list', { name: 'Conversation' });
  await expect(conversation.getByText('أَهْلًا! كَيْفَ حَالُكَ؟').first()).toBeVisible();
  await expect(conversation.getByText('Corrected sentence')).toBeVisible();
  await expect(conversation.locator('mark').first()).toBeVisible();
  const mistakes = conversation.getByRole('list', { name: 'What to fix' });
  await expect(mistakes.getByText('Grammar')).toBeVisible();
  await expect(mistakes.getByText(/takes ال/)).toBeVisible();
  // Only the changed word is highlighted: the demonstrative's noun gained ال.
  await expect(conversation.locator('mark')).toHaveText(CORRECTED_SENTENCE.split(' ')[1] ?? '');

  // A right sentence: the green card.
  await sendTurn(page, RIGHT_SENTENCE, 1);
  await expect(correctCard(page)).toBeVisible();

  // Translate on the last partner message shows English.
  await conversation.getByRole('button', { name: 'Translate' }).last().click();
  await expect(page.getByLabel('English translation')).toBeVisible();
  await expect(page.getByLabel('English translation')).toContainText(/\S/);
});
