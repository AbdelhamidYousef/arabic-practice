import { describe, expect, it } from 'vitest';

import { hash, unusablePasswordHash, verify, verifyAgainstDummy } from './password.ts';

describe('password hashing', () => {
  it('hashes with argon2id and verifies the right password only', async () => {
    const h = await hash('correct horse battery staple');
    expect(h).toMatch(/^\$argon2id\$/);
    expect(await verify(h, 'correct horse battery staple')).toBe(true);
    expect(await verify(h, 'wrong')).toBe(false);
  });

  it('treats a malformed or unusable hash as no match instead of throwing', async () => {
    expect(await verify('test-hash', 'x')).toBe(false);
    expect(await verify(unusablePasswordHash(), 'x')).toBe(false);
  });

  it('never matches the dummy hash', async () => {
    expect(await verifyAgainstDummy('anything')).toBe(false);
  });
});
