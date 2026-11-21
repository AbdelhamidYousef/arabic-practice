import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

import {
  buildCorrectionPrompt,
  correctionSchema,
  type CorrectionResult,
} from '../ai/prompts/correction.ts';
import type { LessonContext } from '../ai/prompts/lesson-context.ts';
import { buildReplyPrompt } from '../ai/prompts/reply.ts';
import { LlmFailed, LlmRateLimited, type LlmProvider } from '../ai/provider.ts';
import { seedLessons, type SeedLesson } from '../db/seed/lessons.ts';

import type { CallStats, CorrectionCase, ReplyCase } from './score.ts';

// The runner talks to the provider directly (no gateway, no database), through the SAME prompt
// builders and model names the app uses, so the numbers describe the real app path. Because it
// bypasses the gateway's caps it paces itself against the free tier's per-model limits.

const caseFileSchema = z.object({
  about: z.string(),
  corrections: z.array(
    z.object({
      id: z.string(),
      level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
      lessonSlug: z.string(),
      text: z.string(),
      expected: z.object({
        isCorrect: z.boolean(),
        types: z.array(z.string()),
        mustContain: z.array(z.string()),
      }),
    }),
  ),
  replies: z.array(
    z.object({
      id: z.string(),
      level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
      lessonSlug: z.string(),
      learnerText: z.string(),
    }),
  ),
});

export interface CaseSet {
  about: string;
  corrections: CorrectionCase[];
  replies: ReplyCase[];
}

export function loadCases(
  path = fileURLToPath(new URL('../../evals/cases.json', import.meta.url)),
): CaseSet {
  return caseFileSchema.parse(JSON.parse(readFileSync(path, 'utf8')));
}

export function toLessonContext(l: SeedLesson): LessonContext {
  return {
    title: l.title,
    level: l.level,
    topic: l.topic,
    scenario: l.scenario,
    grammarFocus: l.grammarFocus,
    goals: l.goals,
    vocab: l.vocab.map(({ arabic, english }) => ({ arabic, english })),
  };
}

export interface Pacing {
  /** Minimum time between two calls to the same model. */
  minGapMs: number;
  /** Wait after a 429 before trying again. */
  retryWaitMs: number;
  /** How many times a 429 is retried before the case is recorded as an error. */
  maxRetries: number;
}

export const FREE_TIER_PACING: Pacing = { minGapMs: 4500, retryWaitMs: 30_000, maxRetries: 3 };
export const NO_PACING: Pacing = { minGapMs: 0, retryWaitMs: 0, maxRetries: 3 };

export interface RunOptions {
  provider: LlmProvider;
  correctionModel: string;
  replyModel: string;
  only?: 'corrections' | 'replies';
  limit?: number;
  pacing?: Pacing;
  cases?: CaseSet;
  lessons?: SeedLesson[];
  /** Injected so tests need no real waiting. */
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  onProgress?: (line: string) => void;
}

export interface CorrectionOutcome {
  case: CorrectionCase;
  result?: CorrectionResult;
  error?: string;
  stats?: CallStats;
}

export interface ReplyOutcome {
  case: ReplyCase;
  reply?: string;
  error?: string;
  stats?: CallStats;
  lessonVocab: string[];
}

export interface EvalRun {
  provider: string;
  correctionModel: string;
  replyModel: string;
  only?: 'corrections' | 'replies';
  limit?: number;
  pacing: Pacing;
  startedAt: string;
  corrections: CorrectionOutcome[];
  replies: ReplyOutcome[];
}

/** Evenly spaced pick, so a small --limit still mixes levels and correct and wrong sentences. */
export function takeSpread<T>(items: T[], limit: number | undefined): T[] {
  if (limit === undefined || limit >= items.length) return items;
  if (limit <= 0) return [];
  return Array.from(
    { length: limit },
    (_, i) => items[Math.floor((i * items.length) / limit)] as T,
  );
}

export async function runEval(options: RunOptions): Promise<EvalRun> {
  const { provider, correctionModel, replyModel, only, limit } = options;
  const pacing = options.pacing ?? NO_PACING;
  const cases = options.cases ?? loadCases();
  const lessons = new Map((options.lessons ?? seedLessons).map((l) => [l.slug, l]));
  const sleep = options.sleep ?? ((ms: number) => new Promise<void>((r) => setTimeout(r, ms)));
  const now = options.now ?? Date.now;
  const log = options.onProgress ?? (() => undefined);

  const lastCall = new Map<string, number>();
  async function paced<T>(model: string, call: () => Promise<T>): Promise<T> {
    for (let attempt = 0; ; attempt += 1) {
      const last = lastCall.get(model);
      if (last !== undefined) {
        const wait = last + pacing.minGapMs - now();
        if (wait > 0) await sleep(wait);
      }
      lastCall.set(model, now());
      try {
        return await call();
      } catch (e) {
        if (isRetryable(e) && attempt < pacing.maxRetries) {
          log(
            `  retryable error on ${model}, waiting ${pacing.retryWaitMs / 1000}s (retry ${attempt + 1})`,
          );
          await sleep(pacing.retryWaitMs);
          continue;
        }
        throw e;
      }
    }
  }

  const lessonOf = (slug: string): SeedLesson => {
    const l = lessons.get(slug);
    if (!l) throw new Error(`eval case refers to unknown lesson "${slug}"`);
    return l;
  };

  const corrections: CorrectionOutcome[] = [];
  if (only !== 'replies') {
    const picked = takeSpread(cases.corrections, limit);
    for (const [i, c] of picked.entries()) {
      const lesson = lessonOf(c.lessonSlug);
      const prompt = buildCorrectionPrompt({
        level: c.level,
        lesson: toLessonContext(lesson),
        // No partnerMessage: the cases are standalone sentences. A first run that passed the lesson's
        // opening line made the model grade the sentence as an answer to it ("you were asked when you wake up").
        learnerText: c.text,
      });
      try {
        const { data, usage } = await paced(correctionModel, () =>
          provider.generateJson({
            purpose: 'eval',
            model: correctionModel,
            ...prompt,
            schema: correctionSchema,
          }),
        );
        corrections.push({ case: c, result: data, stats: stats(usage) });
        log(`corrections ${i + 1}/${picked.length} ${c.id} ok`);
      } catch (e) {
        corrections.push({ case: c, error: message(e) });
        log(`corrections ${i + 1}/${picked.length} ${c.id} ERROR ${message(e)}`);
      }
    }
  }

  const replies: ReplyOutcome[] = [];
  if (only !== 'corrections') {
    const picked = takeSpread(cases.replies, limit);
    for (const [i, c] of picked.entries()) {
      const lesson = lessonOf(c.lessonSlug);
      const lessonVocab = lesson.vocab.map((v) => v.arabic);
      const prompt = buildReplyPrompt({
        lesson: toLessonContext(lesson),
        level: c.level,
        history: [
          { role: 'model', text: lesson.openingLine },
          { role: 'user', text: c.learnerText },
        ],
      });
      try {
        const out = await paced(replyModel, async () => {
          let text = '';
          let usage: CallStats | undefined;
          for await (const ev of provider.streamText({
            purpose: 'eval',
            model: replyModel,
            ...prompt,
          })) {
            if (ev.type === 'delta') text += ev.text;
            else usage = stats(ev.usage);
          }
          return { text, usage };
        });
        replies.push({
          case: c,
          reply: out.text,
          lessonVocab,
          ...(out.usage && { stats: out.usage }),
        });
        log(`replies ${i + 1}/${picked.length} ${c.id} ok`);
      } catch (e) {
        replies.push({ case: c, error: message(e), lessonVocab });
        log(`replies ${i + 1}/${picked.length} ${c.id} ERROR ${message(e)}`);
      }
    }
  }

  return {
    provider: provider.name,
    correctionModel,
    replyModel,
    ...(only && { only }),
    ...(limit !== undefined && { limit }),
    pacing,
    startedAt: new Date(now()).toISOString(),
    corrections,
    replies,
  };
}

// 429 (quota) and 503/500 (the model is busy: "high demand", seen on the first real run) are transient.
function isRetryable(e: unknown): boolean {
  return (
    e instanceof LlmRateLimited ||
    (e instanceof LlmFailed && ['HTTP_503', 'HTTP_500', 'HTTP_502', 'HTTP_504'].includes(e.code))
  );
}

const stats = (u: { latencyMs: number; inputTokens: number; outputTokens: number }): CallStats => ({
  latencyMs: u.latencyMs,
  inputTokens: u.inputTokens,
  outputTokens: u.outputTokens,
});

const message = (e: unknown) => (e instanceof Error ? `${e.name}: ${e.message}` : String(e));
