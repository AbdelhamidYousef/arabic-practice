# Phase 7 — Web foundation

Goal: the design system, layout, API client and i18n, so feature UIs are just features.

## Step 7.1 — design tokens and fonts
- `styles/tokens.css`: calm study palette (deep teal primary, warm sand background, ink text, one
  accent for corrections), AA contrast pairs pinned in a test, type weights ≤ 600. Inter for UI,
  Noto Naskh Arabic for Arabic (larger size and line height so harakat don't collide).
- Commit: `feat(web): add design tokens, fonts and contrast tests`

## Step 7.2 — UI kit
- Own small components: Button, Input, Textarea, Card, Badge, Alert, Spinner, Dialog, Tabs, EmptyState,
  `ArabicText` (`lang="ar" dir="rtl"`, font, optional harakat hiding via `stripHarakat`).
- Commit: `feat(web): add base ui components and arabic text`

## Step 7.3 — i18n dictionary
- Typed English dictionary + `t()`; a guard test fails on literal JSX text.
- Commit: `feat(web): add typed ui dictionary`

## Step 7.4 — API client and auth state
- `api/client.ts` (fetch wrapper, typed errors, `credentials: 'include'`), `['me']` query (401 = anonymous),
  a 401 while signed in clears private caches. `api/sse.ts`: POST + `ReadableStream` SSE reader with tests.
- Commit: `feat(web): add typed api client and sse reader`

## Step 7.5 — layout and routes
- `routes.tsx` (one place), header (role-aware nav), footer with the honest one-line free-tier note,
  skip link, focus on route change, server-waking notice, 404 page, `<Seo>` title component.
- Commit: `feat(web): add app layout, routes and not-found page`
