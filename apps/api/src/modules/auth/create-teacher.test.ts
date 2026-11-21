import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from '../../db/client.ts';
import { users } from '../../db/schema/index.ts';
import { verify } from '../../lib/password.ts';
import { createUser } from '../../test/factories.ts';

import { createTeacherAccount } from './create-teacher.ts';

const GOOD = 'a long enough passphrase';

describe('createTeacherAccount', () => {
  it('creates a teacher with a verifiable argon2 hash and a normalised email', async () => {
    const out = await createTeacherAccount({ email: ' Tea.Cher@Example.COM ', password: GOOD });
    const [row] = await db.select().from(users).where(eq(users.id, out.id));
    expect(row).toMatchObject({
      email: 'tea.cher@example.com',
      role: 'teacher',
      readOnly: false,
      isGuest: false,
      displayName: 'tea.cher',
    });
    expect(row?.passwordHash).toMatch(/^\$argon2id\$/);
    expect(await verify(row?.passwordHash ?? '', GOOD)).toBe(true);
  });

  it('refuses a weak password, as the register flow does', async () => {
    await expect(
      createTeacherAccount({ email: 'a@example.com', password: 'short' }),
    ).rejects.toThrow(/at least 10/);
    await expect(
      createTeacherAccount({ email: 'a@example.com', password: 'Password123' }),
    ).rejects.toThrow(/too common/);
    expect(await db.select().from(users)).toHaveLength(0);
  });

  it('refuses a bad email and a duplicate email', async () => {
    await expect(createTeacherAccount({ email: 'nope', password: GOOD })).rejects.toThrow(/valid/);
    await createUser({ email: 'taken@example.com' });
    await expect(
      createTeacherAccount({ email: 'TAKEN@example.com', password: GOOD }),
    ).rejects.toThrow(/exists/);
  });
});
