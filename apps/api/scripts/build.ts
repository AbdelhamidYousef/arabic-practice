import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';

// Production build: bundles the long-running server into `dist/index.js` and the Vercel function
// entry into `dist/vercel.js` (the same build as Pawsome).
//
// Why bundle: `@arabic/shared` is a workspace package consumed as TypeScript source, which plain
// `node` cannot import. esbuild inlines it (and our own `.ts` files) into the output. Every other
// dependency stays external (node_modules exists on the host after `pnpm install`): argon2 ships a
// native binary and cannot be bundled, and external packages keep stack traces simple.
const root = fileURLToPath(new URL('..', import.meta.url));
const shared = fileURLToPath(new URL('../../../packages/shared/src/index.ts', import.meta.url));

await rm(`${root}dist`, { recursive: true, force: true });

await build({
  absWorkingDir: root,
  entryPoints: { index: 'src/index.ts', vercel: 'src/vercel.ts' },
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  sourcemap: true,
  packages: 'external',
  alias: { '@arabic/shared': shared },
  logLevel: 'info',
});
