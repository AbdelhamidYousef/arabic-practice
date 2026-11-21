import type { z } from 'zod';

// The whole AI layer hangs off this one small interface. Nothing outside `src/ai/` knows which
// provider answers: routes talk to a gateway (see usage.ts / budget.ts) that wraps an LlmProvider,
// and tests inject the fake. Why an interface and not a vendor SDK: the SDK would leak its types and
// network behaviour into every route, tests would need the network, and switching model vendors would
// touch the whole app. With this interface the Gemini adapter is ~one file and the fake is another.

/** One turn of a conversation, in the provider's vocabulary ("model" is the AI side). */
export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

/**
 * Why the call is made. The ledger records it, the caps count by it, and the fake uses it to decide
 * what kind of answer to script. `eval` is for the offline quality runs (phase 11).
 */
export type LlmPurpose = 'correction' | 'reply' | 'gloss' | 'eval';

/** What a call cost in tokens and time. Thinking tokens, when a model reports them, count as output. */
export interface Usage {
  inputTokens: number;
  outputTokens: number;
  model: string;
  latencyMs: number;
}

interface BaseRequest {
  purpose: LlmPurpose;
  model: string;
  /**
   * Instructions written by us. Learner text must NEVER be put in here: it goes in `messages` only,
   * so a learner cannot rewrite the teacher's rules ("ignore the above").
   */
  system: string;
  messages: ChatMessage[];
  maxOutputTokens: number;
  /** Lets the caller cancel (the learner closed the tab). The adapter adds its own timeout. */
  signal?: AbortSignal;
}

/** Structured output: the model must answer JSON that fits `schema` (the adapter also sends it as JSON Schema). */
export interface JsonRequest<T> extends BaseRequest {
  schema: z.ZodType<T>;
}

/** Plain text, streamed so the learner sees the reply as it is written. */
export type TextRequest = BaseRequest;

export type StreamEvent = { type: 'delta'; text: string } | { type: 'done'; usage: Usage };

export interface LlmProvider {
  readonly name: 'fake' | 'gemini';
  /** One answer, validated against `request.schema` (we never trust the model to follow it). */
  generateJson<T>(request: JsonRequest<T>): Promise<{ data: T; usage: Usage }>;
  /** Deltas in order, then exactly one `done` with the usage. Failures throw from the iterator. */
  streamText(request: TextRequest): AsyncIterable<StreamEvent>;
}

// Three error types, because the caller reacts differently to each:
//  - rate limited: the provider is busy, tell the learner to retry shortly (API code AI_BUSY);
//  - bad output: the model answered, but not in the shape we asked for, even after a retry (AI_FAILED);
//  - failed: anything else (network, timeout, 5xx, blocked by a safety filter) (AI_FAILED).
export class LlmRateLimited extends Error {
  readonly retryAfterMs: number | undefined;
  constructor(message = 'The AI provider is rate limiting us', retryAfterMs?: number) {
    super(message);
    this.name = 'LlmRateLimited';
    this.retryAfterMs = retryAfterMs;
  }
}

export class LlmBadOutput extends Error {
  /** The raw text the model produced, kept for logs and tests (never shown to learners). */
  readonly raw: string;
  constructor(message: string, raw = '') {
    super(message);
    this.name = 'LlmBadOutput';
    this.raw = raw;
  }
}

export class LlmFailed extends Error {
  /** Short machine code for the ledger: `HTTP_500`, `TIMEOUT`, `NETWORK`, `FINISH_SAFETY`, `BLOCKED`... */
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'LlmFailed';
    this.code = code;
  }
}
