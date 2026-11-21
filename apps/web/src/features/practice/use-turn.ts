import type { ConversationDetailResponse } from '@arabic/shared';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';

import { isAbortError } from '../../api/client';
import { streamTurn } from '../../api/practice';
import { keys } from '../../lib/query-client';

import {
  appendToConversation,
  applyEvent,
  committed,
  failedBeforeStream,
  idleTurn,
  startTurn,
  type TurnFailure,
  type TurnState,
} from './turn';

export interface UseTurn {
  turn: TurnState;
  busy: boolean;
  /** Text of the last reply that finished, for the polite live region. Empty until one does. */
  announcement: string;
  send: (text: string, onAccepted?: () => void) => void;
  stop: () => void;
  retry: (onAccepted?: () => void) => void;
}

/**
 * Runs one turn at a time against the API and keeps the cache in step with what the stream says.
 * Everything about the turn in flight is in `turn`; when the stream ends, its messages are written
 * into the conversation query (no refetch needed) and `turn` goes back to idle. A stop or a dropped
 * connection also refetches, because the server may know more than the browser saw.
 */
export function useTurn(conversationId: string): UseTurn {
  const client = useQueryClient();
  const [turn, setTurn] = useState<TurnState>(idleTurn);
  const [announcement, setAnnouncement] = useState('');
  const current = useRef<TurnState>(idleTurn);
  const controller = useRef<AbortController | null>(null);

  const update = useCallback((next: TurnState) => {
    current.current = next;
    setTurn(next);
  }, []);

  useEffect(() => () => controller.current?.abort(), []);

  const commit = useCallback(
    (state: TurnState, failure: TurnFailure | null, reconcile: boolean) => {
      const key = keys.conversation(conversationId);
      client.setQueryData<ConversationDetailResponse>(key, (old) =>
        appendToConversation(old, committed(state)),
      );
      if (state.partner) setAnnouncement(state.partner.text);
      update({ ...idleTurn, lastText: state.lastText, failure: failure ?? state.failure });
      if (reconcile) void client.invalidateQueries({ queryKey: key });
    },
    [client, conversationId, update],
  );

  const run = useCallback(
    async (text: string, onAccepted?: () => void) => {
      if (current.current.status !== 'idle') return;
      const ac = new AbortController();
      controller.current = ac;
      update(startTurn(text));
      let accepted = false;
      try {
        for await (const event of streamTurn(conversationId, text, ac.signal)) {
          if (event.event === 'learner' && !accepted) {
            accepted = true;
            onAccepted?.();
          }
          update(applyEvent(current.current, event));
        }
        // The stream ended. With a reply but no `done` something was cut short: check the server.
        const state = current.current;
        commit(state, null, state.learner !== null && state.partner === null && !state.failure);
      } catch (error) {
        const state = current.current;
        if (isAbortError(error)) {
          commit({ ...state, failure: null }, null, true);
        } else if (state.learner) {
          // The connection broke after the message was saved.
          commit(state, { code: 'NETWORK', stage: 'reply' }, true);
        } else {
          update(failedBeforeStream(state, error));
        }
      } finally {
        if (controller.current === ac) controller.current = null;
      }
    },
    [commit, conversationId, update],
  );

  const send = useCallback(
    (text: string, onAccepted?: () => void) => void run(text, onAccepted),
    [run],
  );
  const stop = useCallback(() => controller.current?.abort(), []);
  const retry = useCallback(
    (onAccepted?: () => void) => {
      const text = current.current.lastText;
      if (text) void run(text, onAccepted);
    },
    [run],
  );

  return { turn, busy: turn.status !== 'idle', announcement, send, stop, retry };
}
