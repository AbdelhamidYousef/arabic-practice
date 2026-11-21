# Eval report 2026-11-21: gemini

## Run settings

- Provider: gemini
- Correction model: not run
- Reply model: gemini-3.1-flash-lite
- Parts: replies
- Limit: none (all cases)
- Pacing: at least 4500 ms between calls to a model, 30 s wait and up to 3 retries on 429 or 5xx busy errors
- Started: 2026-11-21T07:20:14.366Z
- Cases run: 0 corrections (0 errors), 10 replies (0 errors)
- The prompts are the app's own (`prompts/correction.ts`, `prompts/reply.ts`) with the seed lesson as context.

## Replies: summary

| Metric | Value |
|---|---|
| Replies scored | 10 |
| Within level (all rules) | 100% |
| Mean harakat ratio | 0.80 |
| Replies with Latin letters | 0 |
| Mean sentences | 2.1 |
| Mean words | 9.1 |
| Mean longest sentence (words) | 5.8 |
| Mean lesson words used | 1.6 |
| Violations | none |

### By level

| Level | Replies | Within level | Harakat ratio | Latin | Sentences | Words | Longest sentence | Lesson words | Limit (sentences x words) |
|---|---|---|---|---|---|---|---|---|---|
| A1 | 2 | 100% | 0.78 | 0 | 2.0 | 6.5 | 3.5 | 1.5 | 2 x 6 |
| A2 | 3 | 100% | 0.82 | 0 | 2.0 | 6.7 | 5.0 | 1.0 | 3 x 8 |
| B1 | 3 | 100% | 0.81 | 0 | 2.3 | 10.3 | 6.3 | 2.3 | 4 x 12 |
| B2 | 2 | 100% | 0.77 | 0 | 2.0 | 13.5 | 8.5 | 1.5 | 5 x 16 |

Reply calls: 10 calls, latency p50 1003 ms, p90 1137 ms; tokens per call in 794 / out 44 (totals 7938 in, 437 out).

### Replies outside the level rules

None.

### Reply samples (up to 3 per level)

**A1**

- rep-01 (learner: وعليكم السلام! اسمي سارة. كيف حالك؟) → أَنَا بِخَيْرٍ، شُكْرًا. كَيْفَ حَالُكِ أَنْتِ؟
- rep-02 (learner: عندي أخ واحد وأختان.) → مَا شَاءَ اللَّهُ! كَمْ بِنْتًا فِي عَائِلَتِكَ؟

**A2**

- rep-03 (learner: أريد فنجان قهوة بدون سكر من فضلك.) → حَاضِرٌ. هَلْ تُرِيدُ كَعْكَةً مَعَ الْقَهْوَةِ؟
- rep-04 (learner: أين المحطة؟ هل هي بعيدة؟) → لَا أَعْرِفُ. هَلِ الْمَحَطَّةُ قَرِيبَةٌ أَمْ بَعِيدَةٌ؟
- rep-05 (learner: أستيقظ في السادسة وأذهب إلى العمل بالحافلة.) → هَذَا جَمِيلٌ. هَلْ تَتَنَاوَلُ الْفُطُورَ فِي الْبَيْتِ؟

**B1**

- rep-06 (learner: كان الجو أمس باردا جدا، لكن اليوم أدفأ.) → هَذَا جَيِّدٌ. الطَّقْسُ عِنْدِي الآنَ أَبْرَدُ مِنْ عِنْدِكَ. هَلْ تُفَضِّلُ فَصْلَ الصَّيْفِ أَمِ الشِّتَاءِ؟
- rep-07 (learner: سأسافر إلى المغرب في الصيف مع عائلتي.) → هَذِهِ رِحْلَةٌ رَائِعَةٌ. هَلْ حَجَزْتَ فُنْدُقًا فِي الْمَغْرِبِ؟
- rep-08 (learner: رأسي يؤلمني منذ يومين ولا أنام جيدا.) → سَلَامَتُكَ. هَلْ عِنْدَكَ حُمَّى أَوْ سُعَالٌ مَعَ هَذَا الصُّدَاعِ؟

**B2**

- rep-09 (learner: إذا وجدت عملا في شركة دولية، سأنتقل إلى مدينة أخرى.) → هَذَا خَيَارٌ جَيِّدٌ لِلتَّطَوُّرِ الْمِهْنِيِّ. مَا هُوَ التَّخَصُّصُ الَّذِي دَرَسْتَهُ فِي الْجَامِعَةِ؟
- rep-10 (learner: قرأت أن الحكومة ستبني جسرا جديدا فوق النهر.) → هَذَا خَبَرٌ جَيِّدٌ وَمُهِمٌّ لِلنَّقْلِ. هَلْ تُؤَثِّرُ مِثْلُ هَذِهِ المَشَارِيعِ إِيجَابِيّاً عَلَى الاقْتِصَادِ فِي رَأْيِكَ؟
