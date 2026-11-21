// Single source of truth for API error codes (see docs/plan/02-api-contract.md): the API maps a
// thrown AppError to this status, and the web client switches on the code, never on the message.
export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMITED: 'RATE_LIMITED',
  // The read-only demo teacher tried to change something.
  DEMO_READ_ONLY: 'DEMO_READ_ONLY',
  // Invite sign-up is switched off (always while the AI tier is free).
  INVITES_CLOSED: 'INVITES_CLOSED',
  // AI cost control: a per-user daily cap, the global daily cap, or the kill switch.
  AI_LIMIT_USER: 'AI_LIMIT_USER',
  AI_LIMIT_GLOBAL: 'AI_LIMIT_GLOBAL',
  AI_DISABLED: 'AI_DISABLED',
  // The provider answered 429, or 500/503 twice in a row ("high demand"): busy, try again shortly.
  AI_BUSY: 'AI_BUSY',
  // The provider failed or returned something we could not parse, even after one retry.
  AI_FAILED: 'AI_FAILED',
  // The seeded demo teacher the guest and demo sign-ins depend on is missing (the seed was not run).
  DEMO_UNAVAILABLE: 'DEMO_UNAVAILABLE',
  // A second turn was sent in a conversation that is still answering the first one.
  TURN_IN_PROGRESS: 'TURN_IN_PROGRESS',
  INTERNAL: 'INTERNAL',
  // Security limits (phase 12): too many new conversations for one user in a day, and too many guest
  // sign-ins from one network or in total.
  CONVERSATION_LIMIT: 'CONVERSATION_LIMIT',
  GUEST_LIMIT: 'GUEST_LIMIT',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export const errorStatus: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  DEMO_READ_ONLY: 403,
  INVITES_CLOSED: 403,
  AI_LIMIT_USER: 429,
  AI_LIMIT_GLOBAL: 429,
  AI_DISABLED: 503,
  AI_BUSY: 503,
  AI_FAILED: 502,
  DEMO_UNAVAILABLE: 503,
  TURN_IN_PROGRESS: 409,
  INTERNAL: 500,
  CONVERSATION_LIMIT: 429,
  GUEST_LIMIT: 429,
};
