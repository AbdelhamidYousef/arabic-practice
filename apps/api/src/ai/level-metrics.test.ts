import { describe, expect, it } from 'vitest';

import { measureReply } from './level-metrics.ts';

// Made-up replies. Full harakat on the first, none on the second.
const VOWELED = 'أَهْلًا بِكَ فِي الْمَقْهَى! مَاذَا تُرِيدُ؟';
const PLAIN = 'اهلا بك في المقهى! ماذا تريد؟';

describe('measureReply', () => {
  it('counts words and sentences, and finds the longest sentence', () => {
    const m = measureReply({ reply: VOWELED, level: 'A1' });
    expect(m).toMatchObject({ wordCount: 6, sentenceCount: 2, longestSentence: 4, latinChars: 0 });
    expect(m.harakatRatio).toBeGreaterThan(0.55);
  });

  it('passes a short, fully voweled A1 reply', () => {
    expect(measureReply({ reply: VOWELED, level: 'A1' })).toMatchObject({
      withinLevel: true,
      violations: [],
    });
  });

  it('flags missing harakat at A1 but not at C1', () => {
    expect(measureReply({ reply: PLAIN, level: 'A1' }).violations).toEqual(['missing_harakat']);
    expect(measureReply({ reply: PLAIN, level: 'C1' }).withinLevel).toBe(true);
    expect(measureReply({ reply: PLAIN, level: 'B2' }).withinLevel).toBe(true);
  });

  it('flags too many sentences and too long a sentence, by level', () => {
    const three = 'أَهْلًا. مَرْحَبًا. شُكْرًا.';
    expect(measureReply({ reply: three, level: 'A1' }).violations).toEqual(['too_many_sentences']);
    expect(measureReply({ reply: three, level: 'A2' }).withinLevel).toBe(true);
    const long = 'أَنَا أُحِبُّ أَنْ أَشْرَبَ الْقَهْوَةَ مَعَ أَصْدِقَائِي فِي الصَّبَاحِ';
    expect(measureReply({ reply: long, level: 'A1' }).violations).toEqual(['sentence_too_long']);
    expect(measureReply({ reply: long, level: 'B1' }).withinLevel).toBe(true);
  });

  it('flags Latin letters', () => {
    const m = measureReply({ reply: 'أَهْلًا hello', level: 'A1' });
    expect(m.latinChars).toBe(5);
    expect(m.violations).toContain('latin_letters');
  });

  it('treats an empty or non-Arabic reply as a violation, not a pass', () => {
    expect(measureReply({ reply: '', level: 'C2' })).toMatchObject({
      withinLevel: false,
      violations: ['empty'],
      wordCount: 0,
      longestSentence: 0,
    });
    expect(measureReply({ reply: '   ؟؟ ', level: 'A1' }).violations).toEqual(['empty']);
  });

  it('counts a long reply on the line breaks too', () => {
    expect(measureReply({ reply: 'أَهْلًا\nمَرْحَبًا', level: 'A1' }).sentenceCount).toBe(2);
  });
});

describe('vocabulary hits', () => {
  const vocab = ['قَهْوَة', 'شَاي', 'صَبَاح الْخَيْر'];

  it('matches regardless of harakat, ta marbuta shape and attached prefixes', () => {
    const m = measureReply({ reply: 'تُرِيدُ الْقَهْوَةَ أَمْ وَالشَّاي؟', level: 'A2', lessonVocab: vocab });
    expect(m.vocabHits).toBe(2);
    expect(m.vocabUsed).toEqual(['قَهْوَة', 'شَاي']);
  });

  it('matches a phrase only when its words are in a row, and counts each entry once', () => {
    expect(
      measureReply({ reply: 'صباح الخير! صباح الخير!', level: 'A1', lessonVocab: vocab }).vocabHits,
    ).toBe(1);
    expect(
      measureReply({ reply: 'صباح جميل الخير', level: 'A1', lessonVocab: vocab }).vocabHits,
    ).toBe(0);
  });

  it('does not match a word that merely contains a lesson word', () => {
    expect(measureReply({ reply: 'شَايِّي', level: 'A1', lessonVocab: ['شَاي'] }).vocabHits).toBe(0);
  });

  it('is zero with no vocabulary', () => {
    expect(measureReply({ reply: VOWELED, level: 'A1' }).vocabHits).toBe(0);
  });
});
