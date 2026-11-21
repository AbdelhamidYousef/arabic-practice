import type { CookieOptions, Request, Response } from 'express';

export const SESSION_COOKIE = 'sid';
export const SESSION_TTL_MS = 30 * 24 * 3600 * 1000;

// httpOnly keeps the id away from page scripts, SameSite=Lax withholds it from cross-site POSTs,
// Secure (production only, because local dev is plain http) keeps it off unencrypted connections.
export function sessionCookieOptions(secure: boolean, maxAgeMs = SESSION_TTL_MS): CookieOptions {
  return { httpOnly: true, sameSite: 'lax', secure, path: '/', maxAge: maxAgeMs };
}

export function setSessionCookie(res: Response, token: string, secure: boolean): void {
  res.cookie(SESSION_COOKIE, token, sessionCookieOptions(secure));
}

export function clearSessionCookie(res: Response, secure: boolean): void {
  // Same attributes as when it was set, or some browsers keep the old cookie.
  res.clearCookie(SESSION_COOKIE, { ...sessionCookieOptions(secure), maxAge: undefined });
}

export function readSessionCookie(req: Request): string | null {
  const value = (req.cookies as Record<string, unknown> | undefined)?.[SESSION_COOKIE];
  return typeof value === 'string' && value !== '' ? value : null;
}
