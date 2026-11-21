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
