import { ErrorCode, errorStatus } from '@arabic/shared';

// The one error type services throw. Nothing below the error middleware knows about HTTP bodies:
// they pick a code, and the status comes from the shared code to status table so API and web agree.
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details: unknown;

  constructor(code: ErrorCode, message: string, details?: unknown, status = errorStatus[code]) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const notFound = (message = 'Not found') => new AppError(ErrorCode.NOT_FOUND, message);

export const unauthenticated = (message = 'Authentication required') =>
  new AppError(ErrorCode.UNAUTHENTICATED, message);

export const forbidden = (message = 'Forbidden') => new AppError(ErrorCode.FORBIDDEN, message);

export const validation = (details?: unknown, message = 'Request validation failed') =>
  new AppError(ErrorCode.VALIDATION_ERROR, message, details);

// The request is well-formed but a rule says no. Same code as a schema failure so the web handles
// both identically; 422 tells them apart in logs and tests.
export const unprocessable = (message: string, details?: unknown) =>
  new AppError(ErrorCode.VALIDATION_ERROR, message, details, 422);

export const conflict = (message = 'Conflict', details?: unknown) =>
  new AppError(ErrorCode.CONFLICT, message, details);

export const rateLimited = (message = 'Too many requests') =>
  new AppError(ErrorCode.RATE_LIMITED, message);

// The read-only demo teacher tried to change something.
export const demoReadOnly = (message = 'The demo account is read-only') =>
  new AppError(ErrorCode.DEMO_READ_ONLY, message);

export const invitesClosed = (message = 'Sign-up by invitation is closed') =>
  new AppError(ErrorCode.INVITES_CLOSED, message);
