import {
  ErrorCode,
  type ConversationDetailResponse,
  type Correction,
  type Message,
  type MessageWithCorrection,
  type TurnEvent,
} from '@arabic/shared';

import { ApiError } from '../../api/client';

// The state of the turn that is being sent right now, as plain data and pure functions so the
// order-of-events rules can be tested without a browser. Finished turns live in the conversation
// query cache; this holds only what has not been committed there yet.

export type CorrectionState =
  { status: 'pending' } | { status: 'done'; correction: Correction } | { status: 'error' };

export interface TurnFailure {
  /** An API error code, or NETWORK. */
  code: string;
  /** `send`: nothing was saved (before the stream). `reply`: the learner message is saved, the reply is not. */
  stage: 'send' | 'reply';
  details?: unknown;
}

export interface TurnState {
  /** `sending`: waiting for the first event. `streaming`: the learner message exists. */
  status: 'idle' | 'sending' | 'streaming';
  /** The learner's text for this turn (the optimistic bubble). */
  text: string;
  learner: Message | null;
  reply: string;
  correction: CorrectionState | null;
  /** The saved partner message, from `done`. */
  partner: Message | null;
  failure: TurnFailure | null;
  /** What Retry resends. */
  lastText: string;
}

export const idleTurn: TurnState = {
  status: 'idle',
  text: '',
  learner: null,
  reply: '',
  correction: null,
  partner: null,
  failure: null,
  lastText: '',
};

export function startTurn(text: string): TurnState {
  return { ...idleTurn, status: 'sending', text, lastText: text };
}

export function applyEvent(state: TurnState, event: TurnEvent): TurnState {
  switch (event.event) {
    case 'learner':
      return {
        ...state,
        status: 'streaming',
        learner: event.data.message,
        // A correction that beat its message here stays; otherwise the check has started.
        correction: state.correction ?? { status: 'pending' },
      };
    case 'delta':
      return { ...state, status: 'streaming', reply: state.reply + event.data.text };
    case 'correction':
      return { ...state, correction: { status: 'done', correction: event.data.correction } };
    case 'done':
      return { ...state, partner: event.data.message, reply: event.data.message.text };
    case 'error':
      if (event.data.scope === 'correction') return { ...state, correction: { status: 'error' } };
      return {
        ...state,
        // Half a reply was never saved, so it is not shown as if it were.
        reply: '',
        failure: { code: event.data.code, stage: 'reply' },
      };
  }
}

export function failedBeforeStream(state: TurnState, error: unknown): TurnState {
  const code = error instanceof ApiError ? error.code : 'INTERNAL';
  const details = error instanceof ApiError ? error.details : undefined;
  return { ...idleTurn, lastText: state.lastText, failure: { code, stage: 'send', details } };
}

/** The messages a finished (or cut short) turn adds to the conversation. */
export function committed(state: TurnState): MessageWithCorrection[] {
  if (!state.learner) return [];
  const learner: MessageWithCorrection = {
    ...state.learner,
    correction: state.correction?.status === 'done' ? state.correction.correction : null,
  };
  const partner = state.partner ? [{ ...state.partner, correction: null }] : [];
  return [learner, ...partner];
}

export function appendToConversation(
  data: ConversationDetailResponse | undefined,
  added: MessageWithCorrection[],
): ConversationDetailResponse | undefined {
  if (!data || added.length === 0) return data;
  const known = new Set(data.messages.map((m) => m.id));
  const fresh = added.filter((m) => !known.has(m.id));
  const learnerAdded = fresh.some((m) => m.role === 'learner');
  const last = fresh[fresh.length - 1];
  return {
    ...data,
    conversation: {
      ...data.conversation,
      turnCount: data.conversation.turnCount + (learnerAdded ? 1 : 0),
      lastMessageAt: last?.createdAt ?? data.conversation.lastMessageAt,
    },
    messages: [...data.messages, ...fresh],
  };
}

const NO_RETRY = new Set<string>([
  ErrorCode.AI_LIMIT_USER,
  ErrorCode.AI_LIMIT_GLOBAL,
  ErrorCode.AI_DISABLED,
]);

export function canRetry(failure: TurnFailure): boolean {
  return !NO_RETRY.has(failure.code);
}

/** The next midnight UTC: when the daily caps count from zero again. */
export function nextUtcMidnight(now: Date): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
}
