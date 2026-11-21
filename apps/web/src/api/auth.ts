import { cefrLevelSchema } from '@arabic/shared';
import { z } from 'zod';

import { ApiError, apiFetch } from './client';

// Local for now: it moves to packages/shared (schemas/auth.ts) at merge, when the auth lane's
// endpoints land and both sides can import one definition. Shape per docs/plan/02-api-contract.md.
export const UserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  role: z.enum(['learner', 'teacher']),
  // Null for a teacher, who has no practice level of their own.
  level: cefrLevelSchema.nullable(),
  isGuest: z.boolean(),
  // The demo teacher can look but not change anything.
  readOnly: z.boolean(),
  email: z.string().nullable(),
});
export type User = z.infer<typeof UserSchema>;

export const UserResponseSchema = z.object({ user: UserSchema });

// The boot call: a 401 here is the normal answer for a visitor, not an error, so it becomes null.
export async function fetchMe(signal?: AbortSignal): Promise<User | null> {
  try {
    const res = await apiFetch('/auth/me', {
      schema: UserResponseSchema,
      ...(signal && { signal }),
    });
    return res.user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}
