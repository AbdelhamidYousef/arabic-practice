# Eval report 2026-11-21: gemini

## Run settings

- Provider: gemini
- Correction model: gemini-3.1-flash-lite
- Reply model: not run
- Parts: corrections
- Limit: none (all cases)
- Pacing: at least 4500 ms between calls to a model, 30 s wait and up to 3 retries on 429 or 5xx busy errors
- Started: 2026-11-21T06:52:25.174Z
- Cases run: 41 corrections (0 errors), 0 replies (0 errors)
- The prompts are the app's own (`prompts/correction.ts`, `prompts/reply.ts`) with the seed lesson as context.

## Corrections: summary

| Metric | Value | Better |
|---|---|---|
| Cases scored | 41 | |
| Verdict accuracy (isCorrect) | 95% | higher |
| False-alarm rate (correct sentences flagged) | 7% | lower |
| Detection rate (wrong sentences flagged) | 96% | higher |
| Type recall (an accepted type was named) | 89% | higher |
| Type precision (predicted types that are accepted) | 84% | higher |
| mustContain hit rate | 90% | higher |
| Cases where everything held | 85% | higher |

### By level

| Level | Cases | Accuracy | False alarms | Detection | Type recall | Type precision | mustContain |
|---|---|---|---|---|---|---|---|
| A1 | 10 | 90% | 0% | 83% | 67% | 80% | 100% |
| A2 | 13 | 100% | 0% | 100% | 89% | 75% | 75% |
| B1 | 12 | 92% | 20% | 100% | 100% | 100% | 100% |
| B2 | 6 | 100% | 0% | 100% | 100% | 86% | 100% |

Correction calls: 41 calls, latency p50 1316 ms, p90 1959 ms; tokens per call in 558 / out 127 (totals 22881 in, 5198 out).

### Failed cases (6 of 41)

A case fails when the verdict is wrong, no accepted mistake type was named, or a mustContain word is missing from the corrected sentence. Expected types are the accepted ones.

| Id | Level | Text | Expected | Got isCorrect | Got types | Got corrected | Explanation | Why it failed |
|---|---|---|---|---|---|---|---|---|
| ok-09 | B1 | كان الجو باردا أمس | correct | false | harakat, harakat | كَانَ الْجَوُّ بَارِدًا أَمْسِ | الجو → الْجَوُّ: The noun following the verb 'kāna' is the subject (ism kāna) and should be in the nominative case (marfūʿ), indicated by a damma. For example, 'kāna al-baytu kabīran' (the house was big). / باردا → بَارِدًا: The predicate of 'kāna' (khabar kāna) must be in the accusative case (manṣūb), usually indicated by a fatḥa and an alif. For example, 'kāna al-jawwu ḥārran' (the weather was hot). | verdict |
| prep-01 | A2 | المكتبة أمام من البنك | wrong; types: grammar; must contain: أمام البنك | false | grammar, vocabulary | الْمَكْتَبَةُ أَمَامَ الْمَصْرِفِ | أمام من → أَمَامَ: The preposition 'أَمَامَ' (in front of) does not need the particle 'مِن' after it. It is followed directly by the noun. / البنك → الْمَصْرِفِ: While 'البنك' is widely understood, the lesson uses the specific term 'مَصْرِف' for bank. | mustContain |
| voc-01 | A2 | أريد أن آكل فنجان شاي | wrong; types: vocabulary; must contain: أشرب | false | vocabulary | أُرِيدُ فِنْجَانَ شَايٍ مِنْ فَضْلِكَ. | أن آكل → فِنْجَانَ: The verb 'آكل' (to eat) is used for food, not drinks. You should use the noun 'فِنْجَان' (a cup) directly after the verb 'أُرِيدُ'. | mustContain |
| spell-02 | A1 | مساء النور، اسمي John | wrong; types: spelling, vocabulary; must contain: none | true | none | مَسَاءُ النُّورِ، اِسْمِي جُون. | Excellent work! You used the correct greeting and introduced yourself perfectly. | verdict, type |
| har-01 | A1 | أَنَا طَالِبَةٍ | wrong; types: harakat; must contain: none | false | grammar | أَنَا طَالِبَةٌ | طَالِبَةٍ → طَالِبَةٌ: The noun should be in the nominative case with a damma, not a kasra, because it is the predicate of a nominal sentence. | type |
| har-02 | A2 | ذَهَبْتُ إِلَى الْمَدْرَسَةُ | wrong; types: harakat; must contain: none | false | grammar, grammar | أَذْهَبُ إِلَى الْمَدْرَسَةِ. | ذَهَبْتُ → أَذْهَبُ: You used the past tense, but in this lesson, we are using the present tense (أَذْهَبُ) to describe a daily routine. / الْمَدْرَسَةُ → الْمَدْرَسَةِ: The word following a preposition (like 'إِلَى') must be in the genitive case (kasra), so it should end in 'i'. | type |
