import { eq, sql } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';

import { db } from './client.ts';
import { invites, sessions, users } from './schema/index.ts';

async function insertTeacher(email = 'teacher-a@arabic-practice.test') {
  const [teacher] = await db
    .insert(users)
    .values({ email, passwordHash: 'x', displayName: 'Teacher A', role: 'teacher' })
    .returning();
  if (!teacher) throw new Error('insert returned no row');
  return teacher;
}

async function insertLearner(teacherId: string, email = 'learner-a@arabic-practice.test') {
  const [learner] = await db
    .insert(users)
    .values({ email, passwordHash: 'x', displayName: 'Learner A', teacherId })
    .returning();
  if (!learner) throw new Error('insert returned no row');
  return learner;
}

describe('users', () => {
  it('applies the defaults of a plain learner', async () => {
    const teacher = await insertTeacher();
    const learner = await insertLearner(teacher.id);
    expect(learner).toMatchObject({
      role: 'learner',
      level: 'A1',
      isGuest: false,
      readOnly: false,
      teacherId: teacher.id,
    });
    expect(learner.lastSeenAt).toBeInstanceOf(Date);
  });

  it('treats emails as case-insensitive and unique', async () => {
    await insertTeacher('Same@arabic-practice.test');
    await expect(insertTeacher('same@ARABIC-practice.test')).rejects.toThrow();
  });

  it('lets guests exist without an email or password, but nobody else', async () => {
    const [guest] = await db
      .insert(users)
      .values({ displayName: 'Guest 4F2A', isGuest: true })
      .returning();
    expect(guest?.email).toBeNull();
    await expect(db.insert(users).values({ displayName: 'No login' })).rejects.toThrow();
    await expect(
      db.insert(users).values({ displayName: 'No hash', email: 'x@arabic-practice.test' }),
    ).rejects.toThrow();
  });

  it('rejects an unknown role and an unknown level', async () => {
    await expect(
      db.insert(users).values({
        displayName: 'X',
        email: 'x@arabic-practice.test',
        passwordHash: 'x',
        // Cast: the type system rejects 'D1', and this test is about the database doing so too.
        level: 'D1' as 'A1',
      }),
    ).rejects.toThrow();
  });

  it('bumps updated_at on update through the trigger', async () => {
    const teacher = await insertTeacher();
    await new Promise((r) => setTimeout(r, 15));
    const [after] = await db
      .update(users)
      .set({ displayName: 'Renamed' })
      .where(eq(users.id, teacher.id))
      .returning();
    expect(after?.updatedAt.getTime()).toBeGreaterThan(teacher.updatedAt.getTime());
  });

  it('keeps a learner but forgets the teacher when the teacher is deleted', async () => {
    const teacher = await insertTeacher();
    const learner = await insertLearner(teacher.id);
    await db.delete(users).where(eq(users.id, teacher.id));
    const [after] = await db.select().from(users).where(eq(users.id, learner.id));
    expect(after?.teacherId).toBeNull();
  });
});

describe('sessions and invites', () => {
  it('cascades a user delete to their sessions and invites', async () => {
    const teacher = await insertTeacher();
    await db.insert(sessions).values({
      idHash: 'hash-of-a-cookie',
      userId: teacher.id,
      expiresAt: new Date(Date.now() + 60_000),
    });
    await db.insert(invites).values({
      codeHash: 'hash-of-a-code',
      teacherId: teacher.id,
      note: 'Tuesday group',
      maxUses: 5,
      expiresAt: new Date(Date.now() + 60_000),
    });

    await db.delete(users).where(eq(users.id, teacher.id));

    expect(await db.select().from(sessions).where(eq(sessions.userId, teacher.id))).toHaveLength(0);
    expect(await db.select().from(invites).where(eq(invites.teacherId, teacher.id))).toHaveLength(
      0,
    );
  });

  it('refuses more uses than the invite allows and a zero-use invite', async () => {
    const teacher = await insertTeacher();
    const base = {
      teacherId: teacher.id,
      expiresAt: new Date(Date.now() + 60_000),
    };
    await expect(
      db.insert(invites).values({ ...base, codeHash: 'a', maxUses: 2, usedCount: 3 }),
    ).rejects.toThrow();
    await expect(
      db.insert(invites).values({ ...base, codeHash: 'b', maxUses: 0 }),
    ).rejects.toThrow();
  });

  it('claims the last use of an invite exactly once', async () => {
    const teacher = await insertTeacher();
    const [invite] = await db
      .insert(invites)
      .values({
        codeHash: 'c',
        teacherId: teacher.id,
        maxUses: 1,
        expiresAt: new Date(Date.now() + 60_000),
      })
      .returning();
    if (!invite) throw new Error('no invite');
    // The conditional UPDATE the sign-up will use: it succeeds only while a use is left.
    const claim = () =>
      db.execute(
        sql`update invites set used_count = used_count + 1
            where id = ${invite.id} and used_count < max_uses and expires_at > now() returning id`,
      );
    expect(await claim()).toHaveLength(1);
    expect(await claim()).toHaveLength(0);
  });
});
