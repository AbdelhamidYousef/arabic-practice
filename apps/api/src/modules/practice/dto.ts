import type {
  Conversation,
  Correction,
  LevelMetricsDto,
  Message,
  MessageWithCorrection,
} from '@arabic/shared';

import type {
  conversations,
  corrections,
  messages as messagesTable,
  mistakes,
} from '../../db/schema/index.ts';

// Rows become what the browser sees here, as allow-lists: a column added later never leaks by accident.

export function toConversationDto(row: typeof conversations.$inferSelect): Conversation {
  return {
    id: row.id,
    lessonId: row.lessonId,
    turnCount: row.turnCount,
    lastMessageAt: row.lastMessageAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

export function toMessageDto(row: typeof messagesTable.$inferSelect): Message {
  const m: LevelMetricsDto | null = row.levelMetrics;
  return {
    id: row.id,
    role: row.role,
    text: row.text,
    glossEn: row.glossEn,
    levelMetrics: m,
    createdAt: row.createdAt.toISOString(),
  };
}

export function toCorrectionDto(
  row: typeof corrections.$inferSelect,
  mistakeRows: (typeof mistakes.$inferSelect)[],
): Correction {
  return {
    id: row.id,
    isCorrect: row.isCorrect,
    corrected: row.corrected,
    praise: row.praise,
    mistakes: mistakeRows.map((x) => ({
      id: x.id,
      type: x.type,
      original: x.original,
      correction: x.correction,
      explanation: x.explanation,
    })),
  };
}

export function withCorrection(
  message: Message,
  correction: Correction | null,
): MessageWithCorrection {
  return { ...message, correction };
}
