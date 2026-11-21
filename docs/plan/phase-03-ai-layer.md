# Phase 3 — AI layer

Goal: one provider interface with a fake and a Gemini adapter, a usage ledger and a budget guard.
Nothing outside `src/ai/` knows which provider runs.

## Step 3.1 — the interface
- `ai/provider.ts`:
  ```ts
  type ChatMessage = { role: 'user' | 'model'; text: string };
  type Usage = { inputTokens: number; outputTokens: number; model: string; latencyMs: number };
  interface LlmProvider {
    readonly name: 'fake' | 'gemini';
    generateJson<T>(req: JsonRequest<T>): Promise<{ data: T; usage: Usage }>;
    streamText(req: TextRequest): AsyncIterable<{ type: 'delta'; text: string } | { type: 'done'; usage: Usage }>;
  }
  ```
  `JsonRequest` carries `system`, `messages`, a Zod schema and its JSON Schema, `model`,
  `maxOutputTokens`, `temperature`, `signal`. Errors: `LlmRateLimited`, `LlmBadOutput`, `LlmFailed`.
- Learn / explain: why an interface and not an SDK; dependency injection through `createApp`.
- Commit: `feat(api): define the llm provider interface`

## Step 3.2 — the fake provider
- Deterministic: scripted replies per lesson keyword, a rule-based "corrector" that flags a few
  known patterns (missing ال after a demonstrative, masculine/feminine agreement on a list of test
  words, Latin letters), and fault injection (`rateLimitNext()`, `failNext()`, delay) for tests.
  Streams the reply in small chunks.
- Commit: `feat(api): add a deterministic fake llm provider`

## Step 3.3 — the Gemini adapter
- Plain `fetch` to `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`
  and `:streamGenerateContent?alt=sse`, key in the `x-goog-api-key` header. JSON via
  `generationConfig.responseMimeType` + `responseJsonSchema` (from `z.toJSONSchema`), then Zod-parsed;
  `thinkingConfig.thinkingLevel: 'MINIMAL'` for Flash-Lite. Shapes verified live on 2026-11-21: see
  `work/pending-decisions.md` (SSE `data:` lines; the last chunk has `finishReason` + `usageMetadata`;
  parts may be empty with a `thoughtSignature`; the stream ends when the connection closes).
  Defaults: correction `gemini-3.5-flash-lite`, reply and gloss `gemini-3.1-flash-lite`.
  one retry on a schema miss. SSE parsed line by line from the response body. 429 → `LlmRateLimited`
  (retry-after read if present). `usageMetadata` → `Usage`. Timeout via `AbortSignal.timeout`.
- Check the request/response shape against Google's current REST docs before writing it.
- Offline tests with recorded response bodies (made-up content); `gemini.live.test.ts` skips loudly without a key.
- Learn / explain: SSE framing (`data:` lines, blank line ends an event); why our own Zod parse even with a response schema.
- Commit: `feat(api): add gemini rest adapter with streaming and json output`

## Step 3.4 — usage ledger and price table
- `ai/usage.ts`: wraps a provider so every call writes an `ai_calls` row (purpose, user,
  conversation, model, tokens, latency, status, cost). `ai/prices.ts`: per-model USD per million
  tokens (from Google's pricing page, dated), 0 when `AI_TIER=free`.
- Commit: `feat(api): record every ai call with tokens, latency and cost`

## Step 3.5 — budget guard
- `ai/budget.ts`: before a call, check `AI_ENABLED`, the user's turns today (`AI_DAILY_TURNS_LEARNER`
  default 60, `AI_DAILY_TURNS_GUEST` default 20), the calls today **per model**
  (`AI_DAILY_CALLS_PER_MODEL`, default 450: the free quota is 500 requests a day per model; replaces
  `AI_DAILY_CALLS_GLOBAL`), and this month's cost against `AI_MONTHLY_BUDGET_USD`. One query
  each, indexed. Clear error codes. Unit + integration tests at each boundary.
- Learn / explain: caps as the hard spend limit; why counting rows we wrote beats trusting the provider dashboard.
- Commit: `feat(api): enforce daily caps and a monthly ai budget`

## Step 3.6 — provider selection
- `ai/index.ts`: picks the provider from env (`fake` in test; `gemini` when a key is set; dev
  without a key falls back to `fake` with a loud warning). Models per purpose:
  `AI_MODEL_CORRECTION`, `AI_MODEL_REPLY`, `AI_MODEL_GLOSS`.
- Commit: `feat(api): select the llm provider and models from config`
