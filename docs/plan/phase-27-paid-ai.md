# Phase 27 — Real students: paid AI tier

Waits for him: a card and a cap.

## Step 27.1 — choose the model
- Run the eval set (both sets) on Gemini paid and Claude Haiku 5.5; pick by score, then cost.
  A Claude adapter is one file behind `LlmProvider`.

## Step 27.2 — switch on
- `AI_TIER=paid`, `AI_MONTHLY_BUDGET_USD` (his number), `INVITES_ENABLED=true`; a provider-side
  spend limit as well. His teacher account from phase 21; first invites to consenting students.
