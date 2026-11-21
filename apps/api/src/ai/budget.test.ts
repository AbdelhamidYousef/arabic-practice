import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { db } from '../db/client.ts';
import { aiCalls } from '../db/schema/index.ts';
import { createUser } from '../test/factories.ts';

import { createGuardedGateway, type BudgetLimits } from './budget.ts';
import { FakeProvider } from './fake.ts';
import { createLedgeredGateway } from './usage.ts';

const NOW = new Date('2026-11-21T12:00:00Z');
const schema = z.looseObject({});
const MODEL = 'gemini-3.5-flash-lite';
const base = {
  model: MODEL,
  system: 's',
  maxOutputTokens: 50,
  messages: [{ role: 'user' as const, text: 'مرحبا' }],
};

const limits = (over: Partial<BudgetLimits> = {}): BudgetLimits => ({
  enabled: true,
  tier: 'free',
  turnsPerLearnerPerDay: 3,
  turnsPerGuestPerDay: 1,
  glossPerLearnerPerDay: 3,
  glossPerGuestPerDay: 1,
  callsPerModelPerDay: 5,
  monthlyBudgetUsd: 0,
  ...over,
});

function setup(over: Partial<BudgetLimits> = {}) {
  const fake = new FakeProvider();
  const tier = over.tier ?? 'free';
  const inner = createLedgeredGateway({ provider: fake, db, tier, now: () => NOW });
  return { fake, gw: createGuardedGateway({ inner, db, limits: limits(over), now: () => NOW }) };
}

type Row = typeof aiCalls.$inferInsert;
const seed = (rows: Partial<Row>[]) =>
  db.insert(aiCalls).values(
    rows.map((r) => ({
      purpose: 'reply' as const,
      provider: 'fake',
      model: MODEL,
      status: 'ok' as const,
      createdAt: NOW,
      ...r,
    })),
  );
const call = (
  gw: ReturnType<typeof setup>['gw'],
  userId: string,
  purpose: 'reply' | 'correction' | 'gloss' = 'correction',
  isGuest = false,
) => gw.generateJson({ userId, isGuest }, { ...base, purpose, schema });

describe('kill switch', () => {
  it('answers AI_DISABLED without contacting the provider and records a limited row', async () => {
    const { gw, fake } = setup({ enabled: false });
    const u = await createUser();
    await expect(call(gw, u.id)).rejects.toMatchObject({ code: 'AI_DISABLED' });
    expect(fake.requests).toHaveLength(0);
    const rows = await db.select().from(aiCalls);
    expect(rows).toMatchObject([{ status: 'limited', errorCode: 'AI_DISABLED' }]);
  });
});

describe('turns per user', () => {
  it('allows the last turn and refuses the next (boundary), for correction and reply alike', async () => {
    const { gw, fake } = setup();
    const u = await createUser();
    await seed([{ userId: u.id }, { userId: u.id }]); // 2 turns used, limit 3
    await expect(call(gw, u.id, 'correction')).resolves.toBeDefined();
    await seed([{ userId: u.id }]); // now 3
    await expect(call(gw, u.id, 'correction')).rejects.toMatchObject({
      code: 'AI_LIMIT_USER',
      status: 429,
    });
    await expect(
      gw.streamText({ userId: u.id }, { ...base, purpose: 'reply' }),
    ).rejects.toMatchObject({ code: 'AI_LIMIT_USER' });
    expect(fake.requests).toHaveLength(1);
  });

  it('counts only replies, only this user, only today (UTC), and not refused calls', async () => {
    const { gw } = setup();
    const u = await createUser();
    const other = await createUser();
    await seed([
      { userId: u.id, purpose: 'correction' },
      { userId: u.id, purpose: 'gloss' },
      { userId: other.id },
      { userId: u.id, createdAt: new Date('2026-11-20T23:59:59Z') },
      { userId: u.id, status: 'limited' },
    ]);
    await expect(call(gw, u.id)).resolves.toBeDefined();
  });

  it('uses the smaller guest allowance', async () => {
    const { gw } = setup();
    const g = await createUser({ isGuest: true });
    await seed([{ userId: g.id }]);
    await expect(call(gw, g.id, 'correction', true)).rejects.toMatchObject({
      code: 'AI_LIMIT_USER',
    });
    await expect(call(gw, g.id, 'correction', false)).resolves.toBeDefined();
  });

  it('does not apply the turn cap to gloss', async () => {
    const { gw } = setup();
    const u = await createUser();
    await seed(Array.from({ length: 3 }, () => ({ userId: u.id })));
    await expect(call(gw, u.id, 'gloss')).resolves.toBeDefined();
  });
});

describe('gloss per user', () => {
  it('allows the last gloss, refuses the next with AI_LIMIT_USER, and uses the smaller guest allowance', async () => {
    const { gw, fake } = setup();
    const u = await createUser();
    await seed(Array.from({ length: 2 }, () => ({ userId: u.id, purpose: 'gloss' as const })));
    await expect(call(gw, u.id, 'gloss')).resolves.toBeDefined(); // 3rd of 3
    await expect(call(gw, u.id, 'gloss')).rejects.toMatchObject({
      code: 'AI_LIMIT_USER',
      status: 429,
    });
    expect(fake.requests).toHaveLength(1);

    const g = await createUser({ isGuest: true });
    await seed([{ userId: g.id, purpose: 'gloss' }]);
    await expect(call(gw, g.id, 'gloss', true)).rejects.toMatchObject({ code: 'AI_LIMIT_USER' });
  });

  it('counts only this user’s glosses today, and not turns or refused calls', async () => {
    const { gw } = setup();
    const u = await createUser();
    const other = await createUser();
    await seed([
      { userId: u.id, purpose: 'reply' },
      { userId: u.id, purpose: 'correction' },
      { userId: other.id, purpose: 'gloss' },
      { userId: u.id, purpose: 'gloss', status: 'limited' },
      { userId: u.id, purpose: 'gloss', createdAt: new Date('2026-11-20T23:59:59Z') },
    ]);
    await expect(call(gw, u.id, 'gloss')).resolves.toBeDefined();
  });
});

describe('calls per model', () => {
  it('refuses at the cap with AI_LIMIT_GLOBAL, and counts only that model', async () => {
    const { gw } = setup();
    const u = await createUser();
    await seed(
      Array.from({ length: 4 }, () => ({ purpose: 'gloss' as const, model: 'other-model' })),
    );
    await seed(Array.from({ length: 4 }, () => ({ purpose: 'gloss' as const })));
    await expect(call(gw, u.id, 'gloss')).resolves.toBeDefined(); // 4 used of 5 -> 5th allowed
    await expect(call(gw, u.id, 'gloss')).rejects.toMatchObject({ code: 'AI_LIMIT_GLOBAL' });
  });

  it('counts failed provider calls (they use quota) but not refused ones, and resets at UTC midnight', async () => {
    const { gw } = setup();
    const u = await createUser();
    await seed([
      ...Array.from({ length: 4 }, () => ({ purpose: 'gloss' as const, status: 'error' as const })),
      ...Array.from({ length: 10 }, () => ({
        purpose: 'gloss' as const,
        status: 'limited' as const,
      })),
      ...Array.from({ length: 10 }, () => ({
        purpose: 'gloss' as const,
        createdAt: new Date('2026-11-20T23:00:00Z'),
      })),
    ]);
    await expect(call(gw, u.id, 'gloss')).resolves.toBeDefined();
    await expect(call(gw, u.id, 'gloss')).rejects.toMatchObject({ code: 'AI_LIMIT_GLOBAL' });
  });
});

describe('monthly budget', () => {
  it('is ignored on the free tier', async () => {
    const { gw } = setup({ tier: 'free', monthlyBudgetUsd: 0 });
    const u = await createUser();
    await expect(call(gw, u.id, 'gloss')).resolves.toBeDefined();
  });

  it('refuses once this month’s cost reaches the budget, not before; earlier months do not count', async () => {
    const { gw } = setup({ tier: 'paid', monthlyBudgetUsd: 1 });
    const u = await createUser();
    await seed([
      { purpose: 'gloss', costMicroUsd: 999_999 },
      { purpose: 'gloss', costMicroUsd: 5_000_000, createdAt: new Date('2026-10-31T23:59:59Z') },
    ]);
    await expect(call(gw, u.id, 'gloss')).resolves.toBeDefined();
    // The ledger wrote a free-looking row too; add exactly the remaining budget.
    await seed([{ purpose: 'gloss', costMicroUsd: 1_000_000 }]);
    await expect(call(gw, u.id, 'gloss')).rejects.toMatchObject({ code: 'AI_LIMIT_GLOBAL' });
  });
});

describe('refusals are recorded', () => {
  it('writes a limited row that no later count includes', async () => {
    const { gw } = setup({ callsPerModelPerDay: 1 });
    const u = await createUser();
    await call(gw, u.id, 'gloss');
    await expect(call(gw, u.id, 'gloss')).rejects.toBeDefined();
    await expect(call(gw, u.id, 'gloss')).rejects.toBeDefined();
    const rows = await db.select().from(aiCalls);
    expect(rows.filter((r) => r.status === 'limited')).toHaveLength(2);
    expect(rows.filter((r) => r.status === 'ok')).toHaveLength(1);
  });
});

describe('pending rows (the cap no longer races)', () => {
  it('writes a pending row BEFORE the provider is called, then settles that same row', async () => {
    const { gw, fake } = setup();
    const u = await createUser();
    fake.delay(30);
    const running = call(gw, u.id, 'gloss');
    await new Promise((r) => setTimeout(r, 10));
    const during = await db.select().from(aiCalls);
    expect(during).toMatchObject([{ status: 'pending', purpose: 'gloss', inputTokens: 0 }]);
    await running;
    const after = await db.select().from(aiCalls);
    expect(after).toHaveLength(1);
    expect(after[0]).toMatchObject({ id: during[0]?.id, status: 'ok' });
    expect(after[0]?.inputTokens).toBeGreaterThan(0);
    expect(after[0]?.outputTokens).toBeGreaterThan(0);
  });

  it('settles the pending row as error when the provider fails', async () => {
    const { gw, fake } = setup();
    const u = await createUser();
    fake.failNext();
    await expect(call(gw, u.id, 'gloss')).rejects.toBeDefined();
    expect(await db.select().from(aiCalls)).toMatchObject([
      { status: 'error', errorCode: 'FAKE_FAILURE' },
    ]);
  });

  it('settles a streamed call too: ok when done, error when abandoned', async () => {
    const { gw } = setup();
    const u = await createUser();
    const stream = await gw.streamText({ userId: u.id }, { ...base, purpose: 'reply' });
    for await (const event of stream) void event;
    const abandoned = await gw.streamText({ userId: u.id }, { ...base, purpose: 'reply' });
    for await (const event of abandoned) {
      void event;
      break;
    }
    const rows = await db.select().from(aiCalls).orderBy(aiCalls.createdAt);
    expect(rows.map((r) => r.status).sort()).toEqual(['error', 'ok']);
    expect(rows.find((r) => r.status === 'error')?.errorCode).toBe('ABORTED');
  });

  it('two parallel turns at the limit: only one passes', async () => {
    const { gw, fake } = setup({ callsPerModelPerDay: 50 });
    const u = await createUser();
    // 2 turns used, limit 3: each real turn leaves a correction row and a reply row.
    await seed([
      { userId: u.id },
      { userId: u.id },
      { userId: u.id, purpose: 'correction' },
      { userId: u.id, purpose: 'correction' },
    ]);
    const results = await Promise.allSettled([
      call(gw, u.id, 'correction'),
      call(gw, u.id, 'correction'),
    ]);
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    const refused = results.find((r) => r.status === 'rejected');
    expect(refused).toMatchObject({ reason: { code: 'AI_LIMIT_USER' } });
    expect(fake.requests).toHaveLength(1);
    // The turn that passed is not refused at its reply: its correction is its own pending row.
    await expect(
      gw.streamText({ userId: u.id }, { ...base, purpose: 'reply' }),
    ).resolves.toBeDefined();
  });

  it('parallel replies at the limit: only one passes', async () => {
    const { gw } = setup();
    const u = await createUser();
    await seed([{ userId: u.id }, { userId: u.id }]);
    const results = await Promise.allSettled(
      [0, 1, 2].map(() => gw.streamText({ userId: u.id }, { ...base, purpose: 'reply' })),
    );
    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
  });

  it('parallel calls at the per-model cap and at the per-user gloss cap: only the free slots pass', async () => {
    const { gw } = setup({ callsPerModelPerDay: 5, glossPerLearnerPerDay: 10 });
    const u = await createUser();
    await seed(Array.from({ length: 3 }, () => ({ purpose: 'gloss' as const })));
    const model = await Promise.allSettled([1, 2, 3, 4].map(() => call(gw, u.id, 'gloss')));
    expect(model.filter((r) => r.status === 'fulfilled')).toHaveLength(2);

    const second = setup({ callsPerModelPerDay: 100, glossPerLearnerPerDay: 2 });
    const v = await createUser();
    const user = await Promise.allSettled([1, 2, 3, 4].map(() => call(second.gw, v.id, 'gloss')));
    expect(user.filter((r) => r.status === 'fulfilled')).toHaveLength(2);
  });

  it('counts pending rows, and a pending row older than 5 minutes still counts (the call may have happened)', async () => {
    const { gw } = setup({ callsPerModelPerDay: 2 });
    const u = await createUser();
    await seed([
      { purpose: 'gloss', status: 'pending' },
      { purpose: 'gloss', status: 'pending', createdAt: new Date(NOW.getTime() - 10 * 60_000) },
    ]);
    await expect(call(gw, u.id, 'gloss')).rejects.toMatchObject({ code: 'AI_LIMIT_GLOBAL' });
  });

  it('a failed correction does not use a turn up', async () => {
    const { gw, fake } = setup({ turnsPerLearnerPerDay: 1 });
    const u = await createUser();
    fake.failNext();
    await expect(call(gw, u.id, 'correction')).rejects.toBeDefined();
    await expect(call(gw, u.id, 'correction')).resolves.toBeDefined();
  });
});
