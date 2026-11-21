import { LessonDetailResponseSchema, LessonListResponseSchema } from '@arabic/shared';
import { Router as ExpressRouter, type Router } from 'express';
import { z } from 'zod';

import { respond, valid, validate } from '../../lib/validate.ts';
import { requireUser } from '../../middleware/auth.ts';

import * as service from './service.ts';

export function createLessonsRouter(): Router {
  const router = ExpressRouter();

  router.get('/lessons', requireUser, async (req, res) => {
    // requireUser guarantees a user; the check narrows the type without a non-null assertion.
    if (!req.user) throw new Error('requireUser let an anonymous request through');
    res.setHeader('Cache-Control', 'no-store');
    respond(res, LessonListResponseSchema, await service.listLessons(req.user));
  });

  const detail = { params: z.object({ slug: z.string().min(1).max(120) }) };
  router.get('/lessons/:slug', requireUser, validate(detail), async (req, res) => {
    if (!req.user) throw new Error('requireUser let an anonymous request through');
    const { params } = valid(req, detail);
    res.setHeader('Cache-Control', 'no-store');
    respond(res, LessonDetailResponseSchema, await service.getLesson(req.user, params.slug));
  });

  return router;
}
