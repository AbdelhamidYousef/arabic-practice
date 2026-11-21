import { fileURLToPath } from 'node:url';

import { countLatin, harakatRatio, normalizeArabic, tokenizeArabic } from '@arabic/shared';
import { and, eq, inArray, notInArray } from 'drizzle-orm';

import { env } from '../../config/env.ts';
import { hash, unusablePasswordHash } from '../../lib/password.ts';
import { closeDb, db } from '../client.ts';
import {
  aiCalls,
  conversations,
  corrections,
  lessons,
  lessonVocab,
  messages,
  mistakes,
  users,
  type LevelMetrics,
} from '../schema/index.ts';

import { seedConversations } from './conversations.ts';
import { seedCourse, type CourseSeedSummary } from './course.ts';
import { seedLessons } from './lessons.ts';
import { DEFAULT_DEV_TEACHER_PASSWORD, DEMO_TEACHER, DEV_TEACHER, demoLearners } from './users.ts';
import { validateLessons } from './validate.ts';

export interface SeedOptions {
  nodeEnv?: 'development' | 'test' | 'production';
  /** Password of the dev teacher; ignored in production, where that account is not created. */
  teacherPassword?: string | undefined;
}

export interface SeedSummary {
  lessons: number;
  vocab: number;
  learners: number;
  conversations: number;
  devTeacher: boolean;
  course: CourseSeedSummary;
}

// What the partner prompt will later measure live (phase 5); computed here from the same shared
// helpers so the seeded partner messages carry real numbers.
function levelMetrics(text: string, lessonPlainWords: Set<string>): LevelMetrics {
  const words = tokenizeArabic(text);
  const sentences = text.split(/[.!؟?]+/).filter((s) => tokenizeArabic(s).length > 0);
  return {
    words: words.length,
    sentences: sentences.length,
    longestSentence: Math.max(0, ...sentences.map((s) => tokenizeArabic(s).length)),
    harakatRatio: Number(harakatRatio(text).toFixed(2)),
    lessonVocabHits: words.filter((w) => lessonPlainWords.has(normalizeArabic(w))).length,
    latinChars: countLatin(text),
  };
}

// Idempotent: run it as often as you like. Users and lessons are upserted by email and slug; the
// demo class's conversations are rebuilt from scratch each time (they are fixtures, not data).
export async function runSeed(options: SeedOptions = {}): Promise<SeedSummary> {
  const nodeEnv = options.nodeEnv ?? env.NODE_ENV;
  // Checked before anything is written: a bad edit to the lesson data fails here, not half-way.
  const lessonData = validateLessons(seedLessons);

  // The demo teacher: read-only, and with no usable password (the public demo signs in through
  // POST /auth/demo-teacher, which needs none).
  const [demoTeacher] = await db
    .insert(users)
    .values({
      email: DEMO_TEACHER.email,
      passwordHash: unusablePasswordHash(),
      displayName: DEMO_TEACHER.displayName,
      role: 'teacher',
      readOnly: true,
      level: 'C2',
    })
    .onConflictDoUpdate({
      target: users.email,
      set: { displayName: DEMO_TEACHER.displayName, role: 'teacher', readOnly: true },
    })
    .returning();
  if (!demoTeacher) throw new Error('seed: demo teacher upsert returned no row');

  // A teacher login with a known password exists only outside production.
  const devTeacher = nodeEnv !== 'production';
  if (devTeacher) {
    const passwordHash = await hash(options.teacherPassword ?? DEFAULT_DEV_TEACHER_PASSWORD);
    await db
      .insert(users)
      .values({
        email: DEV_TEACHER.email,
        passwordHash,
        displayName: DEV_TEACHER.displayName,
        role: 'teacher',
        level: 'C2',
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { passwordHash, displayName: DEV_TEACHER.displayName },
      });
  }

  const learners = new Map<string, string>();
  for (const l of demoLearners) {
    const [row] = await db
      .insert(users)
      .values({
        email: l.email,
        passwordHash: unusablePasswordHash(),
        displayName: l.displayName,
        role: 'learner',
        teacherId: demoTeacher.id,
        level: l.level,
      })
      .onConflictDoUpdate({
        target: users.email,
        set: { displayName: l.displayName, teacherId: demoTeacher.id, level: l.level },
      })
      .returning({ id: users.id });
    if (!row) throw new Error(`seed: learner ${l.email} upsert returned no row`);
    learners.set(l.email, row.id);
  }

  // Lessons belong to the demo teacher: guests and the made-up class both point at that teacher,
  // so these are the lessons they see.
  const lessonIds = new Map<string, string>();
  const plainWordsBySlug = new Map<string, Set<string>>();
  let vocabCount = 0;
  for (const [index, lesson] of lessonData.entries()) {
    const values = {
      teacherId: demoTeacher.id,
      slug: lesson.slug,
      title: lesson.title,
      level: lesson.level,
      topic: lesson.topic,
      summary: lesson.summary,
      goals: lesson.goals,
      grammarFocus: lesson.grammarFocus,
      scenario: lesson.scenario,
      openingLine: lesson.openingLine,
      status: 'published' as const,
      position: index + 1,
    };
    const [row] = await db
      .insert(lessons)
      .values(values)
      .onConflictDoUpdate({ target: lessons.slug, set: values })
      .returning({ id: lessons.id });
    if (!row) throw new Error(`seed: lesson ${lesson.slug} upsert returned no row`);
    lessonIds.set(lesson.slug, row.id);

    const vocabRows = lesson.vocab.map((v, position) => ({
      lessonId: row.id,
      arabic: v.arabic,
      arabicPlain: normalizeArabic(v.arabic),
      english: v.english,
      note: v.note ?? null,
      position: position + 1,
    }));
    for (const v of vocabRows) {
      await db
        .insert(lessonVocab)
        .values(v)
        .onConflictDoUpdate({
          target: [lessonVocab.lessonId, lessonVocab.arabicPlain],
          set: { arabic: v.arabic, english: v.english, note: v.note, position: v.position },
        });
    }
    // An entry removed from the data disappears from the database too.
    await db.delete(lessonVocab).where(
      and(
        eq(lessonVocab.lessonId, row.id),
        notInArray(
          lessonVocab.arabicPlain,
          vocabRows.map((v) => v.arabicPlain),
        ),
      ),
    );
    vocabCount += vocabRows.length;
    plainWordsBySlug.set(lesson.slug, new Set(vocabRows.map((v) => v.arabicPlain)));
  }

  // The course (units, content lessons, exercises) from the content files, next to the old lessons.
  const course = await seedCourse(demoTeacher.id);

  // The class's conversations are rebuilt each run, so the seed is repeatable and a changed
  // fixture replaces the old one. Deleting a conversation cascades to its messages, corrections
  // and mistakes. The seeded usage rows are removed with them.
  const learnerIds = [...learners.values()];
  const conversationCount = await db.transaction(async (tx) => {
    await tx.delete(aiCalls).where(inArray(aiCalls.userId, learnerIds));
    await tx.delete(conversations).where(inArray(conversations.userId, learnerIds));

    const DAY = 24 * 60 * 60 * 1000;
    const now = Date.now();
    for (const c of seedConversations) {
      const userId = learners.get(c.learner);
      const lessonId = lessonIds.get(c.lessonSlug);
      const lesson = lessonData.find((l) => l.slug === c.lessonSlug);
      if (!userId || !lessonId || !lesson)
        throw new Error(`seed: bad conversation ${c.lessonSlug}`);
      const plainWords = plainWordsBySlug.get(c.lessonSlug) ?? new Set<string>();
      let at = now - c.daysAgo * DAY;
      const tick = () => new Date((at += 60_000));

      const [conversation] = await tx
        .insert(conversations)
        .values({ userId, lessonId, turnCount: c.turns.length, createdAt: new Date(at) })
        .returning({ id: conversations.id });
      if (!conversation) throw new Error('seed: conversation insert returned no row');
      const conversationId = conversation.id;

      await tx.insert(messages).values({
        conversationId,
        role: 'partner',
        text: lesson.openingLine,
        levelMetrics: levelMetrics(lesson.openingLine, plainWords),
        createdAt: tick(),
      });

      for (const turn of c.turns) {
        const [learnerMessage] = await tx
          .insert(messages)
          .values({ conversationId, role: 'learner', text: turn.learner, createdAt: tick() })
          .returning({ id: messages.id });
        if (!learnerMessage) throw new Error('seed: message insert returned no row');
        const [correction] = await tx
          .insert(corrections)
          .values({
            messageId: learnerMessage.id,
            isCorrect: turn.mistakes.length === 0,
            corrected: turn.corrected,
            praise: turn.praise ?? null,
            createdAt: new Date(at),
          })
          .returning({ id: corrections.id });
        if (!correction) throw new Error('seed: correction insert returned no row');
        if (turn.mistakes.length > 0) {
          await tx.insert(mistakes).values(
            turn.mistakes.map((m) => ({
              correctionId: correction.id,
              userId,
              lessonId,
              type: m.type,
              original: m.original,
              correction: m.correction,
              explanation: m.explanation,
              createdAt: new Date(at),
            })),
          );
        }
        await tx.insert(messages).values({
          conversationId,
          role: 'partner',
          text: turn.partner,
          levelMetrics: levelMetrics(turn.partner, plainWords),
          createdAt: tick(),
        });

        // Made-up usage for the teacher's usage page: one correction and one reply per turn.
        // Always at least a day old, so it never counts against today's caps.
        for (const purpose of ['correction', 'reply'] as const) {
          await tx.insert(aiCalls).values({
            userId,
            conversationId,
            purpose,
            provider: 'gemini',
            model: purpose === 'correction' ? env.AI_MODEL_CORRECTION : env.AI_MODEL_REPLY,
            inputTokens: purpose === 'correction' ? 540 : 460,
            outputTokens: purpose === 'correction' ? 190 : 60,
            latencyMs: purpose === 'correction' ? 1400 : 900,
            costMicroUsd: 0,
            status: 'ok',
            createdAt: new Date(at),
          });
        }
      }
      await tx
        .update(conversations)
        .set({ lastMessageAt: new Date(at) })
        .where(eq(conversations.id, conversationId));
    }
    return seedConversations.length;
  });

  return {
    lessons: lessonData.length,
    vocab: vocabCount,
    learners: learners.size,
    conversations: conversationCount,
    devTeacher,
    course,
  };
}

// Only run when executed directly (`pnpm db:seed`), not when imported by reset.ts or the tests.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = await runSeed({ teacherPassword: env.SEED_TEACHER_PASSWORD });
  await closeDb();
  console.log(
    `seeded ${summary.lessons} lessons (${summary.vocab} vocabulary items), ` +
      `${summary.learners} learners, ${summary.conversations} conversations; ` +
      `course: ${summary.course.units} units, ${summary.course.lessons} lessons, ` +
      `${summary.course.exercises} exercises`,
  );
}
