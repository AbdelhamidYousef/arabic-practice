import { createHash, randomBytes } from 'node:crypto';

import { db } from '../db/client.ts';
import {
  conversations,
  invites,
  lessons,
  lessonVocab,
  messages,
  users,
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
