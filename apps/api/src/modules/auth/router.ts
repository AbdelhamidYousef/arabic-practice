import { LoginSchema, UserResponseSchema } from '@arabic/shared';
import { Router as ExpressRouter, type Router } from 'express';

import { clearSessionCookie, readSessionCookie, setSessionCookie } from '../../lib/cookies.ts';
import { respond, valid, validate } from '../../lib/validate.ts';
import { requireUser } from '../../middleware/auth.ts';
import { createAuthRateLimiter, type RateLimitOptions } from '../../middleware/rate-limit.ts';

import { toUserDto } from './dto.ts';
import * as service from './service.ts';

export interface AuthRouterOptions {
  secureCookies: boolean;
  authRateLimit: RateLimitOptions;
}

export function createAuthRouter(opts: AuthRouterOptions): Router {
  const router = ExpressRouter();
  // Before validation on purpose: malformed attempts count against the limit too.
  const credentialLimit = createAuthRateLimiter(opts.authRateLimit);

  const login = { body: LoginSchema };
  router.post('/auth/login', credentialLimit, validate(login), async (req, res) => {
    const { body } = valid(req, login);
    // The cookie we read is the one we replace: it is the old session to destroy (fixation).
    const { user, token } = await service.login(body, readSessionCookie(req));
    setSessionCookie(res, token, opts.secureCookies);
    respond(res, UserResponseSchema, { user: toUserDto(user) });
  });

  // Idempotent on purpose (no requireUser): a visitor whose session already expired still wants the
  // cookie gone and a success answer, and signing out twice must not be an error.
  router.post('/auth/logout', async (req, res) => {
    await service.logout(req.sessionToken);
    clearSessionCookie(res, opts.secureCookies);
    res.status(204).end();
  });

  router.get('/auth/me', requireUser, (req, res) => {
    // requireUser guarantees a user; the check narrows the type without a non-null assertion.
    if (!req.user) throw new Error('requireUser let an anonymous request through');
    res.setHeader('Cache-Control', 'no-store');
    respond(res, UserResponseSchema, { user: toUserDto(req.user) });
  });

  return router;
}
