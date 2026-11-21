import { QueryClient } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { handleUnauthenticated, keys, shouldRetry } from '../lib/query-client';

import { fetchMe } from './auth';
import { ApiError, apiFetch } from './client';
import { postSse } from './sse';

const user = {
  id: 'u1',
  displayName: 'Sara',
  role: 'learner',
  level: 'A2',
  isGuest: false,
  readOnly: false,
  email: 'sara@example.com',
};

function stubFetch(res: Response | Error) {
  const fn = vi.fn(() => (res instanceof Response ? Promise.resolve(res) : Promise.reject(res)));
  vi.stubGlobal('fetch', fn);
  return fn;
}

afterEach(() => vi.useRealTimers());

describe('apiFetch', () => {
  it('sends credentials, parses the body with the schema and returns it', async () => {
    const fetchFn = stubFetch(Response.json({ n: 1 }));
    const data = await apiFetch('/x', { schema: z.object({ n: z.number() }) });
    expect(data).toEqual({ n: 1 });
    expect(fetchFn).toHaveBeenCalledWith(
      '/api/v1/x',
      expect.objectContaining({ credentials: 'include', method: 'GET' }),
    );
  });

  it('sends a JSON body with a content type', async () => {
    const fetchFn = stubFetch(Response.json({ n: 1 }));
    await apiFetch('/x', { method: 'POST', body: { a: 1 }, schema: z.unknown() });
    const init = (fetchFn.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(init.body).toBe('{"a":1}');
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
  });

  it('turns an API error body into a typed ApiError', async () => {
    stubFetch(
      Response.json({ error: { code: 'RATE_LIMITED', message: 'Slow down' } }, { status: 429 }),
    );
    await expect(apiFetch('/x', { schema: z.unknown() })).rejects.toMatchObject({
      code: 'RATE_LIMITED',
      status: 429,
      message: 'Slow down',
    });
  });

  it('falls back to INTERNAL when the error body is not the API shape', async () => {
    stubFetch(new Response('<html>', { status: 502 }));
    await expect(apiFetch('/x', { schema: z.unknown() })).rejects.toMatchObject({
      code: 'INTERNAL',
      status: 502,
    });
  });

  it('reports a dropped connection as NETWORK, and lets an abort through untouched', async () => {
    stubFetch(new TypeError('failed'));
    await expect(apiFetch('/x', { schema: z.unknown() })).rejects.toMatchObject({
      code: 'NETWORK',
    });
    stubFetch(new DOMException('x', 'AbortError'));
    await expect(apiFetch('/x', { schema: z.unknown() })).rejects.toMatchObject({
      name: 'AbortError',
    });
  });

  it('fails loudly when the response does not match the schema', async () => {
    stubFetch(Response.json({ n: 'one' }));
    await expect(apiFetch('/x', { schema: z.object({ n: z.number() }) })).rejects.toMatchObject({
      code: 'BAD_RESPONSE',
    });
  });

  it('accepts a 204 when the schema is null', async () => {
    stubFetch(new Response(null, { status: 204 }));
    await expect(apiFetch('/x', { method: 'POST', schema: z.null() })).resolves.toBeNull();
  });
});

describe('fetchMe', () => {
  it('returns the user', async () => {
    stubFetch(Response.json({ user }));
    await expect(fetchMe()).resolves.toEqual(user);
  });

  it('treats 401 as an anonymous visitor, not an error', async () => {
    stubFetch(
      Response.json({ error: { code: 'UNAUTHENTICATED', message: 'No' } }, { status: 401 }),
    );
    await expect(fetchMe()).resolves.toBeNull();
  });

  it('still throws on a server error', async () => {
    stubFetch(Response.json({ error: { code: 'INTERNAL', message: 'x' } }, { status: 500 }));
    await expect(fetchMe()).rejects.toBeInstanceOf(ApiError);
  });
});

describe('401 while signed in', () => {
  const unauth = new ApiError('UNAUTHENTICATED', 401, 'No');

  it('clears the user and every private cache, and flags the expired session', async () => {
    vi.useFakeTimers();
    const client = new QueryClient();
    client.setQueryData(keys.me, user);
    client.setQueryData(['lessons'], [1]);
    client.setQueryData(['progress'], { a: 1 });
    handleUnauthenticated(client, unauth);
    expect(client.getQueryData(keys.me)).toBeNull();
    expect(client.getQueryData(keys.sessionExpired)).toBe(true);
    await vi.advanceTimersByTimeAsync(1);
    expect(client.getQueryData(['lessons'])).toBeUndefined();
    expect(client.getQueryData(['progress'])).toBeUndefined();
    expect(client.getQueryData(keys.me)).toBeNull();
  });

  it('ignores a 401 for a visitor (a wrong password is just a failed attempt)', () => {
    const client = new QueryClient();
    client.setQueryData(keys.me, null);
    handleUnauthenticated(client, unauth);
    expect(client.getQueryData(keys.sessionExpired)).toBeUndefined();
  });

  it('ignores other errors', () => {
    const client = new QueryClient();
    client.setQueryData(keys.me, user);
    handleUnauthenticated(client, new ApiError('FORBIDDEN', 403, 'No'));
    expect(client.getQueryData(keys.me)).toEqual(user);
  });
});

describe('shouldRetry', () => {
  it('retries a 5xx or a network error twice and never a 4xx', () => {
    expect(shouldRetry(0, new ApiError('INTERNAL', 500, 'x'))).toBe(true);
    expect(shouldRetry(0, new ApiError('NETWORK', 0, 'x'))).toBe(true);
    expect(shouldRetry(2, new ApiError('NETWORK', 0, 'x'))).toBe(false);
    expect(shouldRetry(0, new ApiError('NOT_FOUND', 404, 'x'))).toBe(false);
    expect(shouldRetry(0, new Error('x'))).toBe(false);
  });
});

describe('postSse', () => {
  it('posts the body and yields the events of the answer', async () => {
    const fetchFn = stubFetch(
      new Response('event: done\ndata: {"ok":true}\n\n', {
        headers: { 'Content-Type': 'text/event-stream' },
      }),
    );
    const events = [];
    for await (const e of postSse('/conversations/c1/turns', { text: 'hi' })) events.push(e);
    expect(events).toEqual([{ event: 'done', data: { ok: true } }]);
    const init = (fetchFn.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(init.method).toBe('POST');
    expect(init.headers).toMatchObject({ Accept: 'text/event-stream' });
  });

  it('throws the typed error when the stream never opens (429 with a JSON body)', async () => {
    stubFetch(
      Response.json({ error: { code: 'AI_LIMIT_USER', message: 'Daily limit' } }, { status: 429 }),
    );
    const read = async () => {
      for await (const e of postSse('/conversations/c1/turns', { text: 'hi' })) void e;
    };
    await expect(read()).rejects.toMatchObject({ code: 'AI_LIMIT_USER', status: 429 });
  });
});
