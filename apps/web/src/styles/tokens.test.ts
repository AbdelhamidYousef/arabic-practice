// @vitest-environment node
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

// Read from disk, not `?raw`: Vitest runs CSS imports through its CSS pipeline and returns ''.
const tokensCss = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

// WCAG 2.x relative luminance and contrast ratio, straight from the spec.
function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}

// Reads the colours that really ship out of tokens.css, so the test cannot drift from a copy.
const colors: Record<string, string> = {};
for (const m of tokensCss.matchAll(/(--color-[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) {
  colors[m[1]!] = m[2]!;
}
const AA_TEXT = 4.5;

describe('design tokens meet WCAG AA for text', () => {
  it('finds every token it relies on', () => {
    expect(Object.keys(colors).length).toBeGreaterThanOrEqual(14);
  });

  // [foreground, background] pairs the UI really uses for text.
  const pairs: [string, string][] = [
    ['--color-ink', '--color-bg'],
    ['--color-ink', '--color-surface'],
    ['--color-ink', '--color-primary-soft'],
    ['--color-ink', '--color-accent-soft'],
    ['--color-ink', '--color-accent'], // amber fill with ink text
    ['--color-muted', '--color-bg'],
    ['--color-muted', '--color-surface'],
    ['--color-surface', '--color-primary'], // button label
    ['--color-surface', '--color-primary-hover'],
    ['--color-primary', '--color-bg'], // links and active nav
    ['--color-primary', '--color-surface'],
    ['--color-primary', '--color-primary-soft'],
    ['--color-accent-strong', '--color-accent-soft'], // correction text
    ['--color-accent-strong', '--color-surface'],
    ['--color-accent-strong', '--color-bg'],
    ['--color-success', '--color-success-soft'],
    ['--color-success', '--color-surface'],
    ['--color-danger', '--color-danger-soft'],
    ['--color-danger', '--color-surface'],
    ['--color-danger', '--color-bg'],
    ['--color-surface', '--color-ink'], // skip link
  ];

  it.each(pairs)('%s on %s', (fg, bg) => {
    expect(colors[fg], fg).toBeDefined();
    expect(colors[bg], bg).toBeDefined();
    expect(contrast(colors[fg]!, colors[bg]!)).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it('keeps every font weight at 600 or lighter', () => {
    const weights = [...tokensCss.matchAll(/--weight-[\w-]+\s*:\s*(\d+)/g)].map((m) =>
      Number(m[1]),
    );
    expect(weights.length).toBeGreaterThan(0);
    for (const w of weights) expect(w).toBeLessThanOrEqual(600);
  });

  it('sets Arabic larger than UI text with a tall line', () => {
    expect(Number(/--arabic-scale:\s*([\d.]+)/.exec(tokensCss)?.[1])).toBeGreaterThanOrEqual(1.3);
    expect(Number(/--arabic-line:\s*([\d.]+)/.exec(tokensCss)?.[1])).toBeGreaterThanOrEqual(1.9);
  });
});
