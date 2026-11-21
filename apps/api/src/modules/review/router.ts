import {
  ReviewAnswerRequestSchema,
  ReviewAnswerResponseSchema,
  ReviewDueResponseSchema,
} from '@arabic/shared';
import { Router as ExpressRouter, type Router } from 'express';
import { z } from 'zod';

import { respond, valid, validate } from '../../lib/validate.ts';
import { requireUser } from '../../middleware/auth.ts';

import * as service from './service.ts';

export function createReviewRouter(): Router {
  const router = ExpressRouter();

  router.get('/review/due', requireUser, async (req, res) => {
    if (!req.user) throw new Error('requireUser let an anonymous request through');
    res.setHeader('Cache-Control', 'no-store');
    respond(res, ReviewDueResponseSchema, await service.getDueCards(req.user));
  });

  const answer = { params: z.object({ vocabId: z.uuid() }), body: ReviewAnswerRequestSchema };
  router.post('/review/:vocabId', requireUser, validate(answer), async (req, res) => {
    if (!req.user) throw new Error('requireUser let an anonymous request through');
    const { params, body } = valid(req, answer);
    respond(
      res,
      ReviewAnswerResponseSchema,
      await service.answerCard(req.user, params.vocabId, body.correct),
    );
  });

  return router;
}
