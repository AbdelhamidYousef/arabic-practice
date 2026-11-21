import { and, eq } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import { lessons } from '../../db/schema/index.ts';
import { notFound } from '../../lib/errors.ts';
import type { AuthUser } from '../auth/sessions.ts';

// Whose lessons a person sees: a learner sees their teacher's, a teacher sees their own. A learner
// whose teacher was deleted (teacher_id set null) sees none. This is the ownership rule: it goes
// into every WHERE clause, so a lesson of another teacher is simply "not found".
export function visibleTeacherId(user: AuthUser): string | null {
  return user.role === 'teacher' ? user.id : user.teacherId;
}

// A published lesson of the person's teacher, or the one 404 used for missing, foreign and draft.
export async function findVisibleLessonId(user: AuthUser, slug: string): Promise<string> {
  const teacherId = visibleTeacherId(user);
  if (!teacherId) throw notFound('Lesson not found');
  const [lesson] = await db
    .select({ id: lessons.id })
    .from(lessons)
    .where(
      and(
        eq(lessons.slug, slug),
        eq(lessons.teacherId, teacherId),
        eq(lessons.status, 'published'),
      ),
    );
  if (!lesson) throw notFound('Lesson not found');
  return lesson.id;
}
