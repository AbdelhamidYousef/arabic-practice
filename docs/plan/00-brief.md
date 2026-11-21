# Brief: Arabic Practice (portfolio project 3)

_From HQ, 2026-11-21. Decided by HQ: what it is, why, the stack. Everything else (scope, features,
data model, UI, hosting) is for this session and him to work out._

## Why this project
- "AI integration" (putting LLM APIs into real software) is the fastest-growing dev skill on Upwork
  (+178% YoY, Upwork In-Demand Skills 2026). Full stack + AI is where the job volume is.
- It is real, not a demo: he teaches Arabic (Preply) and can test it with his own students, so the
  case study has real users and feedback. It also serves tutoring and the YouTube channel.
- It shows what a store can't: prompt design, structured output, evaluation, cost control, streaming.

## What it is (starting point, refine together)
A learner practises Arabic between lessons with an AI partner that stays at their level:
- Conversation practice in a chosen dialect or MSA, at a CEFR level (A1 → C2), on a lesson's topic
- Corrections with explanations (grammar, word choice, harakat), not just rewrites
- The teacher (him) sets topics/vocabulary per lesson; the learner's progress and mistakes are tracked
- Possibly: homework review, vocabulary review (spaced repetition), voice later
Hard part to get right, and to write up: keeping the model at the learner's level and dialect, and
measuring that (a small eval set of graded answers).

## Stack (decided)
- React + TypeScript front end, Node API, Postgres
- An LLM API behind one provider interface (see question 1), streaming responses, structured output
- Free tiers for hosting (as Pawsome: Vercel + Neon)

## Step 0: learn from the earlier portfolio projects (before the plan)
Read how the sibling projects were built and pull out what should carry over here:
- `../store-pawsome`: `CLAUDE.md`, `docs/plan/03-conventions.md`, `04-decisions-log.md`, `05-build-journal.md`
- `../grocery`: `CLAUDE.md`, `docs/plan/04-decisions-log.md`, `05-build-journal.md`, `06-handover.md`, `work/`
- `../ecommerce-work/work/polish/`: the multi-agent polish job (`contract.md`, `parts/`, `qa-findings.md`,
  `NEXT-SESSION.md`) — how work was split into lanes, reviewed, and what broke
Look for: how cheap we go (tokens, models, when to use subagents), speed (what made suites and builds
slow, and the fixes), how work was split and reviewed, QA habits, mistakes not to repeat, and what he
corrected or praised. Ignore e-commerce domain detail.
**Show him the learnings as short bullet points, grouped, and wait for his OK** (he may cut or edit
some). Only then write the approved ones to `work/learnings.md`.

## Open questions for him
1. **LLM provider: decided, free first** (his call, 2026-11-21).
   - **Build and test on Gemini's free API tier** (Google AI Studio key, no card). Check today's
     free limits on Google's official page before relying on them.
   - **Free-tier caveat:** Google may use free-tier prompts to improve its products, so only made-up
     test chats go through it. No real student uses the free tier.
   - **Real students → a paid tier** (about $5 prepaid to start, with a spend limit): choose
     between Gemini paid and Claude Haiku 5.5 with the eval set. HQ's estimate for Haiku: ~2k tokens
     in + ~300 out per turn ≈ $0.0004, so ~4,000 turns a month ≈ $1.50. Paid spend only on his OK.
   - All calls go through one provider interface, so switching is a config change plus an adapter.
2. Dialect focus first: Egyptian, Levantine, MSA, or what his students actually learn?
3. Teacher side in v1 (him setting lessons), or learner-only first?
4. Public demo: open sign-up with tight limits, or invite-only with a demo account?

## Context
- Pawsome repo: `../store-pawsome`. Its tooling, gates, auth/session design and conventions
  (`docs/plan/03-conventions.md`) are a good model; reuse the setup, not the e-commerce code.
- His course structure (A1 → C2) lives in his private teaching repo; ask him for what you need.
  Don't read student files.
