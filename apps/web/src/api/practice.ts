import { z } from 'zod';

import { apiFetch } from './client';

// `POST /conversations { lessonId }` (docs/plan/02-api-contract.md): the new conversation and its
// messages (the opening line is the first partner message). Only the fields this step reads are
// pinned; the practice chat step tightens the message shape. Loose objects keep extra fields.
export const StartConversationResponseSchema = z.object({
  conversation: z.looseObject({ id: z.string() }),
  messages: z.array(z.looseObject({ id: z.string() })),
});
export type StartConversationResponse = z.infer<typeof StartConversationResponseSchema>;

export function startConversation(lessonId: string): Promise<StartConversationResponse> {
  return apiFetch('/conversations', {
    method: 'POST',
    body: { lessonId },
    schema: StartConversationResponseSchema,
  });
}
