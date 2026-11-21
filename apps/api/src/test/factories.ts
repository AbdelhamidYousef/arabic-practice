import { createHash, randomBytes } from 'node:crypto';

import { db } from '../db/client.ts';
import {
  aiCalls,
  conversations,
  corrections,
  invites,
  lessonExercises,
  lessons,
  lessonVocab,
  messages,
  mistakes,
  units,
  users,
  vocabCards,
} from '../db/schema/index.ts';

// Unique suffix per call so factories can be used many times inside one test without colliding
// on slug / email unique constraints.
let counter = 0;
const next = () => ++counter;

function first<T>(rows: T[], what: string): T {
  const row = rows[0];
  if (!row) throw new Error(`factory: insert of ${what} returned no row`);
  return row;
}

export async function createUser(overrides: Partial<typeof users.$inferInsert> = {}) {
  const n = next();
  return first(
    await db
      .insert(users)
      .values({
        email: `user${n}@arabic-practice.test`,
        // Not a real hash: hashing with argon2 would slow every test; login tests hash on their own.
        passwordHash: 'test-hash',
        displayName: `Test User ${n}`,
        ...overrides,
      })
      .returning(),
    'user',
  );
}

export const createTeacher = (overrides: Partial<typeof users.$inferInsert> = {}) =>
  createUser({ role: 'teacher', displayName: 'Test Teacher', ...overrides });

export async function createLesson(
  overrides: Partial<typeof lessons.$inferInsert> & { teacherId?: string } = {},
) {
  const n = next();
  const teacherId = overrides.teacherId ?? (await createTeacher()).id;
  return first(
    await db
      .insert(lessons)
      .values({
        slug: `lesson-${n}`,
        title: `Lesson ${n}`,
        level: 'A1',
        topic: 'Greetings',
        summary: 'A made-up lesson for tests.',
        scenario: 'You are a friendly partner. Keep sentences short.',
        openingLine: 'مَرْحَبًا!',
        status: 'published',
        ...overrides,
        teacherId,
      })
      .returning(),
    'lesson',
  );
}

export async function createVocab(
  lessonId: string,
  overrides: Partial<typeof lessonVocab.$inferInsert> = {},
) {
  const n = next();
  return first(
    await db
      .insert(lessonVocab)
      .values({
        lessonId,
        arabic: 'كِتَابٌ',
        arabicPlain: `plain-${n}`,
        english: 'book',
        ...overrides,
      })
      .returning(),
    'lesson vocab',
  );
}

export async function createConversation(
  overrides: Partial<typeof conversations.$inferInsert> = {},
) {
  const userId = overrides.userId ?? (await createUser()).id;
  const lessonId = overrides.lessonId ?? (await createLesson()).id;
  return first(
    await db
      .insert(conversations)
      .values({ ...overrides, userId, lessonId })
      .returning(),
    'conversation',
  );
}

export async function createMessage(
  conversationId: string,
  overrides: Partial<typeof messages.$inferInsert> = {},
) {
  return first(
    await db
      .insert(messages)
      .values({ role: 'learner', text: 'أَنَا طَالِبٌ', ...overrides, conversationId })
      .returning(),
    'message',
  );
}

// The seeded demo teacher (read-only), which guests and the demo sign-in depend on.
export const createDemoTeacher = (overrides: Partial<typeof users.$inferInsert> = {}) =>
  createTeacher({
    email: 'demo-teacher@arabic-practice.test',
    displayName: 'Ustadh Demo',
    readOnly: true,
    passwordHash: '!unusable:test',
    ...overrides,
  });

// An invite plus the plain code (only its SHA-256 is stored, like in production).
export async function createInvite(
  teacherId: string,
  overrides: Partial<typeof invites.$inferInsert> = {},
) {
  const code = randomBytes(16).toString('base64url');
  const [row] = await db
    .insert(invites)
    .values({
      codeHash: createHash('sha256').update(code).digest('hex'),
      teacherId,
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000),
      maxUses: 1,
      ...overrides,
    })
    .returning();
  if (!row) throw new Error('factory: insert of invite returned no row');
  return { invite: row, code };
}

// A learner message with its correction and one mistake (tests that only need a mistake row).
export async function createMistake(
  conversationId: string,
  overrides: Partial<typeof mistakes.$inferInsert> & { userId: string; lessonId: string },
) {
  const message = await createMessage(conversationId);
  const correction = first(
    await db
      .insert(corrections)
      .values({ messageId: message.id, isCorrect: false, corrected: 'أَنَا طَالِبٌ' })
      .returning(),
    'correction',
  );
  return first(
    await db
      .insert(mistakes)
      .values({
        type: 'grammar',
        original: 'انا طالب',
        correction: 'أَنَا طَالِبٌ',
        explanation: 'Add the harakat.',
        ...overrides,
        correctionId: correction.id,
      })
      .returning(),
    'mistake',
  );
}

export async function createCard(
  userId: string,
  vocabId: string,
  overrides: Partial<typeof vocabCards.$inferInsert> = {},
) {
  return first(
    await db
      .insert(vocabCards)
      .values({ ...overrides, userId, vocabId })
      .returning(),
    'vocab card',
  );
}

export async function createAiCall(overrides: Partial<typeof aiCalls.$inferInsert> = {}) {
  return first(
    await db
      .insert(aiCalls)
      .values({
        purpose: 'reply',
        provider: 'fake',
        model: 'fake-model',
        status: 'ok',
        ...overrides,
      })
      .returning(),
    'ai call',
  );
}

export async function createUnit(overrides: Partial<typeof units.$inferInsert> = {}) {
  const n = next();
  return first(
    await db
      .insert(units)
      .values({
        level: 'A1',
        position: n,
        code: `A1.${n}`,
        title: `Unit ${n}`,
        summary: 'I can do a made-up thing.',
        ...overrides,
      })
      .returning(),
    'unit',
  );
}

// A `choose` exercise unless the caller passes its own data.
export async function createExercise(
  lessonId: string,
  overrides: Partial<typeof lessonExercises.$inferInsert> = {},
) {
  const n = next();
  return first(
    await db
      .insert(lessonExercises)
      .values({
        lessonId,
        position: n,
        type: 'choose',
        data: {
          type: 'choose',
          prompt: 'Which one is "book"?',
          options: ['كِتَابٌ', 'بَابٌ'],
          answer: 0,
        },
        ...overrides,
      })
      .returning(),
    'lesson exercise',
  );
}
