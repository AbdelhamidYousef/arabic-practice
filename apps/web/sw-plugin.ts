import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import type { Plugin } from 'vite';

// Writes /sw.js at build time from sw/sw.js, filling in the build's version and the files the app
// needs to start (index.html and every emitted JS/CSS/font file, plus the manifest and icons).
// The version is a hash of the worker's code and those file names: Vite puts a content hash in each asset name, so any
// code change gives a new version, the browser installs the new worker, and the old cache goes.

const template = fileURLToPath(new URL('./sw/sw.js', import.meta.url));

/** Files in `public/` the shell needs offline (audio is cached as it plays, not up front). */
const PUBLIC_SHELL: string[] = []; // the manifest and icons join in step 25.1

// Font subsets for scripts the app never shows. The browser fetches one only if a page needs it.
const UNUSED_FONT_SUBSETS = /-(cyrillic|cyrillic-ext|greek|greek-ext|vietnamese|math|symbols)-wght/;

export function renderServiceWorker(source: string, files: string[]): string {
  const shell = ['/index.html', ...PUBLIC_SHELL, ...files.map((f) => `/${f}`)].sort();
  // The worker's own code counts too, so a change to sw.js alone also gets a fresh cache.
  const version = createHash('sha256')
    .update(source)
    .update(shell.join('\n'))
    .digest('hex')
    .slice(0, 12);
  return source
    .replace("'__SW_VERSION__'", JSON.stringify(version))
    .replace('__SW_SHELL_FILES__', JSON.stringify(shell));
}

export function serviceWorker(extraShell: string[] = []): Plugin {
  return {
    name: 'arabic-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const files = Object.keys(bundle).filter(
        (f) => /\.(js|css|woff2?)$/.test(f) && !UNUSED_FONT_SUBSETS.test(f),
      );
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: renderServiceWorker(readFileSync(template, 'utf8'), [...files, ...extraShell]),
      });
    },
  };
}
