import { z } from 'zod';

import { cefrLevelSchema } from '../cefr.ts';

// What the API tells the browser about the signed-in person. Deliberately small: no password hash,
// no teacher id, no timestamps. `email` is null for guests, who have no login.
export const UserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  role: z.enum(['learner', 'teacher']),
  level: cefrLevelSchema,
  isGuest: z.boolean(),
  // The demo teacher: every mutation answers 403 DEMO_READ_ONLY.
  readOnly: z.boolean(),
  email: z.string().nullable(),
});

export type User = z.infer<typeof UserSchema>;

// `{ user }` is the answer of /auth/me, login, register, guest and demo-teacher sign-in.
export const UserResponseSchema = z.object({ user: UserSchema });

export type UserResponse = z.infer<typeof UserResponseSchema>;
