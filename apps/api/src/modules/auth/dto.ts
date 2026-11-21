import type { User } from '@arabic/shared';

import type { AuthUser } from './sessions.ts';

// The only place an internal user becomes what the browser sees: an allow-list, so a column added to
// the table later (or the teacher id) never leaks by accident.
export function toUserDto(u: AuthUser): User {
  return {
    id: u.id,
    displayName: u.displayName,
    role: u.role,
    level: u.level,
    isGuest: u.isGuest,
    readOnly: u.readOnly,
    email: u.email,
  };
}
