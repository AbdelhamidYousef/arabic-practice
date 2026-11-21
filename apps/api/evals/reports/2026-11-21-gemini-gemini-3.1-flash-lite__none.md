# Eval report 2026-11-21: gemini

## Run settings

- Provider: gemini
- Correction model: gemini-3.1-flash-lite
- Reply model: not run
- Parts: corrections
- Limit: none (all cases)
- Pacing: at least 4500 ms between calls to a model, 30 s wait and up to 3 retries on 429 or 5xx busy errors
- Started: 2026-11-21T07:25:23.096Z
- Cases run: 41 corrections (0 errors), 0 replies (0 errors)
- The prompts are the app's own (`prompts/correction.ts`, `prompts/reply.ts`) with the seed lesson as context.

## Corrections: summary

| Metric | Value | Better |
|---|---|---|
| Cases scored | 41 | |
| Verdict accuracy (isCorrect) | 100% | higher |
| False-alarm rate (correct sentences flagged) | 0% | lower |
| Detection rate (wrong sentences flagged) | 100% | higher |
| Type recall (an accepted type was named) | 96% | higher |
| Type precision (predicted types that are accepted) | 88% | higher |
| mustContain hit rate | 90% | higher |
| Cases where everything held | 93% | higher |

### By level

| Level | Cases | Accuracy | False alarms | Detection | Type recall | Type precision | mustContain |
|---|---|---|---|---|---|---|---|
| A1 | 10 | 100% | 0% | 100% | 100% | 100% | 100% |
| A2 | 13 | 100% | 0% | 100% | 89% | 75% | 75% |
| B1 | 12 | 100% | 0% | 100% | 100% | 100% | 100% |
| B2 | 6 | 100% | 0% | 100% | 100% | 88% | 100% |

Correction calls: 41 calls, latency p50 1161 ms, p90 1473 ms; tokens per call in 702 / out 129 (totals 28785 in, 5281 out).

### Failed cases (3 of 41)

A case fails when the verdict is wrong, no accepted mistake type was named, or a mustContain word is missing from the corrected sentence. Expected types are the accepted ones.

| Id | Level | Text | Expected | Got isCorrect | Got types | Got corrected | Explanation | Why it failed |
|---|---|---|---|---|---|---|---|---|
| prep-01 | A2 | المكتبة أمام من البنك | wrong; types: grammar; must contain: أمام البنك | false | grammar, vocabulary | الْمَكْتَبَةُ أَمَامَ الْمَصْرِفِ. | أمام من → أَمَامَ: The preposition 'أمام' (in front of) does not take the preposition 'من' (from) after it. You should say 'in front of the bank' directly. / البنك → الْمَصْرِفِ: While 'بنك' is understood, 'مَصْرِف' is the preferred MSA term for bank. | mustContain |
| voc-01 | A2 | أريد أن آكل فنجان شاي | wrong; types: vocabulary; must contain: أشرب | false | vocabulary, grammar | أُرِيدُ فِنْجَانَ شَايٍ مِنْ فَضْلِكَ. | آكل → شرب: The verb 'أَكَلَ' (to eat) is used for solid food. For liquids like tea, you should use 'شَرِبَ' (to drink) or simply use the noun directly after 'أُرِيدُ'. / أريد أن → أُرِيدُ: Since you are ordering a noun (a cup of tea), you do not need the particle 'أَنْ' followed by a verb; just use the noun directly. | mustContain |
| har-02 | A2 | ذَهَبْتُ إِلَى الْمَدْرَسَةُ | wrong; types: harakat; must contain: none | false | grammar | ذَهَبْتُ إِلَى الْمَدْرَسَةِ. | الْمَدْرَسَةُ → الْمَدْرَسَةِ: After the preposition 'إِلَى' (to), the noun must be in the genitive case (majrur), which takes a kasra. | type |
