import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

import { FakeProvider } from '../ai/fake.ts';
import { GeminiProvider } from '../ai/gemini.ts';
import type { LlmProvider } from '../ai/provider.ts';
import { env } from '../config/env.ts';

import { renderReport, reportFileName } from './report.ts';
import { FREE_TIER_PACING, NO_PACING, runEval } from './run.ts';

// `pnpm eval [--provider fake|gemini] [--correction-model x] [--reply-model y]
//            [--only corrections|replies] [--limit N]`
// Writes apps/api/evals/reports/<date>-<provider>-<correctionModel>__<replyModel>.md.
// The key is read from .env by config/env.ts and never printed.

const { values } = parseArgs({
  options: {
    provider: { type: 'string' },
    'correction-model': { type: 'string' },
    'reply-model': { type: 'string' },
    only: { type: 'string' },
    limit: { type: 'string' },
  },
  allowPositionals: false,
});

const providerName = values.provider ?? (env.GEMINI_API_KEY ? 'gemini' : 'fake');
if (providerName !== 'fake' && providerName !== 'gemini') {
  throw new Error(`--provider must be fake or gemini, got "${providerName}"`);
}
if (values.only !== undefined && values.only !== 'corrections' && values.only !== 'replies') {
  throw new Error('--only must be corrections or replies');
}
const limit = values.limit === undefined ? undefined : Number(values.limit);
if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
  throw new Error('--limit must be a positive whole number');
}

let provider: LlmProvider;
if (providerName === 'gemini') {
  if (!env.GEMINI_API_KEY) throw new Error('--provider gemini needs GEMINI_API_KEY in .env');
  provider = new GeminiProvider({ apiKey: env.GEMINI_API_KEY });
} else {
  provider = new FakeProvider();
}

const run = await runEval({
  provider,
  correctionModel: values['correction-model'] ?? env.AI_MODEL_CORRECTION,
  replyModel: values['reply-model'] ?? env.AI_MODEL_REPLY,
  ...(values.only && { only: values.only }),
  ...(limit !== undefined && { limit }),
  pacing: providerName === 'gemini' ? FREE_TIER_PACING : NO_PACING,
  onProgress: (line) => console.info(line),
});

const date = new Date().toISOString().slice(0, 10);
const dir = fileURLToPath(new URL('../../evals/reports/', import.meta.url));
mkdirSync(dir, { recursive: true });
const file = `${dir}${reportFileName(run, date)}`;
writeFileSync(file, renderReport(run, date));
console.info(`Report written: ${file}`);
