import { expect, test, type Page } from '@playwright/test';

import {
  RIGHT_SENTENCE,
  api,
  sendTurn,
  startAsDemoTeacher,
  startAsGuest,
  startGreetingsPractice,
} from './helpers';

// No page may scroll sideways, and no element may stick out past the right edge unless it sits in
// a scroll container of its own (a wide table scrolls inside its wrapper). Every route a guest or
// the demo teacher can reach, at a phone width and a desktop width.

const WIDTHS = [390, 1280];

async function overflowProblems(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const problems: string[] = [];
    const width = window.innerWidth;
    const root = document.documentElement;
    if (root.scrollWidth > width) problems.push(`page scrollWidth ${root.scrollWidth} > ${width}`);

    const name = (el: Element) =>
      `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${
        typeof el.className === 'string' && el.className
          ? `.${el.className.trim().split(/\s+/).slice(0, 3).join('.')}`
          : ''
      } "${(el.textContent ?? '').trim().slice(0, 30)}"`;
    const inOwnScroller = (el: Element) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const { overflowX } = getComputedStyle(p);
        if (['auto', 'scroll', 'hidden', 'clip'].includes(overflowX)) {
          if (p.getBoundingClientRect().right <= width + 1) return true;
        }
      }
      return false;
    };
    for (const el of document.body.querySelectorAll('*')) {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      const box = el.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) continue;
      // Visually hidden helpers (sr-only) are 1px boxes.
      if (box.width <= 1 && box.height <= 1) continue;
      if (box.right > width + 1 && !inOwnScroller(el)) {
        problems.push(`${name(el)} right edge ${Math.round(box.right)} > ${width}`);
      }
    }
    return problems.slice(0, 8);
  });
}

async function check(page: Page, path: string, width: number): Promise<void> {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('main h1, h1').first(), `${path} has loaded`).toBeVisible();
  expect(await overflowProblems(page), `${path} at ${width}px`).toEqual([]);
}

for (const width of WIDTHS) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test('signed-out routes fit', async ({ page }) => {
      for (const path of ['/', '/login', '/register', '/register?code=ABCD-EFGH-1234', '/nope']) {
        await check(page, path, width);
      }
    });

    test('guest routes fit', async ({ page }) => {
      await startAsGuest(page);
      await startGreetingsPractice(page);
      // A conversation with a turn in it: the longest the page gets in a short session.
      await sendTurn(page, RIGHT_SENTENCE, 0);
      const conversationPath = new URL(page.url()).pathname;
      for (const path of [
        '/lessons',
        '/lessons/greetings',
        conversationPath,
        '/progress',
        '/review',
      ]) {
        await check(page, path, width);
      }
    });

    test('demo teacher routes fit', async ({ page }) => {
      await startAsDemoTeacher(page);
      const learners = await api<{ learners: { id: string }[] }>(page, 'GET', '/teacher/learners');
      const lessons = await api<{ lessons: { id: string }[] }>(page, 'GET', '/teacher/lessons');
      const learnerId = learners.body.learners[0]?.id ?? '';
      const detail = await api<{ conversations: { id: string }[] }>(
        page,
        'GET',
        `/teacher/learners/${learnerId}`,
      );
      expect(learnerId).not.toBe('');
      const conversationId = detail.body.conversations[0]?.id ?? '';
      expect(conversationId).not.toBe('');

      for (const path of [
        '/teacher',
        '/teacher/lessons',
        `/teacher/lessons/${lessons.body.lessons[0]?.id ?? ''}`,
        '/teacher/lessons/new',
        `/teacher/learners/${learnerId}`,
        `/teacher/conversations/${conversationId}`,
        '/teacher/invites',
        '/teacher/usage',
      ]) {
        await check(page, path, width);
      }
    });
  });
}
