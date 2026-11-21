import { hasLatin, normalizeArabic, stripHarakat } from '@arabic/shared';

import {
  LlmBadOutput,
  LlmFailed,
  LlmRateLimited,
  type JsonRequest,
  type LlmProvider,
  type StreamEvent,
  type TextRequest,
  type Usage,
} from './provider.ts';

// A deterministic stand-in for the model. Tests, the e2e run and a laptop without an API key use it,
// so the suite never touches a paid API and the same input always gives the same output.
// It is intentionally simple: it is a test double, not a Arabic teacher.

export interface Script {
  /** Matched (case-insensitively) against the system prompt, where the lesson scenario lives. */
  keyword: string;
  reply: string;
}

// Full harakat, short sentences, like a real A1 partner reply.
export const DEFAULT_REPLY = 'أَهْلًا! كَيْفَ حَالُكَ؟';

export const DEFAULT_SCRIPTS: Script[] = [
  { keyword: 'cafe', reply: 'أَهْلًا بِكَ فِي الْمَقْهَى! مَاذَا تُرِيدُ؟' },
  { keyword: 'shop', reply: 'مَرْحَبًا! هَلْ تُرِيدُ شَيْئًا؟' },
  { keyword: 'family', reply: 'عِنْدِي عَائِلَةٌ صَغِيرَةٌ. وَأَنْتَ؟' },
];

// Known patterns, matched on normalized text (no harakat) so a learner who writes marks or not is
// treated alike. Each is a real MSA rule, kept tiny on purpose.
const DEMONSTRATIVES = ['هذا', 'هذه', 'ذلك', 'تلك'];
const FEMININE_NOUNS = ['مدرسه', 'سياره', 'قهوه'];
const MASCULINE_NOUNS = ['كتاب', 'بيت', 'قلم'];
const MASCULINE_ADJ: Record<string, string> = { جديد: 'جديدة', كبير: 'كبيرة', جميل: 'جميلة' };
const FEMININE_ADJ: Record<string, string> = Object.fromEntries(
  Object.entries(MASCULINE_ADJ).map(([m, f]) => [normalizeArabic(f), m]),
);

export interface FakeMistake {
  type: 'grammar' | 'spelling';
  original: string;
  correction: string;
  explanation: string;
}

/** The rule-based corrector: exported so tests can pin its behaviour. */
export function fakeCorrect(text: string) {
  const mistakes: FakeMistake[] = [];
  let corrected = text;
  const words = text.split(/\s+/).filter(Boolean);
  const plain = words.map((w) => normalizeArabic(w));

  if (hasLatin(text)) {
    const latin = text.match(/[A-Za-z]+/)?.[0] ?? text;
    mistakes.push({
      type: 'spelling',
      original: latin,
      correction: '(write it in Arabic letters)',
      explanation: 'Use Arabic letters, not Latin letters.',
    });
  }

  for (let i = 0; i + 2 < words.length; i += 1) {
    const demonstrative = DEMONSTRATIVES.includes(plain[i] ?? '');
    const noun = plain[i + 1] ?? '';
    const next = plain[i + 2] ?? '';
    // "هذا كتاب الجديد": a demonstrative before a noun and a definite adjective needs ال on the noun.
    if (demonstrative && !noun.startsWith('ال') && next.startsWith('ال')) {
      const original = `${words[i + 1]}`;
      const fixed = `ال${stripHarakat(original)}`;
      mistakes.push({
        type: 'grammar',
        original,
        correction: fixed,
        explanation: 'After this/that, the noun takes ال when an adjective with ال follows.',
      });
      corrected = corrected.replace(original, fixed);
    }
  }

  for (let i = 0; i + 1 < words.length; i += 1) {
    const noun = plain[i] ?? '';
    const adj = plain[i + 1] ?? '';
    const original = words[i + 1] ?? '';
    const fem = FEMININE_ADJ[adj];
    const mascAdj = MASCULINE_ADJ[adj];
    if (FEMININE_NOUNS.includes(noun) && mascAdj) {
      mistakes.push({
        type: 'grammar',
        original,
        correction: mascAdj,
        explanation: 'The adjective must be feminine to agree with a feminine noun.',
      });
      corrected = corrected.replace(original, mascAdj);
    } else if (MASCULINE_NOUNS.includes(noun) && fem) {
      mistakes.push({
        type: 'grammar',
        original,
        correction: fem,
        explanation: 'The adjective must be masculine to agree with a masculine noun.',
      });
      corrected = corrected.replace(original, fem);
    }
  }

  const limited = mistakes.slice(0, 5);
  return limited.length === 0
    ? { isCorrect: true, corrected: text, mistakes: [], praise: 'جَيِّد! Well done.' }
    : { isCorrect: false, corrected, mistakes: limited };
}

export interface FakeOptions {
  scripts?: Script[];
  /** Characters per streamed chunk; small by default so streaming code sees several deltas. */
  chunkSize?: number;
}

const approxTokens = (text: string) => Math.max(1, Math.ceil(text.length / 4));

export class FakeProvider implements LlmProvider {
  readonly name = 'fake' as const;
  /** Every request received, newest last, so tests can assert on what the app sent. */
  readonly requests: (JsonRequest<unknown> | TextRequest)[] = [];

  private readonly scripts: Script[];
  private readonly chunkSize: number;
  private nextFault: 'rate-limit' | 'fail' | 'bad-output' | undefined;
  private delayMs = 0;

  constructor(options: FakeOptions = {}) {
    this.scripts = options.scripts ?? DEFAULT_SCRIPTS;
    this.chunkSize = options.chunkSize ?? 6;
  }

  // Fault injection: each applies to the NEXT call only, then clears itself.
  rateLimitNext(): void {
    this.nextFault = 'rate-limit';
  }
  failNext(): void {
    this.nextFault = 'fail';
  }
  badOutputNext(): void {
    this.nextFault = 'bad-output';
  }
  /** Every call waits this long first (0 turns it off); lets tests exercise timeouts and aborts. */
  delay(ms: number): void {
    this.delayMs = ms;
  }

  private async begin(request: JsonRequest<unknown> | TextRequest): Promise<number> {
    this.requests.push(request);
    const started = Date.now();
    if (this.delayMs > 0) await sleep(this.delayMs, request.signal);
    const fault = this.nextFault;
    this.nextFault = undefined;
    if (fault === 'rate-limit') throw new LlmRateLimited('fake: rate limited', 1000);
    if (fault === 'fail') throw new LlmFailed('FAKE_FAILURE', 'fake: injected failure');
    if (fault === 'bad-output') throw new LlmBadOutput('fake: injected bad output', '{nope');
    return started;
  }

  private usage(request: BaseRequestLike, input: string, output: string, started: number): Usage {
    return {
      inputTokens: approxTokens(input),
      outputTokens: approxTokens(output),
      model: request.model,
      latencyMs: Date.now() - started,
    };
  }

  async generateJson<T>(request: JsonRequest<T>): Promise<{ data: T; usage: Usage }> {
    const started = await this.begin(request);
    const lastUserText = [...request.messages].reverse().find((m) => m.role === 'user')?.text ?? '';
    // The correction prompt wraps the learner's text in labels (and the partner's line before it);
    // grade only what follows the last label, as the real model is told to.
    const marker = 'Learner message to grade:\n';
    const at = lastUserText.lastIndexOf(marker);
    const lastUser = at === -1 ? lastUserText : lastUserText.slice(at + marker.length);
    const raw =
      request.purpose === 'gloss'
        ? { translation: `[fake translation] ${lastUser}` }
        : fakeCorrect(lastUser);
    // The same Zod parse the real adapter does: a test against the fake also checks the schema.
    const data = request.schema.parse(raw);
    const input = request.system + request.messages.map((m) => m.text).join('');
    return { data, usage: this.usage(request, input, JSON.stringify(raw), started) };
  }

  async *streamText(request: TextRequest): AsyncGenerator<StreamEvent> {
    const started = await this.begin(request);
    const system = request.system.toLowerCase();
    const reply =
      this.scripts.find((s) => system.includes(s.keyword.toLowerCase()))?.reply ?? DEFAULT_REPLY;
    for (let i = 0; i < reply.length; i += this.chunkSize) {
      yield { type: 'delta', text: reply.slice(i, i + this.chunkSize) };
    }
    const input = request.system + request.messages.map((m) => m.text).join('');
    yield { type: 'done', usage: this.usage(request, input, reply, started) };
  }
}

type BaseRequestLike = { model: string };

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    // An already-aborted signal never fires 'abort' again, so check it first.
    if (signal?.aborted) return reject(new LlmFailed('ABORTED', 'aborted before it started'));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new LlmFailed('ABORTED', 'fake: aborted'));
      },
      { once: true },
    );
  });
}
