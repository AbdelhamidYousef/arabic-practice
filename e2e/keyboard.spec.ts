import { expect, test, type Page } from '@playwright/test';

import {
  RIGHT_SENTENCE,
  bubbles,
  correctCard,
  startAsGuest,
  startGreetingsPractice,
} from './helpers';

// Presses Tab until the focused element matches; fails with the path it took, so a broken tab
// order shows in the report instead of "timed out".
async function tabTo(page: Page, selector: string, text?: string, max = 40): Promise<void> {
  const path: string[] = [];
  for (let i = 0; i < max; i += 1) {
    await page.keyboard.press('Tab');
    const hit = await page.evaluate(
      ([sel, wanted]) => {
        const el = document.activeElement;
        return {
          matches: !!el?.matches(sel as string) && (!wanted || el.textContent?.trim() === wanted),
          label: el
            ? el.tagName +
              (el.getAttribute('aria-label') ? `[${el.getAttribute('aria-label')}]` : '')
            : '',
        };
      },
      [selector, text],
    );
    if (hit.matches) return;
    path.push(hit.label);
  }
  throw new Error(`Tab never reached ${selector}; visited ${path.join(' > ')}`);
}

test('practice works with the keyboard alone: type, Enter sends, Tab reaches Translate', async ({
  page,
}) => {
  await startAsGuest(page);
  await startGreetingsPractice(page);

  // From here on no clicks: Tab to the field, type, send with Enter.
  await tabTo(page, 'textarea');
  await page.keyboard.type(RIGHT_SENTENCE);
  await expect(page.getByLabel('Your message in Arabic')).toHaveValue(RIGHT_SENTENCE);
  await page.keyboard.press('Enter');
  await expect(bubbles(page)).toHaveCount(3);
  await expect(correctCard(page)).toBeVisible();
  // Focus came back to the field when the turn ended.
  await expect(page.getByLabel('Your message in Arabic')).toBeFocused();

  // Tab on to a Translate button, open it with Enter.
  await tabTo(page, 'button[aria-expanded]', 'Translate');
  await expect(
    page.getByRole('button', { name: 'Translate' }).and(page.locator(':focus')),
  ).toHaveCount(1);
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('English translation')).toBeVisible();
});
