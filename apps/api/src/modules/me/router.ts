import { DeleteAccountSchema } from '@arabic/shared';
import { Router as ExpressRouter, type Router } from 'express';

import { clearSessionCookie } from '../../lib/cookies.ts';
import { valid, validate } from '../../lib/validate.ts';
import { forbidReadOnly, requireUser } from '../../middleware/auth.ts';
import { createUserRateLimiter, type RateLimitOptions } from '../../middleware/rate-limit.ts';

import * as service from './service.ts';

export interface MeRouterOptions {
  secureCookies: boolean;
  /** The credential limit (per user here): deleting is a password check like any other. */
  authRateLimit: RateLimitOptions;
}

// The person's own data: a download of everything we hold about them, and the account's removal.
export function createMeRouter(opts: MeRouterOptions): Router {
  const router = ExpressRouter();

  router.get('/me/export', requireUser, forbidReadOnly, async (req, res) => {
    if (!req.user) throw new Error('requireUser let an anonymous request through');
    const data = await service.exportData(req.user);
    // A download, never cached: it holds the learner's whole chat history.
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Disposition', 'attachment; filename="arabic-practice-export.json"');
    res.json(data);
  });

  const remove = { body: DeleteAccountSchema };
  router.delete(
    '/me',
    requireUser,
    forbidReadOnly,
    createUserRateLimiter(opts.authRateLimit),
    validate(remove),
    async (req, res) => {
      const { body } = valid(req, remove);
      if (!req.user) throw new Error('requireUser let an anonymous request through');
      await service.deleteAccount(req.user, body.password);
      clearSessionCookie(res, opts.secureCookies);
      res.status(204).end();
    },
  );

  return router;
}
