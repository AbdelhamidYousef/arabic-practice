import {
  TeacherLearnerDetailResponseSchema,
  TeacherLearnerListResponseSchema,
  TeacherTranscriptResponseSchema,
  UpdateLearnerRequestSchema,
  UpdateLearnerResponseSchema,
} from '@arabic/shared';
import { Router as ExpressRouter, type Router } from 'express';
import { z } from 'zod';

import { respond, valid, validate } from '../../lib/validate.ts';
import { forbidReadOnly, requireRole } from '../../middleware/auth.ts';

import * as service from './learners.service.ts';
import { teacherOf } from './teacher-of.ts';

export function createTeacherLearnersRouter(): Router {
  const router = ExpressRouter();
  const teacherOnly = requireRole('teacher');
  const idParams = { params: z.object({ id: z.uuid() }) };
  const patch = { ...idParams, body: UpdateLearnerRequestSchema };

  router.get('/teacher/learners', teacherOnly, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    respond(res, TeacherLearnerListResponseSchema, await service.listLearners(teacherOf(req.user)));
  });

  router.patch(
    '/teacher/learners/:id',
    teacherOnly,
    forbidReadOnly,
    validate(patch),
    async (req, res) => {
      const { params, body } = valid(req, patch);
      const learner = await service.setLearnerLevel(teacherOf(req.user), params.id, body.level);
      respond(res, UpdateLearnerResponseSchema, { learner });
    },
  );

  router.get('/teacher/learners/:id', teacherOnly, validate(idParams), async (req, res) => {
    const { params } = valid(req, idParams);
    res.setHeader('Cache-Control', 'no-store');
    respond(
      res,
      TeacherLearnerDetailResponseSchema,
      await service.getLearner(teacherOf(req.user), params.id),
    );
  });

  router.get('/teacher/conversations/:id', teacherOnly, validate(idParams), async (req, res) => {
    const { params } = valid(req, idParams);
    res.setHeader('Cache-Control', 'no-store');
    respond(
      res,
      TeacherTranscriptResponseSchema,
      await service.getTranscript(teacherOf(req.user), params.id),
    );
  });

  return router;
}
