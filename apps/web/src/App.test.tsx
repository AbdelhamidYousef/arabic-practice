import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { App } from './App';

function renderApp() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>,
  );
}

describe('App', () => {
  it('shows the name and the API status once health answers', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(Response.json({ status: 'ok' }))),
    );
    renderApp();
    expect(screen.getByRole('heading', { name: 'Arabic Practice' })).toBeInTheDocument();
    expect(await screen.findByText('ok')).toBeInTheDocument();
  });

  it('says the API is unreachable when health fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('offline'))),
    );
    renderApp();
    expect(await screen.findByText('unreachable')).toBeInTheDocument();
  });
});
