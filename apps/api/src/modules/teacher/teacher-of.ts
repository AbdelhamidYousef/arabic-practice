import type { AuthUser } from '../auth/sessions.ts';

// requireRole('teacher') has already refused anyone else, so a missing user is a wiring bug.
export function teacherOf(user: AuthUser | null): AuthUser {
  if (!user) throw new Error('requireRole let an anonymous request through');
  return user;
}
