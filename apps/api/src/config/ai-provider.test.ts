import { describe, expect, it } from 'vitest';

import { resolveAiProvider } from './ai-provider.ts';

const key = 'AIza-example-key-0000';

describe('resolveAiProvider', () => {
  it('chooses the fake under NODE_ENV=test even when a key is present', () => {
    expect(
      resolveAiProvider({ NODE_ENV: 'test', AI_PROVIDER: undefined, GEMINI_API_KEY: key }),
    ).toBe('fake');
  });

  it('chooses gemini outside tests when a key exists, and the fake on a laptop without one', () => {
    expect(
      resolveAiProvider({ NODE_ENV: 'development', AI_PROVIDER: undefined, GEMINI_API_KEY: key }),
    ).toBe('gemini');
    expect(
      resolveAiProvider({
        NODE_ENV: 'development',
        AI_PROVIDER: undefined,
        GEMINI_API_KEY: undefined,
      }),
    ).toBe('fake');
  });

  it('lets an explicit provider win, which is how live tests ask for gemini', () => {
    expect(
      resolveAiProvider({ NODE_ENV: 'test', AI_PROVIDER: 'gemini', GEMINI_API_KEY: key }),
    ).toBe('gemini');
    expect(
      resolveAiProvider({ NODE_ENV: 'development', AI_PROVIDER: 'fake', GEMINI_API_KEY: key }),
    ).toBe('fake');
  });

  it('uses gemini in production when a key exists and no provider is named', () => {
    expect(
      resolveAiProvider({ NODE_ENV: 'production', AI_PROVIDER: undefined, GEMINI_API_KEY: key }),
    ).toBe('gemini');
  });
});
