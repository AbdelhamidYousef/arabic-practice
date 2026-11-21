import { desc } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { db } from '../db/client.ts';
import { aiCalls } from '../db/schema/index.ts';
import { createUser } from '../test/factories.ts';

import { FakeProvider } from './fake.ts';
import { createLedgeredGateway } from './usage.ts';

const schema = z.object({ translation: z.string() });
const base = { model: 'gemini-3.5-flash-lite', system: 's', maxOutputTokens: 50 };
const msg = [{ role: 'user' as const, text: 'مرحبا' }];
const rows = () => db.select().from(aiCalls).orderBy(desc(aiCalls.createdAt));

function setup(tier: 'free' | 'paid' = 'free') {
  const fake = new FakeProvider();
  return { fake, gw: createLedgeredGateway({ provider: fake, db, tier }) };
}

describe('ledgered gateway', () => {
  it('records an ok json call with tokens, latency, user and zero cost on free', async () => {
    const { gw } = setup();
    const u = await createUser();
    await gw.generateJson({ userId: u.id }, { ...base, purpose: 'gloss', messages: msg, schema });
    const [row] = await rows();
    expect(row).toMatchObject({
      userId: u.id,
      purpose: 'gloss',
      provider: 'fake',
      model: base.model,
      status: 'ok',
      costMicroUsd: 0,
      errorCode: null,
    });
    expect(row?.inputTokens).toBeGreaterThan(0);
  });

  it('prices the call on the paid tier', async () => {
    const { gw } = setup('paid');
    await gw.generateJson({ userId: null }, { ...base, purpose: 'gloss', messages: msg, schema });
    expect((await rows())[0]?.costMicroUsd).toBeGreaterThan(0);
  });

  it('records a failure and throws the API code (AI_BUSY for a 429, AI_FAILED otherwise)', async () => {
    const { gw, fake } = setup();
    fake.rateLimitNext();
    await expect(
      gw.generateJson({ userId: null }, { ...base, purpose: 'gloss', messages: msg, schema }),
    ).rejects.toMatchObject({ code: 'AI_BUSY' });
    fake.failNext();
    await expect(
      gw.generateJson({ userId: null }, { ...base, purpose: 'gloss', messages: msg, schema }),
    ).rejects.toMatchObject({ code: 'AI_FAILED' });
    fake.badOutputNext();
    await expect(
      gw.generateJson({ userId: null }, { ...base, purpose: 'gloss', messages: msg, schema }),
    ).rejects.toMatchObject({ code: 'AI_FAILED' });
    const all = await rows();
    expect(all.map((r) => r.status)).toEqual(['error', 'error', 'error']);
    expect(all.map((r) => r.errorCode).sort()).toEqual([
      'BAD_OUTPUT',
      'FAKE_FAILURE',
      'RATE_LIMITED',
    ]);
  });

  it('records a streamed call once, when done arrives', async () => {
    const { gw } = setup();
    const stream = await gw.streamText(
      { userId: null },
      { ...base, purpose: 'reply', messages: msg },
    );
    let text = '';
    for await (const e of stream) if (e.type === 'delta') text += e.text;
    expect(text.length).toBeGreaterThan(0);
    const all = await rows();
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ purpose: 'reply', status: 'ok' });
    expect(all[0]?.outputTokens).toBeGreaterThan(0);
  });

  it('throws a stream start failure from streamText itself, before any iteration', async () => {
    const { gw, fake } = setup();
    fake.rateLimitNext();
    await expect(
      gw.streamText({ userId: null }, { ...base, purpose: 'reply', messages: msg }),
    ).rejects.toMatchObject({ code: 'AI_BUSY' });
    expect(await rows()).toHaveLength(1);
  });

  it('records an abandoned stream as an ABORTED error', async () => {
    const { gw } = setup();
    const stream = await gw.streamText(
      { userId: null },
      { ...base, purpose: 'reply', messages: msg },
    );
    for await (const e of stream) {
      if (e.type === 'delta') break;
    }
    const all = await rows();
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ status: 'error', errorCode: 'ABORTED' });
  });

  it('still answers when the ledger write fails', async () => {
    const fake = new FakeProvider();
    const broken = {
      insert: () => {
        throw new Error('db down');
      },
    } as unknown as typeof db;
    const gw = createLedgeredGateway({ provider: fake, db: broken, tier: 'free' });
    await expect(
      gw.generateJson({ userId: null }, { ...base, purpose: 'gloss', messages: msg, schema }),
    ).resolves.toBeDefined();
  });
});
