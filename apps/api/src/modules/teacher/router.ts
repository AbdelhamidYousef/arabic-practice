import { Router as ExpressRouter, type Router } from 'express';

import { createTeacherLessonsRouter } from './lessons.router.ts';

// Everything under /teacher: each sub-router guards its own routes (role teacher; mutations also
// forbidReadOnly), so a route added later cannot forget the role check by living in this file.
export function createTeacherRouter(): Router {
  const router = ExpressRouter();
  router.use(createTeacherLessonsRouter());
  return router;
}
