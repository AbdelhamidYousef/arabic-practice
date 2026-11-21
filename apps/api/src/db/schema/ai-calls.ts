import { index, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { createdAt, id } from './columns.ts';
import { conversations } from './conversations.ts';
import { aiCallStatus, aiPurpose } from './enums.ts';
import { users } from './users.ts';

// The usage and cost ledger. Daily caps count rows here; the monthly budget sums cost_micro_usd
// (millionths of a US dollar, an integer so sums never drift). The user and conversation are set
// null when deleted, so the money record outlives the person.
export const aiCalls = pgTable(
  'ai_calls',
  {
    id: id(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    conversationId: uuid('conversation_id').references(() => conversations.id, {
      onDelete: 'set null',
    }),
    purpose: aiPurpose('purpose').notNull(),
    provider: text('provider').notNull(),
    model: text('model').notNull(),
    inputTokens: integer('input_tokens').notNull().default(0),
    outputTokens: integer('output_tokens').notNull().default(0),
    latencyMs: integer('latency_ms').notNull().default(0),
    // From the price table; 0 on the free tier.
    costMicroUsd: integer('cost_micro_usd').notNull().default(0),
    status: aiCallStatus('status').notNull(),
    errorCode: text('error_code'),
    createdAt: createdAt(),
  },
  (t) => [
    index('ai_calls_created_idx').on(t.createdAt),
    index('ai_calls_user_created_idx').on(t.userId, t.createdAt),
  ],
);
