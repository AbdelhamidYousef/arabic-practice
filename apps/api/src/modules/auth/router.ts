import {
  InviteCodeSchema,
  InviteInfoSchema,
  LoginSchema,
  RegisterSchema,
  UserResponseSchema,
} from '@arabic/shared';
import { Router as ExpressRouter, type RequestHandler, type Router } from 'express';
import { z } from 'zod';

import { clearSessionCookie, readSessionCookie, setSessionCookie } from '../../lib/cookies.ts';
import { invitesClosed } from '../../lib/errors.ts';
import { respond, valid, validate } from '../../lib/validate.ts';
import { requireUser } from '../../middleware/auth.ts';
import {
  createAuthRateLimiter,
  createIpRateLimiter,
  type RateLimitOptions,
} from '../../middleware/rate-limit.ts';

import { toUserDto } from './dto.ts';
import * as service from './service.ts';

export interface AuthRouterOptions {
  secureCookies: boolean;
  authRateLimit: RateLimitOptions;
  /** INVITES_ENABLED: while false, lookup and register answer 403 INVITES_CLOSED. */
  invitesEnabled: boolean;
  /** Guest sign-ins per IP; defaults to 10 per hour. */
  guestRateLimit?: RateLimitOptions | undefined;
  /** Login attempts per IP whatever the email (defaults to 20 per 15 minutes). */
  loginIpRateLimit?: RateLimitOptions | undefined;
  /** Database-backed guest limits (they hold across serverless instances, unlike the limiter above). */
  guestLimits: service.GuestLimits;
}

export function createAuthRouter(opts: AuthRouterOptions): Router {
  const router = ExpressRouter();
  // Before validation on purpose: malformed attempts count against the limit too.
  const credentialLimit = createAuthRateLimiter(opts.authRateLimit);

  // The IP+email limiter alone lets one machine try 10 passwords on EVERY email; this one caps the
  // machine itself. It sits in front, so it also counts malformed attempts.
  const loginIpLimit = createIpRateLimiter(
    opts.loginIpRateLimit ?? { windowMs: 15 * 60_000, limit: 20 },
  );
  const login = { body: LoginSchema };
  router.post('/auth/login', loginIpLimit, credentialLimit, validate(login), async (req, res) => {
    const { body } = valid(req, login);
    // The cookie we read is the one we replace: it is the old session to destroy (fixation).
    const { user, token } = await service.login(body, readSessionCookie(req));
    setSessionCookie(res, token, opts.secureCookies);
    respond(res, UserResponseSchema, { user: toUserDto(user) });
  });

  // Registration is one switch (INVITES_ENABLED, refused in production on the free AI tier). It is
  // checked before anything else so a closed sign-up reveals nothing, not even whether a code exists.
  const requireInvitesOpen: RequestHandler = (_req, _res, next) => {
    next(opts.invitesEnabled ? undefined : invitesClosed());
  };

  const register = { body: RegisterSchema };
  router.post(
    '/auth/register',
    requireInvitesOpen,
    credentialLimit,
    validate(register),
    async (req, res) => {
      const { body } = valid(req, register);
      const { user, token } = await service.register(body, readSessionCookie(req));
      setSessionCookie(res, token, opts.secureCookies);
      res.status(201);
      respond(res, UserResponseSchema, { user: toUserDto(user) });
    },
  );

  const inviteLookup = { params: z.object({ code: InviteCodeSchema }) };
  router.get(
    '/auth/invites/:code',
    requireInvitesOpen,
    createIpRateLimiter(opts.authRateLimit),
    validate(inviteLookup),
    async (req, res) => {
      const { params } = valid(req, inviteLookup);
      res.setHeader('Cache-Control', 'no-store');
      respond(res, InviteInfoSchema, await service.lookupInvite(params.code));
    },
  );

  // No account to key on, so the limit is per IP. It keeps one visitor from filling the users table.
  const guestLimit = createIpRateLimiter(
    opts.guestRateLimit ?? { windowMs: 3600 * 1000, limit: 10 },
  );
  router.post('/auth/guest', guestLimit, async (req, res) => {
    const { user, token } = await service.createGuest(
      readSessionCookie(req),
      req.ip ?? '',
      opts.guestLimits,
    );
    setSessionCookie(res, token, opts.secureCookies);
    res.status(201);
    respond(res, UserResponseSchema, { user: toUserDto(user) });
  });

  // Same shape and limit as the guest sign-in: public, no account, so keyed by IP.
  router.post('/auth/demo-teacher', guestLimit, async (req, res) => {
    const { user, token } = await service.signInDemoTeacher(readSessionCookie(req));
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
