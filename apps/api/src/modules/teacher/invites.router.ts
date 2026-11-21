import {
  CreateInviteRequestSchema,
  CreateInviteResponseSchema,
  InviteListResponseSchema,
} from '@arabic/shared';
import { Router as ExpressRouter, type Router } from 'express';

import { respond, valid, validate } from '../../lib/validate.ts';
import { forbidReadOnly, requireRole } from '../../middleware/auth.ts';

import * as service from './invites.service.ts';
import { teacherOf } from './teacher-of.ts';

export function createTeacherInvitesRouter(): Router {
  const router = ExpressRouter();
  const teacherOnly = requireRole('teacher');
  const create = { body: CreateInviteRequestSchema };

  router.get('/teacher/invites', teacherOnly, async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    respond(res, InviteListResponseSchema, await service.listInvites(teacherOf(req.user)));
  });

  router.post(
    '/teacher/invites',
    teacherOnly,
    forbidReadOnly,
    validate(create),
    async (req, res) => {
      const { body } = valid(req, create);
      // The plain code is in this one response; make sure no cache keeps it.
      res.setHeader('Cache-Control', 'no-store');
      res.status(201);
      respond(
        res,
        CreateInviteResponseSchema,
        await service.createInvite(teacherOf(req.user), body),
      );
    },
  );

  return router;
}
