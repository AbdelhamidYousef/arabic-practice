import { db } from '../db/client.ts';
import { lessons, lessonVocab, users } from '../db/schema/index.ts';

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
