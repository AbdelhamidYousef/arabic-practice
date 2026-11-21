# Phase 20 — Design: an Arabic theme

His note (2026-11-21): no Arabic identity; plain, "super clean AI style". Keep it calm and readable
(learners read harakat), but give it a place and a craft.

## Step 20.1 — proposals (no app code)
- Three directions as static HTML mockups in `work/design/` (untracked), served locally. Each one
  shows the homepage hero, a lesson card on the course path, a flashcard and the app icon, at 1280
  and 390 px.
- Each direction has a palette, type pairing, one ornament system (geometric pattern, arch, or
  calligraphic accent) and a short "why".
- No new libraries: the patterns are inline SVG, and the fonts are self-hosted `@fontsource` like today
  (a new font family needs his OK; the proposals name it).

## Step 20.2 — tokens
- Move the colors, radii, shadows and ornament into Tailwind theme tokens and CSS variables, so one
  file holds the look.
- Commit: `feat(web): add the design tokens for the chosen theme`

## Step 20.3 — apply
- Header, footer, homepage, course path, lesson player steps, review, progress, teacher pages.
  Overflow e2e at 390 and 1280 stays green; contrast AA checked.
- Commit(s): `feat(web): apply the arabic theme to …`

## Step 20.4 — icon and splash
- An app icon (SVG master → 192, 512 and maskable PNGs) and the theme colors, for phase 25 and 26.
- Commit: `feat(web): add the app icon`
