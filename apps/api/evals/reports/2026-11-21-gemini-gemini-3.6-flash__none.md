# Eval report 2026-11-21: gemini

## Run settings

- Provider: gemini
- Correction model: gemini-3.6-flash
- Reply model: not run
- Parts: corrections
- Limit: 18 per part, evenly spread
- Pacing: at least 4500 ms between calls to a model, 30 s wait and up to 3 retries on 429 or 5xx busy errors
- Started: 2026-11-21T06:58:36.226Z
- Cases run: 18 corrections (11 errors), 0 replies (0 errors)
- The prompts are the app's own (`prompts/correction.ts`, `prompts/reply.ts`) with the seed lesson as context.

## Corrections: summary

| Metric | Value | Better |
|---|---|---|
| Cases scored | 7 | |
| Verdict accuracy (isCorrect) | 100% | higher |
| False-alarm rate (correct sentences flagged) | 0% | lower |
| Detection rate (wrong sentences flagged) | 100% | higher |
| Type recall (an accepted type was named) | 100% | higher |
| Type precision (predicted types that are accepted) | 100% | higher |
| mustContain hit rate | 100% | higher |
| Cases where everything held | 100% | higher |

### By level

| Level | Cases | Accuracy | False alarms | Detection | Type recall | Type precision | mustContain |
|---|---|---|---|---|---|---|---|
| A1 | 2 | 100% | 0% | 100% | 100% | 100% | n/a |
| A2 | 3 | 100% | 0% | 100% | 100% | 100% | 100% |
| B1 | 2 | 100% | 0% | n/a | n/a | n/a | n/a |

Correction calls: 7 calls, latency p50 6750 ms, p90 12744 ms; tokens per call in 561 / out 517 (totals 3929 in, 3616 out).

### Failed cases (0 of 7)

A case fails when the verdict is wrong, no accepted mistake type was named, or a mustContain word is missing from the corrected sentence. Expected types are the accepted ones.

None.

### Correction calls that errored

- ok-03: LlmFailed: Gemini did not answer in time
- ok-07: LlmFailed: Gemini did not answer in time
- ok-12: LlmFailed: Gemini did not answer in time
- num-01: LlmFailed: Gemini did not answer in time
- case-01: LlmBadOutput: Gemini gemini-3.6-flash: the answer was not valid JSON, twice
- case-04: LlmFailed: Gemini did not answer in time
- verb-02: LlmBadOutput: Gemini gemini-3.6-flash: the answer was not valid JSON, twice
- comp-01: LlmFailed: Gemini did not answer in time
- prep-01: LlmFailed: Gemini did not answer in time
- reg-01: LlmFailed: Gemini did not answer in time
- ord-02: LlmFailed: Gemini did not answer in time
