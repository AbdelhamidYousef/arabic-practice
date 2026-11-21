import {
  ConversationDetailResponseSchema,
  StartConversationRequestSchema,
  StartConversationResponseSchema,
} from '@arabic/shared';
import { Router as ExpressRouter, type Router } from 'express';
import { z } from 'zod';

import { respond, valid, validate } from '../../lib/validate.ts';
import { forbidReadOnly, requireUser } from '../../middleware/auth.ts';

import * as service from './service.ts';

const idParams = { params: z.object({ id: z.uuid() }) };

export function createPracticeRouter(): Router {
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

  return router;
}
