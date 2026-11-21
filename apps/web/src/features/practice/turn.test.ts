import { describe, expect, it } from 'vitest';

import { ApiError } from '../../api/client';

import {
  appendToConversation,
  applyEvent,
  canRetry,
  committed,
  failedBeforeStream,
  nextUtcMidnight,
  startTurn,
} from './turn';

const msg = (id: string, role: 'learner' | 'partner', text: string) => ({
  id,
  role,
  text,
  glossEn: null,
  levelMetrics: null,
  createdAt: '2026-11-21T10:00:00.000Z',
});
const correction = { id: 'k', isCorrect: true, corrected: 'x', praise: null, mistakes: [] };
const usage = { inputTokens: 1, outputTokens: 1, model: 'm', latencyMs: 1 };

describe('turn state', () => {
  it('builds a finished turn from its events, in any correction order', () => {
    let state = startTurn('مرحبا');
    state = applyEvent(state, {
      event: 'learner',
      data: { message: msg('a', 'learner', 'مرحبا') },
    });
    expect(state.correction).toEqual({ status: 'pending' });
    state = applyEvent(state, { event: 'delta', data: { text: 'أه' } });
    state = applyEvent(state, { event: 'correction', data: { messageId: 'a', correction } });
    state = applyEvent(state, { event: 'delta', data: { text: 'لا' } });
    state = applyEvent(state, {
      event: 'done',
      data: { message: msg('b', 'partner', 'أهلا'), usage },
    });
    expect(state.reply).toBe('أهلا');
    expect(committed(state).map((m) => [m.id, m.correction?.id ?? null])).toEqual([
      ['a', 'k'],
      ['b', null],
    ]);
  });

  it('drops a half reply on a reply error but keeps the learner message', () => {
    let state = startTurn('مرحبا');
    state = applyEvent(state, {
      event: 'learner',
      data: { message: msg('a', 'learner', 'مرحبا') },
    });
    state = applyEvent(state, { event: 'delta', data: { text: 'نص' } });
    state = applyEvent(state, {
      event: 'error',
      data: { code: 'AI_FAILED', message: 'x', scope: 'reply' },
    });
    expect(state.reply).toBe('');
    expect(state.failure).toMatchObject({ code: 'AI_FAILED', stage: 'reply' });
    expect(committed(state).map((m) => m.id)).toEqual(['a']);
  });

  it('commits nothing before the learner event, and remembers the text for a retry', () => {
    const state = failedBeforeStream(
      startTurn('شكرا'),
      new ApiError('AI_LIMIT_USER', 429, 'limit', { limit: 60 }),
    );
    expect(committed(state)).toEqual([]);
    expect(state).toMatchObject({ status: 'idle', lastText: 'شكرا' });
    expect(state.failure).toMatchObject({ code: 'AI_LIMIT_USER', stage: 'send' });
  });

  it('adds messages to the cache once and counts the turn', () => {
    const data = {
      conversation: {
        id: 'c',
        lessonId: 'l',
        turnCount: 1,
        lastMessageAt: 'x',
        createdAt: 'x',
      },
      lesson: { id: 'l', slug: 's', title: 't', level: 'A1' as const },
      messages: [{ ...msg('p', 'partner', 'hi'), correction: null }],
    };
    const added = [{ ...msg('a', 'learner', 'x'), correction: null }];
    const once = appendToConversation(data, added);
    expect(once?.conversation.turnCount).toBe(2);
    expect(once?.messages.map((m) => m.id)).toEqual(['p', 'a']);
    expect(appendToConversation(once, added)?.messages).toHaveLength(2);
    expect(appendToConversation(undefined, added)).toBeUndefined();
  });

  it('retries everything except limits and the kill switch', () => {
    const f = (code: string) => canRetry({ code, stage: 'send' });
    expect(f('AI_BUSY')).toBe(true);
    expect(f('NETWORK')).toBe(true);
    expect(f('AI_LIMIT_USER')).toBe(false);
    expect(f('AI_LIMIT_GLOBAL')).toBe(false);
    expect(f('AI_DISABLED')).toBe(false);
  });

  it('resets daily limits at the next UTC midnight', () => {
    expect(nextUtcMidnight(new Date('2026-11-21T23:59:00Z')).toISOString()).toBe(
      '2026-11-22T00:00:00.000Z',
    );
    expect(nextUtcMidnight(new Date('2026-12-31T00:00:00Z')).toISOString()).toBe(
      '2027-01-01T00:00:00.000Z',
    );
  });
});
