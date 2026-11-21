# Eval report 2026-11-21: gemini

## Run settings

- Provider: gemini
- Correction model: gemini-3.1-flash-lite
- Reply model: gemini-3.1-flash-lite
- Case set: held-out (never used to tune the prompts)
- Parts: corrections and replies
- Limit: none (all cases)
- Pacing: at least 4500 ms between calls to a model, 30 s wait and up to 3 retries on 429 or 5xx busy errors
- Started: 2026-11-21T21:16:46.472Z
- Cases run: 15 corrections (0 errors), 5 replies (0 errors)
- The prompts are the app's own (`prompts/correction.ts`, `prompts/reply.ts`) with the seed lesson as context.

## Corrections: summary

| Metric | Value | Better |
|---|---|---|
| Cases scored | 15 | |
| Verdict accuracy (isCorrect) | 100% | higher |
| False-alarm rate (correct sentences flagged) | 0% | lower |
| Detection rate (wrong sentences flagged) | 100% | higher |
| Type recall (an accepted type was named) | 100% | higher |
| Type precision (predicted types that are accepted) | 91% | higher |
| mustContain hit rate | 100% | higher |
| Cases where everything held | 100% | higher |

### By level

| Level | Cases | Accuracy | False alarms | Detection | Type recall | Type precision | mustContain |
|---|---|---|---|---|---|---|---|
| A1 | 4 | 100% | 0% | 100% | 100% | 100% | 100% |
| A2 | 7 | 100% | 0% | 100% | 100% | 83% | 100% |
| B1 | 3 | 100% | 0% | 100% | 100% | 100% | 100% |
| B2 | 1 | 100% | n/a | 100% | 100% | 100% | 100% |

Correction calls: 15 calls, latency p50 1307 ms, p90 2058 ms; tokens per call in 696 / out 104 (totals 10444 in, 1554 out).

### Failed cases (0 of 15)

A case fails when the verdict is wrong, no accepted mistake type was named, or a mustContain word is missing from the corrected sentence. Expected types are the accepted ones.

None.

## Replies: summary

| Metric | Value |
|---|---|
| Replies scored | 5 |
| Within level (all rules) | 100% |
| Mean harakat ratio | 0.75 |
| Replies with Latin letters | 0 |
| Mean sentences | 2.2 |
| Mean words | 7.6 |
| Mean longest sentence (words) | 4.2 |
| Mean lesson words used | 2.0 |
| Violations | none |

### By level

| Level | Replies | Within level | Harakat ratio | Latin | Sentences | Words | Longest sentence | Lesson words | Limit (sentences x words) |
|---|---|---|---|---|---|---|---|---|---|
| A1 | 1 | 100% | 0.72 | 0 | 2.0 | 5.0 | 3.0 | 1.0 | 2 x 6 |
| A2 | 2 | 100% | 0.77 | 0 | 2.0 | 7.0 | 4.0 | 2.0 | 3 x 8 |
| B1 | 2 | 100% | 0.75 | 0 | 2.5 | 9.5 | 5.0 | 2.5 | 4 x 12 |

Reply calls: 5 calls, latency p50 951 ms, p90 1354 ms; tokens per call in 833 / out 35 (totals 4165 in, 175 out).

### Replies outside the level rules

None.

### Reply samples (up to 3 per level)

**A1**

- ho-rep-01 (learner: مرحبا! أنا طالب من فرنسا.) → أَهْلًا يَا صَدِيقِي. كَيْفَ حَالُكَ؟

**A2**

- ho-rep-02 (learner: كم ثمن هذا القميص الأبيض؟) → ثَمَنُ هَذَا الْقَمِيصِ مِئَةُ رِيَالٍ. هَلْ هَذَا الثَّمَنُ غَالٍ؟
- ho-rep-03 (learner: أنا في الشارع الرئيسي، كيف أذهب إلى المتحف؟) → أَنَا تَائِهٌ. هَلِ الْمَتْحَفُ قَرِيبٌ؟

**B1**

- ho-rep-04 (learner: في وقت الفراغ أرسم وأستمع إلى الموسيقى.) → هَذَا جَمِيلٌ جِدّاً! أَنَا أَيْضاً أُحِبُّ الرَّسْمَ وَالْمُوسِيقَى. هَلْ تُحِبُّ مُمارَسَةَ الرِّيَاضَةِ أَيْضاً؟
- ho-rep-05 (learner: عندي حرارة وسعال منذ أمس.) → سَلَامَتُكَ. هَلْ تُعَانِي مِنْ صُدَاعٍ أَيْضًا؟
