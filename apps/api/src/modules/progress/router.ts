import { ProgressResponseSchema } from '@arabic/shared';
import { Router as ExpressRouter, type Router } from 'express';

import { respond } from '../../lib/validate.ts';
import { requireUser } from '../../middleware/auth.ts';

import { getProgress } from './service.ts';

export function createProgressRouter(): Router {
  const router = ExpressRouter();

  router.get('/progress', requireUser, async (req, res) => {
    if (!req.user) throw new Error('requireUser let an anonymous request through');
    res.setHeader('Cache-Control', 'no-store');
    respond(res, ProgressResponseSchema, await getProgress(req.user));
  });

  return router;
}
