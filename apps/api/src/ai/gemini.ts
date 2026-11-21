import { z } from 'zod';

import {
  LlmBadOutput,
  LlmFailed,
  LlmRateLimited,
  type ChatMessage,
  type JsonRequest,
  type LlmProvider,
  type StreamEvent,
  type TextRequest,
  type Usage,
} from './provider.ts';
import { parseSse } from './sse.ts';

// The Gemini adapter: plain `fetch` against Google's REST API, no SDK (see provider.ts for why).
// Field names were verified against the live API on 2026-11-21 (work/pending-decisions.md).

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export interface GeminiOptions {
  apiKey: string;
  /** Replaceable so offline tests can feed recorded response bodies. */
  fetch?: typeof fetch;
  baseUrl?: string;
  /** Whole-call limits. A stream gets longer because it lasts as long as the reply is written. */
  jsonTimeoutMs?: number;
  streamTimeoutMs?: number;
}

interface Part {
  text?: string;
  thought?: boolean;
  thoughtSignature?: string;
}
interface GenerateContentResponse {
  candidates?: { content?: { parts?: Part[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    thoughtsTokenCount?: number;
  };
  error?: { code?: number; message?: string; status?: string };
}

// STOP is a normal end; MAX_TOKENS is "cut off at our limit", which the caller can still use
// (a JSON answer that was cut off simply fails the schema parse and is retried). Anything else
// (SAFETY, RECITATION, BLOCKLIST...) means Google refused to finish: a failed call, not an answer.
const OK_FINISH = new Set(['STOP', 'MAX_TOKENS']);

// Flash-Lite models support the lowest thinking level; grading or replying with one short sentence
// does not need more, and thinking tokens cost latency and daily quota.
const usesMinimalThinking = (model: string) => model.includes('flash-lite');

/**
 * Gemini accepts a JSON Schema subset. zod's output carries `$schema` (and `$id`), which the API
 * does not take, so those are removed. Everything else zod emits for our flat schemas is accepted.
 */
export function toGeminiSchema(schema: z.ZodType): Record<string, unknown> {
  const json = z.toJSONSchema(schema, { io: 'output' }) as Record<string, unknown>;
  delete json.$schema;
  delete json.$id;
  return json;
}

export class GeminiProvider implements LlmProvider {
  readonly name = 'gemini' as const;
  private readonly apiKey: string;
  private readonly doFetch: typeof fetch;
  private readonly baseUrl: string;
  private readonly jsonTimeoutMs: number;
  private readonly streamTimeoutMs: number;

  constructor(options: GeminiOptions) {
    this.apiKey = options.apiKey;
    this.doFetch = options.fetch ?? fetch;
    this.baseUrl = options.baseUrl ?? BASE_URL;
    this.jsonTimeoutMs = options.jsonTimeoutMs ?? 20_000;
    this.streamTimeoutMs = options.streamTimeoutMs ?? 40_000;
  }

  async generateJson<T>(request: JsonRequest<T>): Promise<{ data: T; usage: Usage }> {
    const started = Date.now();
    const body = this.body(request, { json: toGeminiSchema(request.schema) });
    let inputTokens = 0;
    let outputTokens = 0;
    let lastRaw = '';
    let lastProblem = '';
    // Two attempts: a model occasionally returns JSON that does not fit; one retry nearly always
    // fixes it, and a second miss is a real failure we report instead of looping.
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      const res = await this.post(
        `${request.model}:generateContent`,
        body,
        request.signal,
        this.jsonTimeoutMs,
      );
      const json = await readJson(res);
      const { text, usage } = this.extract(json);
      inputTokens += usage.inputTokens;
      outputTokens += usage.outputTokens;
      lastRaw = text;
      // Why our own parse even though we sent a response schema: the schema steers the model but
      // is not a guarantee (and does not cover rules like max array length or enums in every case).
      // Only a Zod parse proves the data matches what the rest of the app expects.
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        lastProblem = 'the answer was not valid JSON';
        continue;
      }
      const checked = request.schema.safeParse(parsed);
      if (checked.success) {
        return {
          data: checked.data,
          usage: {
            inputTokens,
            outputTokens,
            model: request.model,
            latencyMs: Date.now() - started,
          },
        };
      }
      lastProblem = `the JSON did not match the schema (${checked.error.issues[0]?.path.join('.') ?? ''})`;
    }
    throw new LlmBadOutput(`Gemini ${request.model}: ${lastProblem}, twice`, lastRaw);
  }

  async *streamText(request: TextRequest): AsyncGenerator<StreamEvent> {
    const started = Date.now();
    const res = await this.post(
      `${request.model}:streamGenerateContent?alt=sse`,
      this.body(request),
      request.signal,
      this.streamTimeoutMs,
    );
    if (!res.body) throw new LlmFailed('NO_BODY', 'Gemini returned an empty stream');

    let finish: string | undefined;
    let usage = { inputTokens: 0, outputTokens: 0 };
    try {
      for await (const data of parseSse(res.body)) {
        let chunk: GenerateContentResponse;
        try {
          chunk = JSON.parse(data) as GenerateContentResponse;
        } catch {
          throw new LlmFailed('BAD_STREAM', 'Gemini sent an unreadable stream event');
        }
        if (chunk.error) throw errorFrom(chunk.error.code ?? 500, chunk.error);
        const { text, usage: u, finishReason } = this.extract(chunk, { partial: true });
        if (text) yield { type: 'delta', text };
        // The last chunk carries the full usageMetadata; earlier chunks may carry running totals.
        if (u.inputTokens || u.outputTokens) usage = u;
        if (finishReason) finish = finishReason;
      }
    } catch (e) {
      throw asLlmError(e);
    }
    // A stream that closes without a finishReason was cut off (network, proxy): never present a
    // half reply as a finished one.
    if (!finish) throw new LlmFailed('TRUNCATED_STREAM', 'The stream ended before it finished');
    this.assertFinish(finish);
    yield {
      type: 'done',
      usage: { ...usage, model: request.model, latencyMs: Date.now() - started },
    };
  }

  // --- request ---

  private body(request: TextRequest, opts: { json?: Record<string, unknown> } = {}) {
    return {
      systemInstruction: { parts: [{ text: request.system }] },
      contents: request.messages.map((m: ChatMessage) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
      generationConfig: {
        maxOutputTokens: request.maxOutputTokens,
        // temperature / topP / topK are deliberately NOT sent: newer models ignore them.
        ...(opts.json && {
          responseMimeType: 'application/json',
          responseJsonSchema: opts.json,
        }),
        ...(usesMinimalThinking(request.model) && { thinkingConfig: { thinkingLevel: 'MINIMAL' } }),
      },
    };
  }

  private async post(
    path: string,
    body: unknown,
    callerSignal: AbortSignal | undefined,
    timeoutMs: number,
  ): Promise<Response> {
    const timeout = AbortSignal.timeout(timeoutMs);
    const signal = callerSignal ? AbortSignal.any([callerSignal, timeout]) : timeout;
    let res: Response;
    try {
      res = await this.doFetch(`${this.baseUrl}/models/${path}`, {
        method: 'POST',
        // The key goes in a header, never in the URL, so it cannot end up in access logs.
        headers: { 'content-type': 'application/json', 'x-goog-api-key': this.apiKey },
        body: JSON.stringify(body),
        signal,
      });
    } catch (e) {
      throw asLlmError(e, timeout.aborted);
    }
    if (!res.ok) {
      const parsed = (await res.json().catch(() => ({}))) as GenerateContentResponse;
      throw errorFrom(res.status, parsed.error, res.headers.get('retry-after'));
    }
    return res;
  }

  // --- response ---

  private assertFinish(finishReason: string | undefined): void {
    if (finishReason && !OK_FINISH.has(finishReason)) {
      throw new LlmFailed(`FINISH_${finishReason}`, `Gemini stopped with ${finishReason}`);
    }
  }

  private extract(
    json: GenerateContentResponse,
    opts: { partial?: boolean } = {},
  ): { text: string; usage: Pick<Usage, 'inputTokens' | 'outputTokens'>; finishReason?: string } {
    if (json.promptFeedback?.blockReason) {
      throw new LlmFailed(
        'BLOCKED',
        `Gemini blocked the prompt (${json.promptFeedback.blockReason})`,
      );
    }
    const candidate = json.candidates?.[0];
    const finishReason = candidate?.finishReason;
    // In a stream, a failing finishReason is checked once at the end; here (a single answer) now.
    if (!opts.partial) {
      this.assertFinish(finishReason);
      if (!candidate) throw new LlmFailed('NO_CANDIDATE', 'Gemini returned no answer');
    }
    // Skip thinking parts and empty parts (some carry only a thoughtSignature).
    const text = (candidate?.content?.parts ?? [])
      .filter((p) => !p.thought && p.text)
      .map((p) => p.text)
      .join('');
    const m = json.usageMetadata;
    return {
      text,
      // Thinking tokens are billed as output, so they count as output.
      usage: {
        inputTokens: m?.promptTokenCount ?? 0,
        outputTokens: (m?.candidatesTokenCount ?? 0) + (m?.thoughtsTokenCount ?? 0),
      },
      ...(finishReason !== undefined && { finishReason }),
    };
  }
}

async function readJson(res: Response): Promise<GenerateContentResponse> {
  try {
    return (await res.json()) as GenerateContentResponse;
  } catch {
    throw new LlmFailed('BAD_BODY', 'Gemini returned a body that is not JSON');
  }
}

function errorFrom(
  status: number,
  error: GenerateContentResponse['error'],
  retryAfter?: string | null,
): LlmRateLimited | LlmFailed {
  const message = error?.message ?? `Gemini answered HTTP ${status}`;
  if (status === 429) {
    // retry-after may be absent; then the caller just backs off by its own rule.
    const seconds = retryAfter ? Number(retryAfter) : NaN;
    return new LlmRateLimited(message, Number.isFinite(seconds) ? seconds * 1000 : undefined);
  }
  return new LlmFailed(`HTTP_${status}`, `${error?.status ?? 'ERROR'}: ${message}`);
}

function asLlmError(e: unknown, timedOut = false): Error {
  if (e instanceof LlmFailed || e instanceof LlmRateLimited || e instanceof LlmBadOutput) return e;
  if (timedOut || (e instanceof Error && e.name === 'TimeoutError')) {
    return new LlmFailed('TIMEOUT', 'Gemini did not answer in time');
  }
  if (e instanceof Error && e.name === 'AbortError')
    return new LlmFailed('ABORTED', 'Call aborted');
  return new LlmFailed('NETWORK', e instanceof Error ? e.message : 'network error');
}
