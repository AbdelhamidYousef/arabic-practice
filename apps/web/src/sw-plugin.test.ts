// @vitest-environment node
// Build-time code reading files from disk: Node, not jsdom (whose import.meta.url is not a file URL).
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { renderServiceWorker } from '../sw-plugin';

const source = readFileSync(fileURLToPath(new URL('../sw/sw.js', import.meta.url)), 'utf8');

describe('service worker build', () => {
  it('fills in the shell files and a version that follows them', () => {
    const a = renderServiceWorker(source, ['assets/index-abc.js', 'assets/index-abc.css']);
    const b = renderServiceWorker(source, ['assets/index-def.js', 'assets/index-abc.css']);
    expect(a).not.toContain('__SW_');
    expect(a).toContain('"/index.html"');
    expect(a).toContain('"/assets/index-abc.js"');
    const version = (s: string) => /const VERSION = "([0-9a-f]{12})"/.exec(s)?.[1];
    expect(version(a)).toBeDefined();
    expect(version(a)).not.toBe(version(b));
    const edited = renderServiceWorker(`${source}\n// edit`, [
      'assets/index-abc.js',
      'assets/index-abc.css',
    ]);
    expect(version(edited)).not.toBe(version(a));
  });

  it('never caches the API calls that write or talk to the AI', () => {
    // The data cache list is an allow-list of reads; practice, progress and teacher calls are not in it.
    const list = /const DATA_PATHS = \[(.*)\];/.exec(source)?.[1] ?? '';
    expect(list).not.toMatch(/practice|progress|teacher|conversations/);
  });
});
