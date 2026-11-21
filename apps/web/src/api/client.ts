import { ErrorCode } from '@arabic/shared';
import type { z } from 'zod';

// The one place that calls fetch for JSON. Components never do (conventions: typed client in
// api/, hooks in features/<x>/queries.ts), and every response is parsed with a Zod schema, so a
// drifting API shape fails loudly here instead of as `undefined is not a function` three
// components later.

// Empty in dev (the Vite proxy forwards /api, same origin so cookies just work), and empty in
// production too (one Vercel project serves both). VITE_API_URL exists for odd deployments.
export const API_BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export type ApiErrorCode = ErrorCode | 'NETWORK' | 'BAD_RESPONSE';

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details: unknown;

  constructor(code: ApiErrorCode, status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === 'string' && value in ErrorCode;
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

// Turns a failed (non-2xx) response into the API's typed error. Shared with the SSE reader, whose
// "before the stream opens" failures (400, 429) are ordinary JSON error bodies.
export async function errorFromResponse(res: Response): Promise<ApiError> {
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    // Empty or non-JSON body: the status alone has to do.
  }
  const err = (json as { error?: { code?: unknown; message?: unknown; details?: unknown } } | null)
    ?.error;
  return new ApiError(
    isErrorCode(err?.code) ? err.code : ErrorCode.INTERNAL,
    res.status,
    typeof err?.message === 'string' ? err.message : `Request failed with status ${res.status}`,
    err?.details,
  );
}

export async function sendRequest(
  path: string,
  init: { method: string; body?: unknown; signal?: AbortSignal | undefined; accept: string },
): Promise<Response> {
  const { method, body, signal, accept } = init;
  try {
    return await fetch(`${API_BASE}/api/v1${path}`, {
      method,
      // Sends the `sid` session cookie.
      credentials: 'include',
      headers: {
        Accept: accept,
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      ...(signal ? { signal } : {}),
    });
  } catch (cause) {
    // An abort is the caller's decision (React Query cancels stale requests); pass it through.
    if (isAbortError(cause)) throw cause;
    throw new ApiError('NETWORK', 0, 'Could not reach the server', cause);
  }
}

export interface ApiFetchOptions<S extends z.ZodType> {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  schema: S;
  signal?: AbortSignal;
}

export async function apiFetch<S extends z.ZodType>(
  path: string,
  { method = 'GET', body, schema, signal }: ApiFetchOptions<S>,
): Promise<z.output<S>> {
  const res = await sendRequest(path, { method, body, signal, accept: 'application/json' });
  if (!res.ok) throw await errorFromResponse(res);

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    // A 204 has no body; the schema decides whether null is acceptable.
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiError('BAD_RESPONSE', res.status, 'The server sent an unexpected response', {
      issues: parsed.error.issues,
    });
  }
  return parsed.data;
}
