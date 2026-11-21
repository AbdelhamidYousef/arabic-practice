import { z } from 'zod';

import { cefrLevelSchema } from '../cefr.ts';

// Practice: conversations, the turn stream and gloss (docs/plan/02-api-contract.md). The same
// schemas validate responses on the API (outside production) and parse events in the browser.

export const MAX_TURN_CHARS = 500;

export const MistakeTypeSchema = z.enum([
  'grammar',
  'vocabulary',
  'harakat',
  'spelling',
  'word_order',
  'register',
]);
export type MistakeType = z.infer<typeof MistakeTypeSchema>;

export const MistakeSchema = z.object({
  id: z.string(),
  type: MistakeTypeSchema,
  original: z.string(),
  correction: z.string(),
  explanation: z.string(),
});
export type Mistake = z.infer<typeof MistakeSchema>;

export const CorrectionSchema = z.object({
  id: z.string(),
  isCorrect: z.boolean(),
  // The learner's message fixed, with full harakat.
  corrected: z.string(),
  praise: z.string().nullable(),
  mistakes: z.array(MistakeSchema),
});
export type Correction = z.infer<typeof CorrectionSchema>;

// What we measured about a partner reply (null on learner messages and the opening line).
export const LevelMetricsSchema = z.object({
  words: z.number(),
  sentences: z.number(),
  longestSentence: z.number(),
  harakatRatio: z.number(),
  lessonVocabHits: z.number(),
  latinChars: z.number(),
  withinLevel: z.boolean().optional(),
  violations: z.array(z.string()).optional(),
});
export type LevelMetricsDto = z.infer<typeof LevelMetricsSchema>;

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(['learner', 'partner']),
  text: z.string(),
  // English translation, once a learner has asked for it.
  glossEn: z.string().nullable(),
  levelMetrics: LevelMetricsSchema.nullable(),
  createdAt: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

// Learner messages carry their correction once it exists (null while it is missing or failed).
export const MessageWithCorrectionSchema = MessageSchema.extend({
  correction: CorrectionSchema.nullable(),
});
export type MessageWithCorrection = z.infer<typeof MessageWithCorrectionSchema>;

export const ConversationSchema = z.object({
  id: z.string(),
  lessonId: z.string(),
  // Learner messages sent so far.
  turnCount: z.number().int().nonnegative(),
  lastMessageAt: z.string(),
  createdAt: z.string(),
});
export type Conversation = z.infer<typeof ConversationSchema>;

export const StartConversationRequestSchema = z.object({ lessonId: z.uuid() });
export type StartConversationRequest = z.infer<typeof StartConversationRequestSchema>;

// `POST /conversations`: the opening line is the first (and only) message.
export const StartConversationResponseSchema = z.object({
  conversation: ConversationSchema,
  messages: z.array(MessageSchema),
});
export type StartConversationResponse = z.infer<typeof StartConversationResponseSchema>;

export const ConversationLessonSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  level: cefrLevelSchema,
});

// `GET /conversations/:id`
export const ConversationDetailResponseSchema = z.object({
  conversation: ConversationSchema,
  lesson: ConversationLessonSchema,
  messages: z.array(MessageWithCorrectionSchema),
});
export type ConversationDetailResponse = z.infer<typeof ConversationDetailResponseSchema>;

// `POST /conversations/:id/turns` body: trimmed first, so "   " is empty and 400s.
export const TurnRequestSchema = z.object({ text: z.string().trim().min(1).max(MAX_TURN_CHARS) });
export type TurnRequest = z.infer<typeof TurnRequestSchema>;

// `POST /messages/:id/gloss`
export const GlossResponseSchema = z.object({ glossEn: z.string() });
export type GlossResponse = z.infer<typeof GlossResponseSchema>;

// --- The turn stream (text/event-stream). Each event is `event: <name>\ndata: <json>\n\n`. ---
// The stream ends after everything has settled. `done` comes last and only when the partner reply
// was saved; after an `error` with scope `reply` the stream just ends. A `correction` or `error`
// with scope `correction` can arrive before or after the reply, but always before `done`.

export const TurnUsageSchema = z.object({
  inputTokens: z.number(),
  outputTokens: z.number(),
  model: z.string(),
  latencyMs: z.number(),
});
export type TurnUsage = z.infer<typeof TurnUsageSchema>;

export const TurnErrorCodeSchema = z.enum([
  'AI_LIMIT_USER',
  'AI_LIMIT_GLOBAL',
  'AI_DISABLED',
  'AI_BUSY',
  'AI_FAILED',
  'INTERNAL',
]);

export const TurnEventSchema = z.discriminatedUnion('event', [
  z.object({ event: z.literal('learner'), data: z.object({ message: MessageSchema }) }),
  z.object({ event: z.literal('delta'), data: z.object({ text: z.string() }) }),
  z.object({
    event: z.literal('correction'),
    data: z.object({ messageId: z.string(), correction: CorrectionSchema }),
  }),
  z.object({
    event: z.literal('done'),
    data: z.object({ message: MessageSchema, usage: TurnUsageSchema }),
  }),
  z.object({
    event: z.literal('error'),
    data: z.object({
      code: TurnErrorCodeSchema,
      message: z.string(),
      // Which half of the turn failed; the other half carries on.
      scope: z.enum(['reply', 'correction']),
    }),
  }),
]);
export type TurnEvent = z.infer<typeof TurnEventSchema>;
export type TurnEventName = TurnEvent['event'];
