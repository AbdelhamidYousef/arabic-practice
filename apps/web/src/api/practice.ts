import {
  ConversationDetailResponseSchema,
  GlossResponseSchema,
  StartConversationResponseSchema,
  TurnEventSchema,
  type ConversationDetailResponse,
  type GlossResponse,
  type StartConversationResponse,
  type TurnEvent,
} from '@arabic/shared';

import { ApiError, apiFetch } from './client';
import { postSse } from './sse';

export type {
  Conversation,
  ConversationDetailResponse,
  Correction,
  Message,
  MessageWithCorrection,
  Mistake,
  StartConversationResponse,
  TurnEvent,
} from '@arabic/shared';

/** `POST /conversations { lessonId }`: the new conversation and its opening line. */
export function startConversation(lessonId: string): Promise<StartConversationResponse> {
  return apiFetch('/conversations', {
    method: 'POST',
    body: { lessonId },
    schema: StartConversationResponseSchema,
  });
}

export function fetchConversation(
  id: string,
  signal?: AbortSignal,
): Promise<ConversationDetailResponse> {
  return apiFetch(`/conversations/${encodeURIComponent(id)}`, {
    schema: ConversationDetailResponseSchema,
    ...(signal && { signal }),
  });
}

/** `POST /messages/:id/gloss`: the English translation of a partner message (cached by the API). */
export function glossMessage(messageId: string, signal?: AbortSignal): Promise<GlossResponse> {
  return apiFetch(`/messages/${encodeURIComponent(messageId)}/gloss`, {
    method: 'POST',
    body: {},
    schema: GlossResponseSchema,
    ...(signal && { signal }),
  });
}

/**
 * Sends one learner turn and yields its events, each parsed with the shared schema. A failure
 * before the stream opens (400, 429, 503) throws an ApiError; an unreadable event throws too.
 */
export async function* streamTurn(
  conversationId: string,
  text: string,
  signal?: AbortSignal,
): AsyncGenerator<TurnEvent, void, undefined> {
  for await (const raw of postSse(
    `/conversations/${encodeURIComponent(conversationId)}/turns`,
    { text },
    signal,
  )) {
    const parsed = TurnEventSchema.safeParse(raw);
    if (!parsed.success) {
      throw new ApiError('BAD_RESPONSE', 200, 'The server sent an unexpected event', {
        issues: parsed.error.issues,
      });
    }
    yield parsed.data;
  }
}
