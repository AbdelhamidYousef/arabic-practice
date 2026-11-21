import type { RequestHandler } from 'express';

import { readSessionCookie, setSessionCookie } from '../lib/cookies.ts';
import { demoReadOnly, forbidden, unauthenticated } from '../lib/errors.ts';
import { loadSession, type AuthUser } from '../modules/auth/sessions.ts';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- the only way to extend Express's Request
  namespace Express {
    interface Request {
      /** Set by `attachUser` on every request; null means anonymous. */
      user: AuthUser | null;
      /** The raw session cookie value of the current user (never logged, never stored as is). */
      sessionToken: string | null;
    }
  }
}

// Identifies the caller and never rejects: an anonymous visitor is a normal case and each route
// decides whether it needs a user (`requireUser`). An invalid or expired cookie is treated like no
// cookie. Real failures (the database being down) still propagate as a 500 rather than silently
// demoting a signed-in user to anonymous.
export function createAttachUser(opts: { secureCookies: boolean }): RequestHandler {
  return async (req, res, next) => {
    req.user = null;
    req.sessionToken = null;
    const token = readSessionCookie(req);
    if (token) {
      const session = await loadSession(token);
      if (session) {
        req.user = session.user;
        req.sessionToken = token;
        // The database expiry slid forward; move the browser's copy with it.
        if (session.slid) setSessionCookie(res, token, opts.secureCookies);
      }
    }
    next();
  };
}

// 401 when nobody is signed in: the web sends them to the login page.
export const requireUser: RequestHandler = (req, _res, next) => {
  next(req.user ? undefined : unauthenticated());
};

// 401 when nobody is signed in, 403 when someone is but has the wrong role: the web needs the
// difference to choose between "go to login" and "not allowed".
export function requireRole(role: AuthUser['role']): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) next(unauthenticated());
    else if (req.user.role !== role) next(forbidden(`${role} access required`));
    else next();
  };
}

// Put on every route that changes something a teacher owns: the seeded demo teacher may look
// around but never write. Reads (GET) simply do not use it.
export const forbidReadOnly: RequestHandler = (req, _res, next) => {
  if (!req.user) next(unauthenticated());
  else if (req.user.readOnly) next(demoReadOnly());
  else next();
};
