import { TeacherUsageResponseSchema } from '@arabic/shared';
import { Router as ExpressRouter, type Router } from 'express';

import { respond } from '../../lib/validate.ts';
import { requireRole } from '../../middleware/auth.ts';

import { teacherOf } from './teacher-of.ts';
import { getUsage } from './usage.service.ts';

export function createTeacherUsageRouter(): Router {
  const router = ExpressRouter();

  router.get('/teacher/usage', requireRole('teacher'), async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    respond(res, TeacherUsageResponseSchema, await getUsage(teacherOf(req.user)));
  });

  return router;
}
