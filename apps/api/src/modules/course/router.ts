import {
  CourseResponseSchema,
  LessonProgressRequestSchema,
  LessonProgressResponseSchema,
  localDaySchema,
} from '@arabic/shared';
import { Router as ExpressRouter, type Router } from 'express';
import { z } from 'zod';

import { respond, valid, validate } from '../../lib/validate.ts';
import { forbidReadOnly, requireUser } from '../../middleware/auth.ts';

import { recordProgress } from './progress.service.ts';
import * as service from './service.ts';

export function createCourseRouter(): Router {
  const router = ExpressRouter();

  const course = { query: z.object({ day: localDaySchema.optional() }) };
  router.get('/course', requireUser, validate(course), async (req, res) => {
    if (!req.user) throw new Error('requireUser let an anonymous request through');
    const { query } = valid(req, course);
    res.setHeader('Cache-Control', 'no-store');
    respond(res, CourseResponseSchema, await service.getCourse(req.user, query.day));
  });

  const progress = {
    params: z.object({ slug: z.string().min(1).max(120) }),
    body: LessonProgressRequestSchema,
  };
  // forbidReadOnly runs before validation: the demo teacher gets the same 403 whatever the body is.
  router.post(
    '/lessons/:slug/progress',
    requireUser,
    forbidReadOnly,
    validate(progress),
    async (req, res) => {
      if (!req.user) throw new Error('requireUser let an anonymous request through');
      const { params, body } = valid(req, progress);
      respond(res, LessonProgressResponseSchema, await recordProgress(req.user, params.slug, body));
    },
  );

  return router;
}
