import { ErrorCode, type TurnEvent, type TurnUsage } from '@arabic/shared';
import type { Request, Response } from 'express';

import type { AiRuntime } from '../../ai/index.ts';
import { measureReply } from '../../ai/level-metrics.ts';
import { buildCorrectionPrompt, correctionSchema } from '../../ai/prompts/correction.ts';
import type { LessonContext } from '../../ai/prompts/lesson-context.ts';
import { buildReplyPrompt } from '../../ai/prompts/reply.ts';
import type { ChatMessage } from '../../ai/provider.ts';
import type { AiCallContext } from '../../ai/usage.ts';
import { AppError, notFound } from '../../lib/errors.ts';
import type { AuthUser } from '../auth/sessions.ts';

import { toCorrectionDto, toMessageDto } from './dto.ts';
import * as repo from './repo.ts';

type ErrorEvent = Extract<TurnEvent, { event: 'error' }>['data'];

const INTERNAL_MESSAGE = 'Something went wrong on our side';

// What a failure inside the stream tells the browser. Provider and cap failures are AppErrors with
// the API codes already; anything else is a bug of ours: logged by the caller, generic to the client.
function errorData(e: unknown, scope: ErrorEvent['scope']): ErrorEvent {
  if (e instanceof AppError) {
    const parsed = [
      ErrorCode.AI_LIMIT_USER,
      ErrorCode.AI_LIMIT_GLOBAL,
      ErrorCode.AI_DISABLED,
      ErrorCode.AI_BUSY,
      ErrorCode.AI_FAILED,
    ].find((c) => c === e.code);
    if (parsed) return { code: parsed, message: e.message, scope };
  }
  return { code: ErrorCode.INTERNAL, message: INTERNAL_MESSAGE, scope };
}

/**
 * One chat turn as a Server-Sent Events response (docs/plan/02-api-contract.md).
 *
 * Order of work, and why:
 *  1. Load the conversation (404 if it is not the caller's) and build the reply prompt from the
 *     history plus the new text IN MEMORY.
 *  2. Ask the gateway for the reply stream and wait for its first event. A cap or a provider 429 is
 *     thrown here, while the response is still plain JSON, so the client gets a real status code.
 *  3. Only then save the learner message. Saving after the stream start means a refused turn leaves
 *     nothing behind (no delete-to-undo, no orphan message that would show up in the history).
 *  4. Open the event stream, run the correction in parallel, relay the reply, and finish with `done`.
 */
export async function runTurn(opts: {
  req: Request;
  res: Response;
  user: AuthUser;
  conversationId: string;
  text: string;
  ai: AiRuntime;
}): Promise<void> {
  const { req, res, user, conversationId, text, ai } = opts;

  // Closing the connection before we finished writing means the learner left: cancel both provider
  // calls. (`res`, not `req`: a request's own 'close' also fires once its body has been read.)
  const abort = new AbortController();
  const { signal } = abort;
  res.on('close', () => {
    if (!res.writableFinished) abort.abort();
  });

  const found = await repo.findOwnedConversation(user.id, conversationId);
  if (!found) throw notFound('Conversation not found');
  const { lesson } = found;
  const [history, vocab] = await Promise.all([
    repo.listMessages(conversationId),
    repo.listVocab(lesson.id),
  ]);

  const ctx: AiCallContext = { userId: user.id, conversationId, isGuest: user.isGuest };
  const lessonContext: LessonContext = {
    title: lesson.title,
    level: lesson.level,
    topic: lesson.topic,
    scenario: lesson.scenario,
    grammarFocus: lesson.grammarFocus,
    goals: lesson.goals,
    vocab,
  };
  const chat: ChatMessage[] = [
    ...history.map((m): ChatMessage => ({
      role: m.role === 'learner' ? 'user' : 'model',
      text: m.text,
    })),
    { role: 'user', text },
  ];
  const replyPrompt = buildReplyPrompt({
    lesson: lessonContext,
    level: lesson.level,
    history: chat,
  });

  // Throws AppError (AI_LIMIT_*, AI_DISABLED, AI_BUSY, AI_FAILED) before anything is saved or sent.
  const stream = await ai.gateway.streamText(ctx, {
    purpose: 'reply',
    model: ai.models.reply,
    ...replyPrompt,
    signal,
  });

  let learner;
  try {
    learner = await repo.saveLearnerMessage(conversationId, text);
  } catch (e) {
    // Release the provider stream (this also writes its ledger row) before the 500 goes out.
    await stream[Symbol.asyncIterator]().return?.();
    throw e;
  }

  // Everything below runs inside an open event stream: from here on, failures are events, not statuses.
  res.status(200);
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  // Tells nginx-style proxies not to hold the stream back until it is complete.
  res.setHeader('X-Accel-Buffering', 'no');
  // Send the headers now, so the browser knows the stream is open before the first token exists.
  res.flushHeaders();

  const send = <E extends TurnEvent['event']>(
    event: E,
    data: Extract<TurnEvent, { event: E }>['data'],
  ) => {
    if (res.writableEnded || res.destroyed) return;
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };
  const fail = (e: unknown, scope: ErrorEvent['scope']) => {
    const data = errorData(e, scope);
    if (data.code === ErrorCode.INTERNAL) req.log.error({ err: e, scope }, 'turn failed');
    else req.log.info({ code: data.code, scope }, 'turn part failed');
    send('error', data);
  };

  send('learner', { message: toMessageDto(learner) });

  const lastPartner = [...history].reverse().find((m) => m.role === 'partner');

  // The correction call starts now and never rejects: its outcome is an event either way.
  const correctionTask = (async () => {
    try {
      const prompt = buildCorrectionPrompt({
        level: lesson.level,
        lesson: lessonContext,
        ...(lastPartner && { partnerMessage: lastPartner.text }),
        learnerText: text,
      });
      const { data } = await ai.gateway.generateJson(ctx, {
        purpose: 'correction',
        model: ai.models.correction,
        schema: correctionSchema,
        ...prompt,
        signal,
      });
      // The learner left while the model was thinking: store nothing half-finished.
      if (signal.aborted) return;
      const saved = await repo.saveCorrection({
        messageId: learner.id,
        userId: user.id,
        lessonId: lesson.id,
        isCorrect: data.isCorrect,
        corrected: data.corrected,
        praise: data.praise,
        mistakes: data.mistakes,
      });
      send('correction', {
        messageId: learner.id,
        correction: toCorrectionDto(saved.correction, saved.mistakeRows),
      });
    } catch (e) {
      if (!signal.aborted) fail(e, 'correction');
    }
  })();

  let replyText = '';
  let usage: TurnUsage | undefined;
  let replyFailure: unknown;
  try {
    for await (const event of stream) {
      // Leaving the loop calls the stream's return(), which tells the gateway the call was abandoned.
      if (signal.aborted) break;
      if (event.type === 'delta') {
        replyText += event.text;
        send('delta', { text: event.text });
      } else {
        usage = event.usage;
      }
    }
  } catch (e) {
    replyFailure = e;
  }

  if (signal.aborted) {
    await correctionTask;
    res.end();
    return;
  }

  let partner;
  if (replyFailure === undefined && usage && replyText.trim()) {
    try {
      const reply = replyText.trim();
      const m = measureReply({
        reply,
        level: lesson.level,
        lessonVocab: vocab.map((v) => v.arabic),
      });
      partner = await repo.savePartnerMessage(conversationId, reply, {
        words: m.wordCount,
        sentences: m.sentenceCount,
        longestSentence: m.longestSentence,
        harakatRatio: m.harakatRatio,
        lessonVocabHits: m.vocabHits,
        latinChars: m.latinChars,
        withinLevel: m.withinLevel,
        violations: m.violations,
      });
    } catch (e) {
      replyFailure = e;
    }
  } else if (replyFailure === undefined) {
    // The provider "finished" without text: nothing to save, and the learner must hear about it.
    replyFailure = new AppError(ErrorCode.AI_FAILED, 'The AI gave an unusable answer');
  }

  // `done` goes last: by then the correction has either arrived or failed, so the client can stop waiting.
  await correctionTask;
  if (partner && usage) {
    send('done', { message: toMessageDto(partner), usage });
  } else {
    // A half reply is never saved: the learner keeps their message and can send it again.
    fail(replyFailure, 'reply');
  }
  res.end();
}
