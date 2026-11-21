import { UserResponseSchema, type User } from '@arabic/shared';

import { ApiError, apiFetch } from './client';

// One definition of the signed-in user for both sides: the API builds it, the browser parses it.
export { UserResponseSchema, UserSchema, type User } from '@arabic/shared';

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
