# Eval report 2026-11-21: gemini

## Run settings

- Provider: gemini
- Correction model: gemini-3.5-flash-lite
- Reply model: gemini-3.1-flash-lite
- Parts: corrections and replies
- Limit: none (all cases)
- Pacing: at least 4500 ms between calls to a model, 30 s wait and up to 3 retries on 429 or 5xx busy errors
- Started: 2026-11-21T06:49:15.269Z
- Cases run: 41 corrections (0 errors), 10 replies (0 errors)
- The prompts are the app's own (`prompts/correction.ts`, `prompts/reply.ts`) with the seed lesson as context.

## Corrections: summary

| Metric | Value | Better |
|---|---|---|
| Cases scored | 41 | |
| Verdict accuracy (isCorrect) | 95% | higher |
| False-alarm rate (correct sentences flagged) | 7% | lower |
| Detection rate (wrong sentences flagged) | 96% | higher |
| Type recall (an accepted type was named) | 89% | higher |
| Type precision (predicted types that are accepted) | 87% | higher |
| mustContain hit rate | 90% | higher |
| Cases where everything held | 85% | higher |

### By level

| Level | Cases | Accuracy | False alarms | Detection | Type recall | Type precision | mustContain |
|---|---|---|---|---|---|---|---|
| A1 | 10 | 90% | 0% | 83% | 67% | 80% | 100% |
| A2 | 13 | 100% | 0% | 100% | 89% | 75% | 75% |
| B1 | 12 | 92% | 20% | 100% | 100% | 100% | 100% |
| B2 | 6 | 100% | 0% | 100% | 100% | 100% | 100% |

Correction calls: 41 calls, latency p50 2060 ms, p90 7628 ms; tokens per call in 558 / out 116 (totals 22881 in, 4745 out).

### Failed cases (6 of 41)

A case fails when the verdict is wrong, no accepted mistake type was named, or a mustContain word is missing from the corrected sentence. Expected types are the accepted ones.

| Id | Level | Text | Expected | Got isCorrect | Got types | Got corrected | Explanation | Why it failed |
|---|---|---|---|---|---|---|---|---|
| ok-09 | B1 | كان الجو باردا أمس | correct | false | grammar | كَانَ الْجَوُّ بَارِداً أَمْسِ | باردا → بَارِداً: When using كان, the predicate (khabar) must be in the accusative case (mansoub) with tanween al-fath. For example, كان الطقسُ حَارّاً. | verdict |
| agr-04 | A2 | هو تذهب إلى المدرسة | wrong; types: grammar; must contain: يذهب | false | grammar | هِيَ تَذْهَبُ إِلَى الْمَدْرَسَةِ | هو → هِيَ: Use هِيَ for feminine subjects (she) and تَذْهَبُ with the prefix تـ. | mustContain |
| voc-01 | A2 | أريد أن آكل فنجان شاي | wrong; types: vocabulary; must contain: أشرب | false | vocabulary, grammar | أُرِيدُ شَايًّا مِنْ فَضْلِكَ | فنجان → كوب أو كأس: We use cup (كُوب) for drinks, while (فِنْجَان) is usually used for coffee. Also, tea is a drink, so we do not use the verb (آكُل) meaning 'to eat'. / آكل → أشرب: Tea is a drink, so you should use the verb (أَشْرَبُ) to drink, instead of (آكُلُ) to eat. | mustContain |
| spell-02 | A1 | مساء النور، اسمي John | wrong; types: spelling, vocabulary; must contain: none | true | none | مَسَاءُ النُّورِ، اِسْمِي جُون. | Great job! Your greeting and introduction are completely correct. | verdict, type |
| har-01 | A1 | أَنَا طَالِبَةٍ | wrong; types: harakat; must contain: none | false | grammar | أَنَا طَالِبَةٌ | طَالِبَةٍ → طَالِبَةٌ: Use a damma at the end of the noun because it is a nominal sentence. | type |
| har-02 | A2 | ذَهَبْتُ إِلَى الْمَدْرَسَةُ | wrong; types: harakat; must contain: none | false | grammar | ذَهَبْتُ إِلَى الْمَدْرَسَةِ | الْمَدْرَسَةُ → الْمَدْرَسَةِ: After the preposition إِلَى, nouns take a kasra (genitive case). | type |

## Replies: summary

| Metric | Value |
|---|---|
| Replies scored | 10 |
| Within level (all rules) | 80% |
| Mean harakat ratio | 0.80 |
| Replies with Latin letters | 0 |
| Mean sentences | 2.5 |
| Mean words | 10.3 |
| Mean longest sentence (words) | 5.4 |
| Mean lesson words used | 2.1 |
| Violations | too_many_sentences 2 |

### By level

| Level | Replies | Within level | Harakat ratio | Latin | Sentences | Words | Longest sentence | Lesson words | Limit (sentences x words) |
|---|---|---|---|---|---|---|---|---|---|
| A1 | 2 | 0% | 0.76 | 0 | 3.0 | 9.0 | 3.0 | 2.0 | 2 x 6 |
| A2 | 3 | 100% | 0.79 | 0 | 2.7 | 9.0 | 4.3 | 2.0 | 3 x 8 |
| B1 | 3 | 100% | 0.85 | 0 | 2.0 | 8.0 | 5.0 | 1.7 | 4 x 12 |
| B2 | 2 | 100% | 0.80 | 0 | 2.5 | 17.0 | 10.0 | 3.0 | 5 x 16 |

Reply calls: 10 calls, latency p50 1338 ms, p90 2086 ms; tokens per call in 677 / out 51 (totals 6771 in, 507 out).

### Replies outside the level rules

| Id | Level | Violations | Harakat ratio | Sentences | Longest | Reply |
|---|---|---|---|---|---|---|
| rep-01 | A1 | too_many_sentences | 0.77 | 3 | 3 | أَهْلًا يَا سَارَة. أَنَا بِخَيْرٍ، شُكْرًا. كَيْفَ حَالُكِ أَنْتِ؟ |
| rep-02 | A1 | too_many_sentences | 0.75 | 3 | 3 | مَا شَاءَ اللَّهُ! لِي أُخْتٌ وَاحِدَةٌ. هَلْ هِيَ كَبِيرَةٌ؟ |

### Reply samples (up to 3 per level)

**A1**

- rep-01 (learner: وعليكم السلام! اسمي سارة. كيف حالك؟) → أَهْلًا يَا سَارَة. أَنَا بِخَيْرٍ، شُكْرًا. كَيْفَ حَالُكِ أَنْتِ؟
- rep-02 (learner: عندي أخ واحد وأختان.) → مَا شَاءَ اللَّهُ! لِي أُخْتٌ وَاحِدَةٌ. هَلْ هِيَ كَبِيرَةٌ؟

**A2**

- rep-03 (learner: أريد فنجان قهوة بدون سكر من فضلك.) → حَاضِرٌ! هَلْ تُرِيدُ كَعْكَةً أَيْضًا؟
- rep-04 (learner: أين المحطة؟ هل هي بعيدة؟) → هَلْ هِيَ بَعِيدَةٌ؟ أَنَا لَا أَعْرِفُ الطَّرِيقَ. أَيْنَ الْمَحَطَّةُ يَا صَدِيقِي؟
- rep-05 (learner: أستيقظ في السادسة وأذهب إلى العمل بالحافلة.) → هَذَا جَمِيلٌ! أَنَا أَعْمَلُ كَثِيرًا وَأَنَامُ مُتَأَخِّرًا. مَاذَا تَفْعَلُ بَعْدَ الْعَمَلِ؟

**B1**

- rep-06 (learner: كان الجو أمس باردا جدا، لكن اليوم أدفأ.) → هَلْ الطَّقْسُ مُشْمِسٌ الْيَوْمَ عِنْدَكَ؟ أَيُّ فَصْلٍ مِنَ الْفُصُولِ تُحِبُّ؟
- rep-07 (learner: سأسافر إلى المغرب في الصيف مع عائلتي.) → هَذِهِ رِحْلَةٌ رَائِعَةٌ. هَلْ حَجَزْتَ تَذْكِرَةَ الطَّائِرَةِ وَفُنْدُقًا لِلْإِقَامَةِ؟
- rep-08 (learner: رأسي يؤلمني منذ يومين ولا أنام جيدا.) → سَلَامَتُكَ. هَلْ عِنْدَكَ حُمَّى أَيْضًا؟

**B2**

- rep-09 (learner: إذا وجدت عملا في شركة دولية، سأنتقل إلى مدينة أخرى.) → هَذَا خَيَارٌ جَيِّدٌ. هَلْ يُمْكِنُكَ أَنْ تُخْبِرَنِي عَنِ التَّخَصُّصِ الَّذِي دَرَسْتَهُ فِي الْجَامِعَةِ؟
- rep-10 (learner: قرأت أن الحكومة ستبني جسرا جديدا فوق النهر.) → هَذَا خَبَرٌ جَيِّدٌ. أُعْلِنَ أَيْضًا عَنْ قَرَارٍ لِدَعْمِ الاِقْتِصَادِ بَعْدَ ارْتِفَاعِ أَسْعَارِ الْوَقُودِ. كَيْفَ تُؤَثِّرُ هَذِهِ الأَخْبَارُ عَلَى الاِقْتِصَادِ فِي رَأْيِكَ؟
