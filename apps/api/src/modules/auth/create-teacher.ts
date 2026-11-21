import { EmailSchema, NewPasswordSchema } from '@arabic/shared';

import { db } from '../../db/client.ts';
import { users } from '../../db/schema/index.ts';
import { uniqueViolation } from '../../lib/db-errors.ts';
import { conflict, unprocessable } from '../../lib/errors.ts';
import { hash } from '../../lib/password.ts';

// Teachers cannot register through an invite (invites make learners), so the first real teacher
// is created by the operator with `pnpm --filter @arabic/api teacher:create <email>`. The checks
// are the register flow's own schemas: same email normalising, same password rule.
export async function createTeacherAccount(input: {
  email: string;
  password: string;
  displayName?: string | undefined;
}): Promise<{ id: string; email: string }> {
  const email = EmailSchema.safeParse(input.email);
  if (!email.success) throw unprocessable('That is not a valid email address');
  const password = NewPasswordSchema.safeParse(input.password);
  if (!password.success) {
    throw unprocessable(password.error.issues[0]?.message ?? 'That password is not allowed');
  }
  const displayName = input.displayName?.trim() || (email.data.split('@')[0] ?? 'Teacher');
  const passwordHash = await hash(password.data);
  try {
    const [row] = await db
      .insert(users)
      .values({
        email: email.data,
        passwordHash,
        displayName: displayName.slice(0, 60),
        role: 'teacher',
        level: 'C2',
      })
      .returning({ id: users.id, email: users.email });
    if (!row?.email) throw new Error('teacher insert returned no row');
    return { id: row.id, email: row.email };
  } catch (err) {
    if (uniqueViolation(err) !== undefined) throw conflict('An account with this email exists');
    throw err;
  }
}
