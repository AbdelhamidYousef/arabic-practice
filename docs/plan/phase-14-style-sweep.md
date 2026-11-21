# Phase 14 — Style sweep

## Step 14.1 — badges never shrink, Arabic highlights get room
- `Badge` is `shrink-0 whitespace-nowrap` (the A1 badge split into "A / 1" next to a long title).
- `<mark>` around Arabic gets `px-2 py-0.5 box-decoration-clone` (the amber box clipped the letters).
- Commit: `fix(web): keep badges whole and give arabic highlights room`

## Step 14.2 — measured sweep of every route at 390 and 1280 px
- Script in the browser: for every route, list elements wider than their parent, text that wraps one
  character per line, sections taller than the screen, buttons under 44 px. Fix each outlier at its
  component, not the page.
- Commit: `fix(web): style sweep fixes`

## Step 14.3 — header and footer
- Header: logo mark + name, real nav (Course, Review, Progress for learners; Course, How it works,
  Sign in, "Start free" button for visitors), mobile menu button under 640 px.
- Footer: three short columns (Learn, About, Honest notes) and the one privacy line.
- Commit: `feat(web): new header with mobile menu and a real footer`
