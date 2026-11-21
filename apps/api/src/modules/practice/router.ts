import {
  ConversationDetailResponseSchema,
  GlossResponseSchema,
  StartConversationRequestSchema,
  StartConversationResponseSchema,
  TurnRequestSchema,
} from '@arabic/shared';
import { Router as ExpressRouter, type Router } from 'express';
import { z } from 'zod';

import type { AiRuntime } from '../../ai/index.ts';
import { respond, valid, validate } from '../../lib/validate.ts';
import { forbidReadOnly, requireUser } from '../../middleware/auth.ts';
import { createUserRateLimiter, type RateLimitOptions } from '../../middleware/rate-limit.ts';

import * as service from './service.ts';
import { runTurn } from './turn.ts';

const idParams = { params: z.object({ id: z.uuid() }) };

export interface PracticeRouterOptions {
  ai: AiRuntime;
  /** Per learner, on top of the daily caps: the free tier allows 15 requests a minute per model for everybody. */
  turnRateLimit: RateLimitOptions;
}

export function createPracticeRouter({ ai, turnRateLimit }: PracticeRouterOptions): Router {
  const router = ExpressRouter();

  router.post(
    '/conversations',
    requireUser,
    forbidReadOnly,
    validate({ body: StartConversationRequestSchema }),
    async (req, res) => {
      if (!req.user) throw new Error('requireUser let an anonymous request through');
      const { body } = valid(req, { body: StartConversationRequestSchema });
      res.status(201);
      respond(
        res,
        StartConversationResponseSchema,
        await service.startConversation(req.user, body.lessonId),
      );
    },
  );

  router.get('/conversations/:id', requireUser, validate(idParams), async (req, res) => {
    if (!req.user) throw new Error('requireUser let an anonymous request through');
    const { params } = valid(req, idParams);
    res.setHeader('Cache-Control', 'no-store');
    respond(
      res,
      ConversationDetailResponseSchema,
      await service.getConversation(req.user, params.id),
    );
  });

  const turn = { ...idParams, body: TurnRequestSchema };
  router.post(
    '/conversations/:id/turns',
    requireUser,
    forbidReadOnly,
    createUserRateLimiter(turnRateLimit),
    validate(turn),
    async (req, res) => {
      if (!req.user) throw new Error('requireUser let an anonymous request through');
      const { params, body } = valid(req, turn);
      await runTurn({ req, res, user: req.user, conversationId: params.id, text: body.text, ai });
    },
  );

  // Same per-learner limit as turns (its own counter): a gloss is also a billed provider call.
  router.post(
    '/messages/:id/gloss',
    requireUser,
    forbidReadOnly,
    createUserRateLimiter(turnRateLimit),
    validate(idParams),
    async (req, res) => {
      if (!req.user) throw new Error('requireUser let an anonymous request through');
      const { params } = valid(req, idParams);
      res.setHeader('Cache-Control', 'no-store');
      respond(res, GlossResponseSchema, await service.glossMessage(req.user, params.id, ai));
    },
  );

  return router;
}
