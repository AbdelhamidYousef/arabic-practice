import { index, jsonb, pgTable, text, uuid } from 'drizzle-orm/pg-core';

import { createdAt, id } from './columns.ts';
import { conversations } from './conversations.ts';
import { messageRole } from './enums.ts';

// What we measured about a partner message to prove it stayed at the learner's level.
export interface LevelMetrics {
  words: number;
  sentences: number;
  longestSentence: number;
  harakatRatio: number;
  lessonVocabHits: number;
  latinChars: number;
  withinLevel?: boolean;
  violations?: string[];
}

export const messages = pgTable(
  'messages',
  {
    id: id(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    role: messageRole('role').notNull(),
    text: text('text').notNull(),
    // English gloss, filled on demand the first time a learner asks for it.
    glossEn: text('gloss_en'),
    // Partner messages only.
    levelMetrics: jsonb('level_metrics').$type<LevelMetrics>(),
    createdAt: createdAt(),
  },
  (t) => [index('messages_conversation_created_idx').on(t.conversationId, t.createdAt)],
);
