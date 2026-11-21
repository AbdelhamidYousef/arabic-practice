import {
  ErrorCode,
  type ConversationDetailResponse,
  type GlossResponse,
  type StartConversationResponse,
} from '@arabic/shared';

import type { AiRuntime } from '../../ai/index.ts';
import { glossSchema, buildGlossPrompt } from '../../ai/prompts/gloss.ts';
import { AppError, notFound } from '../../lib/errors.ts';
import type { AuthUser } from '../auth/sessions.ts';

import { toConversationDto, toCorrectionDto, toMessageDto, withCorrection } from './dto.ts';
import * as repo from './repo.ts';

// The same visibility rule as the lessons module: a learner practises their teacher's lessons, a
// teacher their own; a lesson that is hidden from you does not exist for you.
const visibleTeacherId = (user: AuthUser) => (user.role === 'teacher' ? user.id : user.teacherId);

export async function startConversation(
  user: AuthUser,
  lessonId: string,
): Promise<StartConversationResponse> {
  const teacherId = visibleTeacherId(user);
  const lesson = teacherId ? await repo.findVisiblePublishedLesson(teacherId, lessonId) : undefined;
  if (!lesson) throw notFound('Lesson not found');

  const { conversation, opening } = await repo.createConversationWithOpening(
    user.id,
    lesson.id,
    lesson.openingLine,
  );
  return { conversation: toConversationDto(conversation), messages: [toMessageDto(opening)] };
}

export async function getConversation(
  user: AuthUser,
  conversationId: string,
): Promise<ConversationDetailResponse> {
  const found = await repo.findOwnedConversation(user.id, conversationId);
  if (!found) throw notFound('Conversation not found');

  const [messageRows, { correctionRows, mistakeRows }] = await Promise.all([
    repo.listMessages(conversationId),
    repo.listCorrections(conversationId),
  ]);
  const byMessage = new Map(
    correctionRows.map((c) => [
      c.messageId,
      toCorrectionDto(
        c,
        mistakeRows.filter((m) => m.correctionId === c.id),
      ),
    ]),
  );
  const { conversation, lesson } = found;
  return {
    conversation: toConversationDto(conversation),
    lesson: { id: lesson.id, slug: lesson.slug, title: lesson.title, level: lesson.level },
    messages: messageRows.map((m) => withCorrection(toMessageDto(m), byMessage.get(m.id) ?? null)),
  };
}

// Gloss is cached on the row, so a learner pressing "translate" twice costs one AI call.
export async function glossMessage(
  user: AuthUser,
  messageId: string,
  ai: AiRuntime,
): Promise<GlossResponse> {
  const found = await repo.findOwnedPartnerMessage(user.id, messageId);
  if (!found) throw notFound('Message not found');
  if (found.message.glossEn) return { glossEn: found.message.glossEn };

  const prompt = buildGlossPrompt(found.message.text);
  const { data } = await ai.gateway.generateJson(
    { userId: user.id, conversationId: found.conversationId, isGuest: user.isGuest },
    { purpose: 'gloss', model: ai.models.gloss, schema: glossSchema, ...prompt },
  );
  const translation = data.translation.trim();
  if (!translation) throw new AppError(ErrorCode.AI_FAILED, 'The AI gave an unusable answer');
  const saved = await repo.saveGloss(messageId, translation);
  // null: another request saved first; its text is the one everybody sees from now on.
  if (saved) return { glossEn: saved };
  const again = await repo.findOwnedPartnerMessage(user.id, messageId);
  return { glossEn: again?.message.glossEn ?? translation };
}
