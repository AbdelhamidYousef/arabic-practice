import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { createQueryClient } from './lib/query-client';
import { routes } from './routes';
import './styles/globals.css';

const queryClient = createQueryClient();
const router = createBrowserRouter(routes);

const root = document.getElementById('root');
if (!root) throw new Error('#root element is missing from index.html');

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);

// Offline support (sw/sw.js). Production builds only: in dev, a worker caching files would serve
// stale code between edits. Registered after load so it never competes with the first paint.
// MODE, not PROD: the shared root .env sets NODE_ENV=development, which turns PROD off in local builds.
if (import.meta.env.MODE === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined);
  });
}
