import { getLevelRules, type CefrLevel } from '@arabic/shared';

import type { EvalRun } from './run.ts';
import {
  aggregateCorrections,
  aggregateReplies,
  correctionsByLevel,
  repliesByLevel,
  scoreCorrection,
  scoreReply,
  summarizeCalls,
  type CorrectionScore,
  type ReplyScore,
} from './score.ts';

// Turns a finished run into the markdown report. Pure: the file write lives in cli.ts.

const pct = (x: number | null) => (x === null ? 'n/a' : `${(x * 100).toFixed(0)}%`);
const num = (x: number | null, digits = 1) => (x === null ? 'n/a' : x.toFixed(digits));
const ms = (x: number | null) => (x === null ? 'n/a' : `${Math.round(x)} ms`);

/** Table cells: no pipes, no line breaks. */
const cell = (s: string) =>
  s
    .replace(/\|/g, '\\|')
    .replace(/\s*\n\s*/g, ' ')
    .trim() || ' ';

export function reportFileName(run: EvalRun, date: string): string {
  const c = run.only === 'replies' ? 'none' : run.correctionModel;
  const r = run.only === 'corrections' ? 'none' : run.replyModel;
  const suffix = run.set === 'held-out' ? '-held-out' : '';
  return `${date}-${run.provider}-${c}__${r}${suffix}.md`;
}

export interface ScoredRun {
  corrections: { outcome: EvalRun['corrections'][number]; score: CorrectionScore }[];
  replies: { outcome: EvalRun['replies'][number]; score: ReplyScore }[];
  correctionErrors: number;
  replyErrors: number;
}

export function scoreRun(run: EvalRun): ScoredRun {
  const corrections = run.corrections.flatMap((outcome) =>
    outcome.result ? [{ outcome, score: scoreCorrection(outcome.case, outcome.result) }] : [],
  );
  const replies = run.replies.flatMap((outcome) =>
    outcome.reply !== undefined
      ? [{ outcome, score: scoreReply(outcome.case, outcome.reply, outcome.lessonVocab) }]
      : [],
  );
  return {
    corrections,
    replies,
    correctionErrors: run.corrections.length - corrections.length,
    replyErrors: run.replies.length - replies.length,
  };
}

export function renderReport(run: EvalRun, date: string): string {
  const scored = scoreRun(run);
  const cScores = scored.corrections.map((c) => c.score);
  const rScores = scored.replies.map((r) => r.score);
  const out: string[] = [];

  out.push(`# Eval report ${date}: ${run.provider}`, '');
  if (run.provider === 'fake') {
    out.push(
      '> Run on the FAKE provider: these numbers test the scorer and the report, not a model.',
      '',
    );
  }
  out.push(
    '## Run settings',
    '',
    `- Provider: ${run.provider}`,
    `- Correction model: ${run.only === 'replies' ? 'not run' : run.correctionModel}`,
    `- Reply model: ${run.only === 'corrections' ? 'not run' : run.replyModel}`,
    `- Case set: ${run.set === 'held-out' ? 'held-out (never used to tune the prompts)' : 'main (the prompts were tuned on it, so these numbers are optimistic)'}`,
    `- Parts: ${run.only ?? 'corrections and replies'}`,
    `- Limit: ${run.limit === undefined ? 'none (all cases)' : `${run.limit} per part, evenly spread`}`,
    `- Pacing: at least ${run.pacing.minGapMs} ms between calls to a model, ${run.pacing.retryWaitMs / 1000} s wait and up to ${run.pacing.maxRetries} retries on 429 or 5xx busy errors`,
    `- Started: ${run.startedAt}`,
    `- Cases run: ${run.corrections.length} corrections (${scored.correctionErrors} errors), ${run.replies.length} replies (${scored.replyErrors} errors)`,
    "- The prompts are the app's own (`prompts/correction.ts`, `prompts/reply.ts`) with the seed lesson as context.",
    '',
  );

  if (run.corrections.length > 0) {
    const a = aggregateCorrections(cScores);
    out.push(
      '## Corrections: summary',
      '',
      '| Metric | Value | Better |',
      '|---|---|---|',
      `| Cases scored | ${a.n} | |`,
      `| Verdict accuracy (isCorrect) | ${pct(a.accuracy)} | higher |`,
      `| False-alarm rate (correct sentences flagged) | ${pct(a.falseAlarmRate)} | lower |`,
      `| Detection rate (wrong sentences flagged) | ${pct(a.detectionRate)} | higher |`,
      `| Type recall (an accepted type was named) | ${pct(a.typeRecall)} | higher |`,
      `| Type precision (predicted types that are accepted) | ${pct(a.typePrecision)} | higher |`,
      `| mustContain hit rate | ${pct(a.mustContainRate)} | higher |`,
      `| Cases where everything held | ${pct(a.passRate)} | higher |`,
      '',
      '### By level',
      '',
      '| Level | Cases | Accuracy | False alarms | Detection | Type recall | Type precision | mustContain |',
      '|---|---|---|---|---|---|---|---|',
      ...correctionsByLevel(cScores).map(
        ({ level, aggregate: l }) =>
          `| ${level} | ${l.n} | ${pct(l.accuracy)} | ${pct(l.falseAlarmRate)} | ${pct(l.detectionRate)} | ${pct(l.typeRecall)} | ${pct(l.typePrecision)} | ${pct(l.mustContainRate)} |`,
      ),
      '',
      callsLine(
        'Correction calls',
        run.corrections.flatMap((o) => (o.stats ? [o.stats] : [])),
      ),
      '',
    );

    const failed = scored.corrections.filter((c) => !c.score.passed);
    out.push(
      `### Failed cases (${failed.length} of ${scored.corrections.length})`,
      '',
      'A case fails when the verdict is wrong, no accepted mistake type was named, or a mustContain word is missing from the corrected sentence. Expected types are the accepted ones.',
      '',
    );
    if (failed.length === 0) {
      out.push('None.', '');
    } else {
      out.push(
        '| Id | Level | Text | Expected | Got isCorrect | Got types | Got corrected | Explanation | Why it failed |',
        '|---|---|---|---|---|---|---|---|---|',
        ...failed.map(({ outcome, score }) => {
          const e = outcome.case.expected;
          const r = outcome.result;
          const expected = e.isCorrect
            ? 'correct'
            : `wrong; types: ${e.types.join(', ') || 'any'}; must contain: ${e.mustContain.join(', ') || 'none'}`;
          const why = [
            !score.verdictRight && 'verdict',
            score.typeRecall === false && 'type',
            score.mustContainHits < score.mustContainTotal && 'mustContain',
          ].filter(Boolean);
          return `| ${[
            outcome.case.id,
            outcome.case.level,
            outcome.case.text,
            expected,
            String(r?.isCorrect),
            r?.mistakes.map((m) => m.type).join(', ') || 'none',
            r?.corrected ?? '',
            r?.mistakes
              .map((m) => `${m.original} → ${m.correction}: ${m.explanation}`)
              .join(' / ') ||
              r?.praise ||
              '',
            why.join(', '),
          ]
            .map(cell)
            .join(' | ')} |`;
        }),
        '',
      );
    }
  }

  if (scored.correctionErrors > 0) {
    out.push(
      '### Correction calls that errored',
      '',
      ...run.corrections.filter((o) => o.error).map((o) => `- ${o.case.id}: ${o.error}`),
      '',
    );
  }

  if (run.replies.length > 0) {
    const a = aggregateReplies(rScores);
    out.push(
      '## Replies: summary',
      '',
      '| Metric | Value |',
      '|---|---|',
      `| Replies scored | ${a.n} |`,
      `| Within level (all rules) | ${pct(a.withinLevelRate)} |`,
      `| Mean harakat ratio | ${num(a.meanHarakatRatio, 2)} |`,
      `| Replies with Latin letters | ${a.latinViolations} |`,
      `| Mean sentences | ${num(a.meanSentences)} |`,
      `| Mean words | ${num(a.meanWords)} |`,
      `| Mean longest sentence (words) | ${num(a.meanLongestSentence)} |`,
      `| Mean lesson words used | ${num(a.meanVocabHits)} |`,
      `| Violations | ${
        Object.entries(a.violations)
          .map(([k, v]) => `${k} ${v}`)
          .join(', ') || 'none'
      } |`,
      '',
      '### By level',
      '',
      '| Level | Replies | Within level | Harakat ratio | Latin | Sentences | Words | Longest sentence | Lesson words | Limit (sentences x words) |',
      '|---|---|---|---|---|---|---|---|---|---|',
      ...repliesByLevel(rScores).map(({ level, aggregate: l }) => {
        const lim = limitsFor(level);
        return `| ${level} | ${l.n} | ${pct(l.withinLevelRate)} | ${num(l.meanHarakatRatio, 2)} | ${l.latinViolations} | ${num(l.meanSentences)} | ${num(l.meanWords)} | ${num(l.meanLongestSentence)} | ${num(l.meanVocabHits)} | ${lim} |`;
      }),
      '',
      callsLine(
        'Reply calls',
        run.replies.flatMap((o) => (o.stats ? [o.stats] : [])),
      ),
      '',
      '### Replies outside the level rules',
      '',
    );
    const bad = scored.replies.filter((r) => !r.score.metrics.withinLevel);
    if (bad.length === 0) out.push('None.', '');
    else {
      out.push(
        '| Id | Level | Violations | Harakat ratio | Sentences | Longest | Reply |',
        '|---|---|---|---|---|---|---|',
        ...bad.map(
          ({ score: s }) =>
            `| ${[s.id, s.level, s.metrics.violations.join(', '), num(s.metrics.harakatRatio, 2), String(s.metrics.sentenceCount), String(s.metrics.longestSentence), s.reply].map(cell).join(' | ')} |`,
        ),
        '',
      );
    }

    out.push('### Reply samples (up to 3 per level)', '');
    for (const { level } of repliesByLevel(rScores)) {
      out.push(`**${level}**`, '');
      for (const r of scored.replies.filter((x) => x.score.level === level).slice(0, 3)) {
        out.push(
          `- ${r.outcome.case.id} (learner: ${r.outcome.case.learnerText}) → ${cell(r.score.reply)}`,
        );
      }
      out.push('');
    }
  }

  if (scored.replyErrors > 0) {
    out.push(
      '### Reply calls that errored',
      '',
      ...run.replies.filter((o) => o.error).map((o) => `- ${o.case.id}: ${o.error}`),
      '',
    );
  }

  return `${out.join('\n').trimEnd()}\n`;
}

function callsLine(label: string, calls: Parameters<typeof summarizeCalls>[0]): string {
  const s = summarizeCalls(calls);
  return `${label}: ${s.calls} calls, latency p50 ${ms(s.p50Ms)}, p90 ${ms(s.p90Ms)}; tokens per call in ${num(s.meanInputTokens, 0)} / out ${num(s.meanOutputTokens, 0)} (totals ${s.totalInputTokens} in, ${s.totalOutputTokens} out).`;
}

function limitsFor(level: CefrLevel): string {
  const r = getLevelRules(level);
  return `${r.maxSentencesPerReply} x ${r.maxWordsPerSentence}`;
}
