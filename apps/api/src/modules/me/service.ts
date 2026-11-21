import { and, asc, desc, eq, inArray } from 'drizzle-orm';

import { db } from '../../db/client.ts';
import {
  activityDays,
  conversations,
  corrections,
  lessonProgress,
  lessons,
  lessonVocab,
  messages,
  mistakes,
  users,
  vocabCards,
} from '../../db/schema/index.ts';
import { forbidden, notFound, wrongPassword } from '../../lib/errors.ts';
import { verify, verifyAgainstDummy } from '../../lib/password.ts';
import type { AuthUser } from '../auth/sessions.ts';

// "My data" is for a learner with an account. A guest has nothing worth taking (their rows delete
// themselves after a week) and no password to confirm with. A teacher's account owns the lessons
// every learner's chats hang off (`lessons.teacher_id` is ON DELETE RESTRICT on purpose), so it is
// closed by the operator after handing the lessons over, never by one click. The demo teacher is
// both a teacher and read-only.
export function assertOwnAccount(user: AuthUser): void {
  if (user.isGuest) throw forbidden('Guest sessions have no account data');
  if (user.role !== 'learner') throw forbidden('Teacher accounts are closed by the operator');
}

export interface DataExport {
  exportedAt: string;
  profile: {
    id: string;
    email: string | null;
    displayName: string;
    role: string;
    level: string;
    createdAt: string;
    lastSeenAt: string;
    teacherName: string | null;
  };
  conversations: {
    id: string;
    lessonSlug: string;
    lessonTitle: string;
    createdAt: string;
    turnCount: number;
    messages: {
      role: string;
      text: string;
      glossEn: string | null;
      createdAt: string;
      correction: { isCorrect: boolean; corrected: string; praise: string | null } | null;
    }[];
  }[];
  mistakes: {
    type: string;
    original: string;
    correction: string;
    explanation: string;
    lessonSlug: string;
    createdAt: string;
  }[];
  progress: {
    lessonSteps: { lessonSlug: string; step: string; score: number | null; completedAt: string }[];
    activityDays: { day: string; xp: number }[];
    vocabCards: {
      arabic: string;
      english: string;
      lessonSlug: string;
      box: number;
      dueAt: string;
      reviews: number;
      lapses: number;
      lastReviewedAt: string | null;
    }[];
  };
}

const iso = (d: Date) => d.toISOString();

// Every query below filters on the caller's own id (the user comes from the session, never from the
// URL), and nothing selects the password hash, the IP hash or another person's row. Only the
// learner's own chat text is included; the teacher's lesson text they practised is referenced by
// slug and title.
export async function exportData(user: AuthUser, now = new Date()): Promise<DataExport> {
  assertOwnAccount(user);
  const [me] = await db
    .select({
      id: users.id,
      email: users.email,
      displayName: users.displayName,
      role: users.role,
      level: users.level,
      createdAt: users.createdAt,
      lastSeenAt: users.lastSeenAt,
      teacherId: users.teacherId,
    })
    .from(users)
    .where(eq(users.id, user.id));
  if (!me) throw notFound('Account not found');

  const [teacher, convs, mistakeRows, steps, days, cards] = await Promise.all([
    me.teacherId
      ? db
          .select({ name: users.displayName })
          .from(users)
          .where(eq(users.id, me.teacherId))
          .then((r) => r[0]?.name ?? null)
      : Promise.resolve(null),
    db
      .select({
        id: conversations.id,
        lessonSlug: lessons.slug,
        lessonTitle: lessons.title,
        createdAt: conversations.createdAt,
        turnCount: conversations.turnCount,
      })
      .from(conversations)
      .innerJoin(lessons, eq(lessons.id, conversations.lessonId))
      .where(eq(conversations.userId, user.id))
      .orderBy(asc(conversations.createdAt), asc(conversations.id)),
    db
      .select({
        type: mistakes.type,
        original: mistakes.original,
        correction: mistakes.correction,
        explanation: mistakes.explanation,
        lessonSlug: lessons.slug,
        createdAt: mistakes.createdAt,
      })
      .from(mistakes)
      .innerJoin(lessons, eq(lessons.id, mistakes.lessonId))
      .where(eq(mistakes.userId, user.id))
      .orderBy(desc(mistakes.createdAt), desc(mistakes.id)),
    db
      .select({
        lessonSlug: lessons.slug,
        step: lessonProgress.step,
        score: lessonProgress.score,
        completedAt: lessonProgress.completedAt,
      })
      .from(lessonProgress)
      .innerJoin(lessons, eq(lessons.id, lessonProgress.lessonId))
      .where(eq(lessonProgress.userId, user.id))
      .orderBy(asc(lessonProgress.completedAt), asc(lessons.slug), asc(lessonProgress.step)),
    db
      .select({ day: activityDays.day, xp: activityDays.xp })
      .from(activityDays)
      .where(eq(activityDays.userId, user.id))
      .orderBy(asc(activityDays.day)),
    db
      .select({
        arabic: lessonVocab.arabic,
        english: lessonVocab.english,
        lessonSlug: lessons.slug,
        box: vocabCards.box,
        dueAt: vocabCards.dueAt,
        reviews: vocabCards.reviews,
        lapses: vocabCards.lapses,
        lastReviewedAt: vocabCards.lastReviewedAt,
      })
      .from(vocabCards)
      .innerJoin(lessonVocab, eq(lessonVocab.id, vocabCards.vocabId))
      .innerJoin(lessons, eq(lessons.id, lessonVocab.lessonId))
      .where(eq(vocabCards.userId, user.id))
      .orderBy(asc(lessons.slug), asc(lessonVocab.position)),
  ]);

  const convIds = convs.map((c) => c.id);
  const messageRows =
    convIds.length === 0
      ? []
      : await db
          .select({
            conversationId: messages.conversationId,
            role: messages.role,
            text: messages.text,
            glossEn: messages.glossEn,
            createdAt: messages.createdAt,
            isCorrect: corrections.isCorrect,
            corrected: corrections.corrected,
            praise: corrections.praise,
          })
          .from(messages)
          .leftJoin(corrections, eq(corrections.messageId, messages.id))
          .where(inArray(messages.conversationId, convIds))
          .orderBy(asc(messages.createdAt), asc(messages.id));

  return {
    exportedAt: iso(now),
    profile: {
      id: me.id,
      email: me.email,
      displayName: me.displayName,
      role: me.role,
      level: me.level,
      createdAt: iso(me.createdAt),
      lastSeenAt: iso(me.lastSeenAt),
      teacherName: teacher,
    },
    conversations: convs.map((c) => ({
      id: c.id,
      lessonSlug: c.lessonSlug,
      lessonTitle: c.lessonTitle,
      createdAt: iso(c.createdAt),
      turnCount: c.turnCount,
      messages: messageRows
        .filter((m) => m.conversationId === c.id)
        .map((m) => ({
          role: m.role,
          text: m.text,
          glossEn: m.glossEn,
          createdAt: iso(m.createdAt),
          correction:
            m.isCorrect === null || m.corrected === null
              ? null
              : { isCorrect: m.isCorrect, corrected: m.corrected, praise: m.praise },
        })),
    })),
    mistakes: mistakeRows.map((m) => ({ ...m, createdAt: iso(m.createdAt) })),
    progress: {
      lessonSteps: steps.map((s) => ({ ...s, completedAt: iso(s.completedAt) })),
      activityDays: days,
      vocabCards: cards.map((c) => ({
        ...c,
        dueAt: iso(c.dueAt),
        lastReviewedAt: c.lastReviewedAt ? iso(c.lastReviewedAt) : null,
      })),
    },
  };
}

// Deleting the account is the one place a password is asked for again (a stolen session alone must
// not be able to erase someone). The row delete does the rest: sessions, conversations (and through
// them messages, corrections and mistakes), vocab cards, progress, activity days and reset links
// all cascade; `ai_calls` keep their cost but lose the user and conversation ids (SET NULL), so the
// money record outlives the person without pointing at them. The role is in the WHERE as well, so
// this can never remove a teacher.
export async function deleteAccount(user: AuthUser, password: string): Promise<void> {
  assertOwnAccount(user);
  const [row] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, user.id));
  const ok = row?.passwordHash
    ? await verify(row.passwordHash, password)
    : await verifyAgainstDummy(password);
  if (!ok) throw wrongPassword();
  await db.delete(users).where(and(eq(users.id, user.id), eq(users.role, 'learner')));
}
