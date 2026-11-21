// What a model call costs, from tokens. USD per 1,000,000 tokens (Google's pricing page, read on
// 2026-11-21, standard tier). Prices change: update the table here and nowhere else.
//
// Units: 1 USD per million tokens is exactly 1 micro-USD per token, so
//   cost_micro_usd = input_tokens * inPerM + output_tokens * outPerM
// with no division. The ledger stores integer micro-USD so sums never drift.

export interface Price {
  inPerM: number;
  outPerM: number;
  /** false when the model is not in the table and the price below is a stand-in. */
  known: boolean;
}

interface Entry {
  inPerM: number;
  outPerM: number;
  // A price that changes on a date: the entry applies until (and including) `until` (UTC date),
  // then `after` applies. 3.6 / 3.8 Flash have an introductory price until 2026-12-31.
  until?: string;
  after?: { inPerM: number; outPerM: number };
  /** True for a price we did not read for this exact model. */
  assumed?: boolean;
}

const FLASH_LITE_35: Entry = { inPerM: 0.3, outPerM: 2.5 };

const PRICES: Record<string, Entry> = {
  'gemini-3.5-flash-lite': FLASH_LITE_35,
  // Not read on the pricing page: assume it costs like 3.5 Flash-Lite. Replace when read.
  'gemini-3.1-flash-lite': { ...FLASH_LITE_35, assumed: true },
  'gemini-3.6-flash': {
    inPerM: 0.75,
    outPerM: 3.75,
    until: '2026-12-31',
    after: { inPerM: 1.5, outPerM: 7.5 },
  },
  'gemini-3.8-flash': {
    inPerM: 0.75,
    outPerM: 3.75,
    until: '2026-12-31',
    after: { inPerM: 1.5, outPerM: 7.5 },
  },
};

// A model that is not in the table is priced at the highest rate we know, so an unlisted model
// can make the monthly budget trip early but never late.
const UNKNOWN: Omit<Price, 'known'> = { inPerM: 1.5, outPerM: 7.5 };

export function priceFor(model: string, at: Date = new Date()): Price {
  const entry = PRICES[model];
  if (!entry) return { ...UNKNOWN, known: false };
  const today = at.toISOString().slice(0, 10);
  const current = entry.until && entry.after && today > entry.until ? entry.after : entry;
  return { inPerM: current.inPerM, outPerM: current.outPerM, known: !entry.assumed };
}

export type AiTier = 'free' | 'paid';

/** Integer micro-USD for one call; always 0 on the free tier (nothing is billed). */
export function costMicroUsd(
  call: { model: string; inputTokens: number; outputTokens: number },
  tier: AiTier,
  at: Date = new Date(),
): number {
  if (tier === 'free') return 0;
  const p = priceFor(call.model, at);
  // Round up: never under-count money.
  return Math.ceil(call.inputTokens * p.inPerM + call.outputTokens * p.outPerM);
}
