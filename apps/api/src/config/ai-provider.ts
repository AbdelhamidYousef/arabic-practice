import type { Env } from './env.ts';

export type AiProviderName = 'fake' | 'gemini';

// Which adapter answers. An explicit AI_PROVIDER wins. Otherwise the fake is chosen by
// NODE_ENV=test and nothing else, so no flag a production host could set can switch it on; outside
// tests it is `gemini` when a key exists and the fake only on a laptop without one (production
// refuses to boot in that state, see envSchema).
export function resolveAiProvider(
  e: Pick<Env, 'NODE_ENV' | 'AI_PROVIDER' | 'GEMINI_API_KEY'>,
): AiProviderName {
  if (e.AI_PROVIDER) return e.AI_PROVIDER;
  if (e.NODE_ENV === 'test') return 'fake';
  return e.GEMINI_API_KEY ? 'gemini' : 'fake';
}
