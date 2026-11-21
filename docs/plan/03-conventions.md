# Plan 03 — Conventions and definition of done

Pawsome's conventions (`../store-pawsome/docs/plan/03-conventions.md`) apply unless this file says otherwise.

## Working rhythm (every step)
1. Read the step's "Learn / explain" first.
2. Build the step; keep to the files it names, or say why not.
3. Gates green (below). New behaviour has tests.
4. Commit (one step = one commit; this build has his approval to commit and push, 2026-11-21).
5. Log decisions in `04-decisions-log.md` under the phase heading, tagged REVIEW; add the step's
   learn note to `05-build-journal.md`; keep `06-handover.md` current.

## Gates
```
find . -name '*.tsbuildinfo' -not -path '*/node_modules/*' -delete
pnpm typecheck && pnpm lint && pnpm format:check && pnpm test
pnpm e2e        # at phase ends and before every push; check `ss -ltnp | grep -E '3102|5275'` first
```
Run tests one package at a time (`pnpm -r --workspace-concurrency=1 test`); never two suites on one test DB.

## Code style (as Pawsome)
- TS strict, `noUncheckedIndexedAccess`; no `any`, no `@ts-ignore`.
- API module shape: `router.ts` (HTTP) → `service.ts` (rules) → `repo.ts` (Drizzle). Errors are
  `AppError(code, status, message)`; the error middleware is the only place they become HTTP.
- No fetches inside components: typed client in `apps/web/src/api/`, hooks in `features/<x>/queries.ts`.
- Comments say why, not what.
- Files `kebab-case.ts`, components `PascalCase.tsx`.

## AI rules
- Every model call goes through `LlmProvider` (`apps/api/src/ai/provider.ts`). Nothing else imports
  an adapter. Every call is recorded in `ai_calls` (purpose, model, tokens, latency, cost, status).
- Prompts live in `apps/api/src/ai/prompts/*.ts` as pure functions `(input) => { system, messages }`.
  They are unit-tested with snapshot-free assertions (the prompt contains the level rules, the vocab, and so on).
- Model JSON is parsed with Zod. On a schema miss, retry once, then fail with `AI_FAILED`.
- The fake provider is selected only when `NODE_ENV=test` or no key is configured in development;
  production refuses to boot with `AI_PROVIDER=fake`.
- Live tests (`*.live.test.ts`) run only with `GEMINI_API_KEY` set, skip loudly otherwise, and are
  excluded from `pnpm test` (`pnpm test:live`).

## Arabic text rules
- Arabic is always rendered inside an element with `lang="ar" dir="rtl"` and the Arabic font class.
- Comparisons go through `normalizeArabic()` from `@arabic/shared`, never raw string equality.
- UI strings go through `t()` (English dictionary, typed keys). Arabic lesson content is data, not UI strings.

## Course content (phase 16)
- Lessons are typed content files: `apps/api/src/content/<level>/<nn>-<slug>.ts` (one `ContentLesson`
  each), the unit list in `content/units.ts`, collected in order by `content/index.ts`. The seed
  upserts them by slug; `content/validate.ts` checks every file before anything is written (and runs
  in unit tests). Never edit course lessons through the teacher area: the seed would overwrite them.
- Arabic is always fully voweled. Letters taught alone (letter-recognition options) are the one
  exception: a lone letter carries no mark.
- **Transliteration scheme** (`translit` on every word, and in grammar examples): Latin letters only.
  Long vowels `ā ī ū`; `ʿ` for ع and `ʾ` for the hamza; emphatic `ḥ ṣ ḍ ṭ ẓ`; digraphs `kh gh sh th dh`;
  `q` ق, `j` ج. Doubled letters stay doubled (`ʿalla`, `as-salām`). The article is `al-`, assimilated
  before sun letters (`as-salām`, `an-nūr`) and joined with a hyphen. Case endings are left out (the
  form you say in a pause: `bāb`, not `bābun`), except the `-an` of tanwin fatha, which is heard
  (`shukran`). Fixed phrases are written as they are said (`as-salāmu ʿalaykum`).
  Tā marbūṭa (ة) at a pause is `-a` (`qahwa`, `madīna`); after a long ā it is `-āh` (`ḥayāh`).

## Testing rules
- Unit: shared helpers, prompt builders, scorer, budget maths.
- Integration: `createApp(deps)` with the fake provider against Postgres `arabic_test`; tables are
  emptied with DELETE in FK order (only tables with rows) before each test; `fileParallelism: false`.
- E2E: guest flow (lesson → three turns → correction visible → progress shows mistakes → review),
  teacher demo (read-only), the overflow check at 390 and 1280 px, keyboard-only chat send.
- Test names read as sentences.

## Commits
Conventional, scoped: `feat(api):`, `feat(web):`, `feat(shared):`, `chore(repo):`, `test(e2e):`, `docs:`, `ci:`.
End with the attribution line the session requires.

## Definition of done: per phase
Every step meets its acceptance, gates green, `.env.example` current, journal + quiz written, decisions logged.

## Definition of done: whole project
- Deployed demo URL: a guest can practise a lesson end to end; the demo teacher view works.
- README is a case study: problem, architecture, the level-control approach, eval results, cost table.
- A fresh clone works following the README alone.
- No secrets in git history (gitleaks in CI).
- Lighthouse accessibility ≥ 95 on landing, lessons, practice, progress.
