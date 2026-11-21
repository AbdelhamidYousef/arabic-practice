import {
  InviteInfoSchema,
  UserResponseSchema,
  type InviteInfo,
  type LoginInput,
  type RegisterInput,
  type User,
} from '@arabic/shared';
import { z } from 'zod';

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

export type { InviteInfo, LoginInput, RegisterInput } from '@arabic/shared';

export async function login(input: LoginInput): Promise<User> {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: input,
    schema: UserResponseSchema,
  });
  return res.user;
}

export async function startGuest(): Promise<User> {
  const res = await apiFetch('/auth/guest', { method: 'POST', schema: UserResponseSchema });
  return res.user;
}

export async function startDemoTeacher(): Promise<User> {
  const res = await apiFetch('/auth/demo-teacher', {
    method: 'POST',
    schema: UserResponseSchema,
  });
  return res.user;
}

export function fetchInvite(code: string, signal?: AbortSignal): Promise<InviteInfo> {
  return apiFetch(`/auth/invites/${encodeURIComponent(code)}`, {
    schema: InviteInfoSchema,
    ...(signal && { signal }),
  });
}

export async function register(input: RegisterInput): Promise<User> {
  const res = await apiFetch('/auth/register', {
    method: 'POST',
    body: input,
    schema: UserResponseSchema,
  });
  return res.user;
}

export async function logout(): Promise<void> {
  await apiFetch('/auth/logout', { method: 'POST', schema: z.unknown() });
}
