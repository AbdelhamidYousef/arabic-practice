import {
  TeacherLessonInputSchema,
  TeacherLessonListResponseSchema,
  TeacherLessonResponseSchema,
} from '@arabic/shared';
import { Router as ExpressRouter, type Router } from 'express';
import { z } from 'zod';

import { respond, valid, validate } from '../../lib/validate.ts';
import { forbidReadOnly, requireRole } from '../../middleware/auth.ts';

import * as service from './lessons.service.ts';
import { teacherOf } from './teacher-of.ts';

export function createTeacherLessonsRouter(): Router {
  const router = ExpressRouter();
  const teacherOnly = requireRole('teacher');
  const idParams = { params: z.object({ id: z.uuid() }) };
  const write = { ...idParams, body: TeacherLessonInputSchema };

  router.get('/teacher/lessons', teacherOnly, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    respond(res, TeacherLessonListResponseSchema, await service.listLessons(teacherOf(req.user)));
  });

  // forbidReadOnly runs before validation: the demo teacher gets the same 403 whatever the body is.
  router.post(
    '/teacher/lessons',
    teacherOnly,
    forbidReadOnly,
    validate({ body: TeacherLessonInputSchema }),
    async (req, res) => {
      const { body } = valid(req, { body: TeacherLessonInputSchema });
      const lesson = await service.createLesson(teacherOf(req.user), body);
      res.status(201);
      respond(res, TeacherLessonResponseSchema, { lesson });
    },
  );

  router.get('/teacher/lessons/:id', teacherOnly, validate(idParams), async (req, res) => {
    const { params } = valid(req, idParams);
    res.setHeader('Cache-Control', 'no-store');
    const lesson = await service.getLesson(teacherOf(req.user), params.id);
    respond(res, TeacherLessonResponseSchema, { lesson });
  });

  router.put(
    '/teacher/lessons/:id',
    teacherOnly,
    forbidReadOnly,
    validate(write),
    async (req, res) => {
      const { params, body } = valid(req, write);
      const lesson = await service.updateLesson(teacherOf(req.user), params.id, body);
      respond(res, TeacherLessonResponseSchema, { lesson });
    },
  );

  router.delete(
    '/teacher/lessons/:id',
    teacherOnly,
    forbidReadOnly,
    validate(idParams),
    async (req, res) => {
      const { params } = valid(req, idParams);
      await service.deleteLesson(teacherOf(req.user), params.id);
      res.status(204).end();
    },
  );

  return router;
}
