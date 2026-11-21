import { ApiError } from '../../api/client';
import type { StringKey } from '../../i18n';

// The sentence under a failed sign-in or sign-up. Switches on the API's code, never its message.
export function authErrorKey(error: unknown): StringKey {
  if (error instanceof ApiError) {
    if (error.code === 'RATE_LIMITED') return 'auth.error.rateLimited';
    if (error.code === 'UNAUTHENTICATED') return 'auth.error.credentials';
    if (error.code === 'INVITES_CLOSED') return 'register.closed.title';
    if (error.code === 'CONFLICT') return 'auth.error.emailTaken';
    if (error.code === 'WRONG_PASSWORD') return 'auth.error.wrongPassword';
    if (error.code === 'NETWORK') return 'error.network';
    if (error.code === 'DEMO_UNAVAILABLE') return 'auth.error.demoUnavailable';
  }
  return 'auth.error.generic';
}
