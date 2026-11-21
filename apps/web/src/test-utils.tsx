import { QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { createQueryClient } from './lib/query-client';
import { routes } from './routes';

export const learner = {
  id: 'u1',
  displayName: 'Sara',
  role: 'learner',
  level: 'A2',
  isGuest: false,
  readOnly: false,
  email: 'sara@example.com',
};
export const teacher = { ...learner, id: 't1', displayName: 'Omar', role: 'teacher', level: 'A1' };

export type Handler = (init: { method: string; body: unknown }) => Response | Promise<Response>;
export type Handlers = Record<string, Handler>;

export const jsonError = (code: string, status: number) =>
  Response.json({ error: { code, message: code } }, { status });

/**
 * Stubs fetch by `METHOD /path` (the path after /api/v1). `/auth/me` answers 401 unless a handler
 * says otherwise; any unlisted call is a 404 so a forgotten stub fails loudly.
 */
export function stubApi(handlers: Handlers) {
  const calls: { key: string; body: unknown }[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string, init?: RequestInit) => {
      const method = init?.method ?? 'GET';
      const key = `${method} ${url.replace(/^.*\/api\/v1/, '')}`;
      const body: unknown = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined;
      calls.push({ key, body });
      const handler =
        handlers[key] ??
        (key === 'GET /auth/me' ? () => jsonError('UNAUTHENTICATED', 401) : undefined);
      if (key === 'GET /health') return Promise.resolve(Response.json({ status: 'ok' }));
      return Promise.resolve(
        handler ? handler({ method, body }) : Response.json({}, { status: 404 }),
      );
    }),
  );
  return calls;
}

export function renderAt(path: string): ReturnType<typeof createMemoryRouter> {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <QueryClientProvider client={createQueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  return router;
}
