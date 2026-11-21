import { randomBytes } from 'node:crypto';

import type {
  CefrLevel,
  CreateResetLinkResponse,
  MistakeType,
  TeacherLearner,
  TeacherLearnerDetailResponse,
  TeacherLearnerListResponse,
  TeacherTranscriptResponse,
} from '@arabic/shared';
import { and, asc, count, desc, eq, gte, inArray, isNull, max } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import {
  conversations,
  corrections,
  lessons,
  messages,
  mistakes,
  passwordResets,
  users,
} from '../../db/schema/index.ts';
import { notFound } from '../../lib/errors.ts';
import { sha256, type AuthUser } from '../auth/sessions.ts';
import { mistakesByType, recentMistakes } from '../progress/service.ts';
import { isoWeekStart } from '../progress/weeks.ts';

const TOP_TYPES = 3;

// Ownership: a learner is mine when `teacher_id` is me. It is in every query below, so another
// teacher's learner (or a teacher's id, or a random id) is the same 404.
// Guests are never anyone's learners to look at: they all hang off the public demo teacher, so
// without `is_guest = false` any visitor could open every guest's chats through the demo login.
const myLearner = (teacher: AuthUser, id: string) =>
  and(
    eq(users.id, id),
    eq(users.teacherId, teacher.id),
    eq(users.role, 'learner'),
    eq(users.isGuest, false),
  );

const learnerColumns = {
  id: users.id,
  displayName: users.displayName,
  email: users.email,
  level: users.level,
  createdAt: users.createdAt,
  lastSeenAt: users.lastSeenAt,
};

const toLearner = (row: {
  id: string;
  displayName: string;
  email: string | null;
  level: CefrLevel;
  createdAt: Date;
  lastSeenAt: Date;
}): TeacherLearner => ({
  ...row,
  createdAt: row.createdAt.toISOString(),
  lastSeenAt: row.lastSeenAt.toISOString(),
});

async function loadLearner(teacher: AuthUser, id: string): Promise<TeacherLearner> {
  const [row] = await db.select(learnerColumns).from(users).where(myLearner(teacher, id));
  if (!row) throw notFound('Learner not found');
  return toLearner(row);
}

export async function listLearners(
  teacher: AuthUser,
  now = new Date(),
): Promise<TeacherLearnerListResponse> {
  // Guests (visitors of the public demo) belong to the demo teacher but are not students.
  const mine = and(
    eq(users.teacherId, teacher.id),
    eq(users.role, 'learner'),
    eq(users.isGuest, false),
  );

  const [people, activity, turns, mistakeRows] = await Promise.all([
    db
      .select({
        id: users.id,
        displayName: users.displayName,
        email: users.email,
        level: users.level,
      })
      .from(users)
      .where(mine)
      .orderBy(asc(users.displayName), asc(users.id)),
    db
      .select({ userId: conversations.userId, last: max(conversations.lastMessageAt) })
      .from(conversations)
      .innerJoin(users, eq(users.id, conversations.userId))
      .where(mine)
      .groupBy(conversations.userId),
    db
      .select({ userId: conversations.userId, n: count() })
      .from(messages)
      .innerJoin(conversations, eq(conversations.id, messages.conversationId))
      .innerJoin(users, eq(users.id, conversations.userId))
      .where(and(mine, eq(messages.role, 'learner'), gte(messages.createdAt, isoWeekStart(now))))
      .groupBy(conversations.userId),
    db
      .select({ userId: mistakes.userId, type: mistakes.type, n: count() })
      .from(mistakes)
      .innerJoin(users, eq(users.id, mistakes.userId))
      .where(mine)
      .groupBy(mistakes.userId, mistakes.type),
  ]);

  const lastBy = new Map(activity.map((r) => [r.userId, r.last]));
  const turnsBy = new Map(turns.map((r) => [r.userId, r.n]));
  const typesBy = new Map<string, { type: MistakeType; count: number }[]>();
  for (const r of mistakeRows) {
    const list = typesBy.get(r.userId) ?? [];
    list.push({ type: r.type, count: r.n });
    typesBy.set(r.userId, list);
  }

  return {
    learners: people.map((p) => ({
      ...p,
      lastActivityAt: lastBy.get(p.id)?.toISOString() ?? null,
      turnsThisWeek: turnsBy.get(p.id) ?? 0,
      topMistakeTypes: (typesBy.get(p.id) ?? [])
        .sort((a, b) => b.count - a.count || a.type.localeCompare(b.type))
        .slice(0, TOP_TYPES),
    })),
  };
}

export async function setLearnerLevel(
  teacher: AuthUser,
  id: string,
  level: CefrLevel,
): Promise<TeacherLearner> {
  const [row] = await db
    .update(users)
    .set({ level })
    .where(myLearner(teacher, id))
    .returning(learnerColumns);
  if (!row) throw notFound('Learner not found');
  return toLearner(row);
}

export async function getLearner(
  teacher: AuthUser,
  id: string,
): Promise<TeacherLearnerDetailResponse> {
  const learner = await loadLearner(teacher, id);
  const [convs, byType, recent] = await Promise.all([
    db
      .select({
        id: conversations.id,
        lessonId: conversations.lessonId,
        lessonTitle: lessons.title,
        turnCount: conversations.turnCount,
        lastMessageAt: conversations.lastMessageAt,
        createdAt: conversations.createdAt,
      })
      .from(conversations)
      .innerJoin(lessons, eq(lessons.id, conversations.lessonId))
      .where(eq(conversations.userId, learner.id))
      .orderBy(desc(conversations.lastMessageAt), desc(conversations.id)),
    mistakesByType(learner.id),
    recentMistakes(learner.id),
  ]);
  return {
    learner,
    conversations: convs.map((c) => ({
      ...c,
      lastMessageAt: c.lastMessageAt.toISOString(),
      createdAt: c.createdAt.toISOString(),
    })),
    mistakesByType: byType,
    recentMistakes: recent,
  };
}

export async function getTranscript(
  teacher: AuthUser,
  conversationId: string,
): Promise<TeacherTranscriptResponse> {
  // The join to users carries the ownership check: the conversation's learner must be mine.
  const [conv] = await db
    .select({
      id: conversations.id,
      turnCount: conversations.turnCount,
      createdAt: conversations.createdAt,
      lessonTitle: lessons.title,
      learnerId: users.id,
      learnerName: users.displayName,
    })
    .from(conversations)
    .innerJoin(users, eq(users.id, conversations.userId))
    .innerJoin(lessons, eq(lessons.id, conversations.lessonId))
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(users.teacherId, teacher.id),
        eq(users.role, 'learner'),
        eq(users.isGuest, false),
      ),
    );
  if (!conv) throw notFound('Conversation not found');

  const rows = await db
    .select({
      id: messages.id,
      role: messages.role,
      text: messages.text,
      glossEn: messages.glossEn,
      createdAt: messages.createdAt,
      correctionId: corrections.id,
      isCorrect: corrections.isCorrect,
      corrected: corrections.corrected,
      praise: corrections.praise,
    })
    .from(messages)
    .leftJoin(corrections, eq(corrections.messageId, messages.id))
    .where(eq(messages.conversationId, conv.id))
    .orderBy(asc(messages.createdAt), asc(messages.id));

  const correctionIds = rows.flatMap((r) => (r.correctionId ? [r.correctionId] : []));
  const mistakeRows =
    correctionIds.length === 0
      ? []
      : await db
          .select({
            id: mistakes.id,
            correctionId: mistakes.correctionId,
            type: mistakes.type,
            original: mistakes.original,
            correction: mistakes.correction,
            explanation: mistakes.explanation,
          })
          .from(mistakes)
          .where(inArray(mistakes.correctionId, correctionIds))
          .orderBy(asc(mistakes.createdAt), asc(mistakes.id));

  return {
    conversation: {
      id: conv.id,
      lessonTitle: conv.lessonTitle,
      learner: { id: conv.learnerId, displayName: conv.learnerName },
      turnCount: conv.turnCount,
      createdAt: conv.createdAt.toISOString(),
    },
    messages: rows.map((r) => ({
      id: r.id,
      role: r.role,
      text: r.text,
      glossEn: r.glossEn,
      createdAt: r.createdAt.toISOString(),
      correction:
        r.correctionId && r.isCorrect !== null && r.corrected !== null
          ? {
              isCorrect: r.isCorrect,
              corrected: r.corrected,
              praise: r.praise,
              mistakes: mistakeRows
                .filter((m) => m.correctionId === r.correctionId)
                .map(({ correctionId: _ignored, ...m }) => m),
            }
          : null,
    })),
  };
}

export const RESET_LINK_TTL_MS = 24 * 3600 * 1000;

// A one-time link for one of MY learners (the same ownership rule as every query above: someone
// else's learner, a teacher, a guest or a random id is the same 404). The learner has no email we
// could send it to, so the teacher passes it on by chat. A new link replaces the unused older ones,
// so there is only ever one live link per learner.
export async function createResetLink(
  teacher: AuthUser,
  learnerId: string,
  now = new Date(),
): Promise<CreateResetLinkResponse> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(now.getTime() + RESET_LINK_TTL_MS);
  await db.transaction(async (tx) => {
    // Locks the learner's row (and proves ownership) so two parallel requests cannot both pass.
    const [owned] = await tx
      .select({ id: users.id })
      .from(users)
      .where(myLearner(teacher, learnerId))
      .for('update');
    if (!owned) throw notFound('Learner not found');
    await tx
      .delete(passwordResets)
      .where(and(eq(passwordResets.userId, owned.id), isNull(passwordResets.usedAt)));
    await tx.insert(passwordResets).values({
      tokenHash: sha256(token),
      userId: owned.id,
      createdBy: teacher.id,
      expiresAt,
    });
  });
  return { resetPath: `/reset/${token}`, expiresAt: expiresAt.toISOString() };
}
