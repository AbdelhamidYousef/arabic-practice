import { describe, expect, it } from 'vitest';

import { audioKey, audioText } from './audio.ts';

describe('audioKey', () => {
  it('is stable, 14 hex characters, and ignores outer and repeated whitespace', () => {
    const k = audioKey('مَرْحَبًا');
    expect(k).toMatch(/^[0-9a-f]{14}$/);
    expect(audioKey('  مَرْحَبًا ')).toBe(k);
    expect(audioKey('مَعَ  السَّلَامَةِ')).toBe(audioKey('مَعَ السَّلَامَةِ'));
  });

  it('pinned value, so a change to the hash (which would orphan every clip) fails loudly', () => {
    expect(audioKey('مَرْحَبًا')).toMatchInlineSnapshot(`"072b3763ef98f8"`);
  });

  it('gives different harakat a different clip', () => {
    expect(audioKey('كَتَبَ')).not.toBe(audioKey('كُتُب'));
    expect(audioKey('كَتَبَ')).not.toBe(audioKey('كتب'));
  });

  it('treats composed and decomposed Unicode as the same text', () => {
    const composed = 'آ'; // U+0622
    const decomposed = 'آ'; // alif + madda above
    expect(audioText(decomposed)).toBe(audioText(composed));
    expect(audioKey(decomposed)).toBe(audioKey(composed));
  });
});
