import { expect, type Page } from '@playwright/test';

// Shared by the e2e specs. Every test starts its own guest, so tests never depend on each other or
// on leftovers from an earlier run. The fake AI provider answers (see playwright.config.ts):
//  - WRONG_SENTENCE is marked wrong: a demonstrative + noun without ال before a definite adjective.
//  - RIGHT_SENTENCE is marked correct.
export const WRONG_SENTENCE = 'هذا كتاب الجديد';
export const CORRECTED_SENTENCE = 'هذا الكتاب الجديد';
export const RIGHT_SENTENCE = 'مرحبا';

export async function startAsGuest(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it as a learner' }).click();
  await expect(page).toHaveURL(/\/lessons$/);
  await expect(page.getByRole('heading', { name: 'Lessons', level: 1 })).toBeVisible();
}

export async function startAsDemoTeacher(page: Page): Promise<void> {
  await page.goto('/');
  await page.getByRole('button', { name: 'See the teacher view' }).click();
  await expect(page).toHaveURL(/\/teacher$/);
}

/** From the lessons list to a fresh conversation on the greetings lesson. */
export async function startGreetingsPractice(page: Page): Promise<void> {
  await page.getByRole('link', { name: /Greetings and introductions/ }).click();
  await expect(page).toHaveURL(/\/lessons\/greetings$/);
  await page.getByRole('button', { name: 'Start practice' }).click();
  await expect(page).toHaveURL(/\/practice\/[0-9a-f-]+$/);
  await expect(composer(page)).toBeVisible();
}

export const composer = (page: Page) => page.getByLabel('Your message in Arabic');

/** Messages in the conversation list: the opening line, then a learner and a partner message per turn. */
export const bubbles = (page: Page) =>
  page.getByRole('list', { name: 'Conversation' }).locator('> li');

/** The green card under a learner message the fake graded as right. */
export const correctCard = (page: Page) => page.getByText(/^✓\s*Correct$/);

/** Types a message, sends it with the button and waits until the partner's reply is saved. */
export async function sendTurn(page: Page, text: string, turnsSoFar: number): Promise<void> {
  await composer(page).fill(text);
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(bubbles(page)).toHaveCount(1 + 2 * (turnsSoFar + 1));
  // The Send button comes back once the whole turn (reply and correction) is over.
  await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
}

// API calls made from inside the page (`fetch`): same origin as the app, so the browser's own
// cookies and Origin header apply exactly as they do for the UI.
export async function api<T = unknown>(
  page: Page,
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
): Promise<{ status: number; body: T }> {
  return page.evaluate(
    async ({ method, path, body }) => {
      const res = await fetch(`/api/v1${path}`, {
        method,
        credentials: 'include',
        headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      return { status: res.status, body: (await res.json().catch(() => null)) as never };
    },
    { method, path, body },
  );
}
