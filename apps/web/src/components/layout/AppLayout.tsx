import { useEffect, useRef } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';

import { Footer } from './Footer';
import { Header } from './Header';
import { ServerNotice } from './ServerNotice';
import { SkipLink } from './SkipLink';

// The page frame every route renders inside (via <Outlet />). Landmarks: header (banner), nav,
// main, footer (contentinfo). `tabIndex={-1}` lets the skip link and the route-change effect move
// focus to <main> without making it a tab stop.
export function AppLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const lastPath = useRef(pathname);

  // A SPA navigation does not reload the page, so without this keyboard focus stays on the link
  // that was clicked and a screen reader hears nothing. Moving focus to <main> makes it read the
  // new page. Keyed on pathname only, so changing a query string does not yank focus away.
  // Compared with the last path instead of a "first render" flag: StrictMode runs effects twice on
  // mount, and a flag would be spent by the first run. The first load keeps the browser's focus.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <ServerNotice />
      <Header />
      <main ref={mainRef} id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
