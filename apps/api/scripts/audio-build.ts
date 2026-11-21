import { spawn, spawnSync } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { audioKey, audioText, type AudioManifest } from '@arabic/shared';

import { contentLessons } from '../src/content/index.ts';

// `pnpm audio:build [--dry]`: makes sure every Arabic line the app can play has a clip.
//
// 1. Collects the lines: vocab, grammar examples, listen exercises, choose prompts, and the
//    homepage words below.
// 2. Names each clip by `audioKey(text)` (packages/shared/src/audio.ts), so a run only generates
//    lines that are new or whose harakat changed, and the browser finds a clip without a lookup.
// 3. A file in `audio/overrides/<key>.mp3` (his own recording) always wins over Piper.
// 4. Piper (run locally from work/piper, never on Vercel) makes WAVs; ffmpeg encodes 32 kbps mono MP3.
// 5. Deletes clips no line uses any more, and writes `manifest.json` (the keys that have a clip).
//
// Output: apps/web/public/audio/, committed, served from Vercel's CDN with a one-year cache.

// Arabic on the homepage (apps/web/src/features/landing/content.ts). A web test fails when a
// homepage word has no clip, so this list can't silently fall behind.
const HOMEPAGE_LINES = ['مَرْحَبًا', 'نَعَمْ', 'شُكْرًا', 'مِنْ فَضْلِكَ'];

const repo = fileURLToPath(new URL('../../../', import.meta.url));
const outDir = join(repo, 'apps/web/public/audio');
const overridesDir = join(repo, 'audio/overrides');
const python = process.env.PIPER_PYTHON ?? join(repo, 'work/piper/venv/bin/python');
const model = process.env.PIPER_MODEL ?? join(repo, 'work/piper/voices/ar_JO-kareem-medium.onnx');
const helper = fileURLToPath(new URL('./piper_batch.py', import.meta.url));

const { values } = parseArgs({ options: { dry: { type: 'boolean' } } });

export function collectLines(): string[] {
  const lines: string[] = [...HOMEPAGE_LINES];
  for (const l of contentLessons) {
    for (const v of l.vocab) lines.push(v.arabic);
    for (const b of l.grammarNote) if (b.type === 'example') lines.push(b.arabic);
    for (const e of l.exercises) {
      if (e.type === 'listen') lines.push(e.audio);
      if (e.type === 'choose' && e.promptArabic) lines.push(e.promptArabic);
    }
  }
  return [...new Set(lines.map(audioText))];
}

const lines = collectLines();
const byKey = new Map<string, string>();
for (const text of lines) {
  const key = audioKey(text);
  const other = byKey.get(key);
  if (other !== undefined && other !== text) {
    throw new Error(`audio key collision: "${other}" and "${text}" both hash to ${key}`);
  }
  byKey.set(key, text);
}

mkdirSync(outDir, { recursive: true });
const present = new Set(
  readdirSync(outDir)
    .filter((f) => f.endsWith('.mp3'))
    .map((f) => f.slice(0, -4)),
);
const overrides = existsSync(overridesDir)
  ? new Set(
      readdirSync(overridesDir)
        .filter((f) => f.endsWith('.mp3'))
        .map((f) => f.slice(0, -4)),
    )
  : new Set<string>();

const toGenerate = [...byKey.keys()].filter((k) => !overrides.has(k) && !present.has(k));
const orphans = [...present].filter((k) => !byKey.has(k));
const unusedOverrides = [...overrides].filter((k) => !byKey.has(k));

console.info(
  `${byKey.size} lines · ${present.size} clips present · ${overrides.size} overrides · ` +
    `${toGenerate.length} to generate · ${orphans.length} to delete`,
);
for (const k of unusedOverrides) console.warn(`override ${k}.mp3 matches no line (text changed?)`);
if (values.dry) process.exit(0);

if (toGenerate.length > 0) {
  if (!existsSync(python) || !existsSync(model)) {
    throw new Error(`Piper not found: set PIPER_PYTHON and PIPER_MODEL (looked at ${python})`);
  }
  const tmp = mkdtempSync(join(tmpdir(), 'arabic-audio-'));
  try {
    await synthesize(
      toGenerate.map((k) => ({ text: byKey.get(k) as string, out: join(tmp, `${k}.wav`) })),
    );
    toGenerate.forEach((k, i) => {
      const r = spawnSync(
        'ffmpeg',
        [
          '-nostdin',
          '-loglevel',
          'error',
          '-y',
          '-i',
          join(tmp, `${k}.wav`),
          '-ac',
          '1',
          '-b:a',
          '32k',
          join(outDir, `${k}.mp3`),
        ],
        { stdio: 'inherit' },
      );
      if (r.status !== 0) throw new Error(`ffmpeg failed on ${k}`);
      if ((i + 1) % 100 === 0) console.info(`  encoded ${i + 1}/${toGenerate.length}`);
    });
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

for (const k of overrides)
  if (byKey.has(k)) copyFileSync(join(overridesDir, `${k}.mp3`), join(outDir, `${k}.mp3`));
for (const k of orphans) rmSync(join(outDir, `${k}.mp3`));

const manifest: AudioManifest = { version: 1, keys: [...byKey.keys()].sort() };
writeFileSync(join(outDir, 'manifest.json'), `${JSON.stringify(manifest)}\n`);
console.info(`done: ${manifest.keys.length} clips, manifest written`);

function synthesize(jobs: { text: string; out: string }[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(python, ['-W', 'ignore', helper, model], {
      stdio: ['pipe', 'pipe', 'inherit'],
    });
    let done = 0;
    child.stdout.on('data', (chunk: Buffer) => {
      done += chunk.toString().split('\n').filter(Boolean).length;
      if (done % 100 === 0) console.info(`  spoke ${done}/${jobs.length}`);
    });
    child.on('error', reject);
    child.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`piper exited with ${code}`)),
    );
    for (const j of jobs) child.stdin.write(`${JSON.stringify(j)}\n`);
    child.stdin.end();
  });
}
