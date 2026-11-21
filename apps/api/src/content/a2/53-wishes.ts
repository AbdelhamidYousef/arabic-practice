import type { ContentLesson } from '../types.ts';

// A2 L53: wishes and intentions. Made-up for this app from the Classroom plan (curriculum/msa/a2.md,
// L53: C43, G47; no culture item, so a short practical tip). The owner reviews the Arabic before real
// learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-wishes',
  unit: 'A2.3',
  kind: 'lesson',
  title: 'Wishes and intentions',
  topic: 'Next year',
  summary: 'Say what you hope for and intend to do next year, and report what you know or think.',
  goals: [
    'Say what you hope and intend: أَتَمَنَّى أَنْ، أَنْوِي أَنْ',
    'Say what you know or think: أَعْرِفُ أَنَّ، أَظُنُّ أَنَّ',
    'Report what someone said with قَالَ إِنَّ',
  ],
  grammarFocus: '“That” before a sentence: أَنَّ after أَعْرِفُ / أَظُنُّ, and إِنَّ after قَالَ.',
  scenario:
    'You are Yasmin, a classmate of the learner at an Arabic language centre in Cairo. It is the ' +
    'last class of the year. Talk about your wishes and plans for next year and ask about theirs: ' +
    'what they hope for, what they intend to do, what they have decided. Use أَتَمَنَّى أَنْ، ' +
    'أَنْوِي أَنْ، أَظُنُّ أَنَّ، أَعْرِفُ أَنَّ and قَالَ إِنَّ in short sentences. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'هَذَا آخِرُ دَرْسٍ هَذِهِ السَّنَةَ! مَاذَا تَتَمَنَّى لِلسَّنَةِ الْقَادِمَةِ؟',
  vocab: [
    {
      arabic: 'تَمَنَّى',
      translit: 'tamannā',
      english: 'he wished',
      note: 'I hope, I wish: أَتَمَنَّى.',
    },
    {
      arabic: 'نَوَى',
      translit: 'nawā',
      english: 'he intended',
      note: 'I intend: أَنْوِي.',
    },
    {
      arabic: 'قَرَّرَ',
      translit: 'qarrara',
      english: 'he decided',
      note: 'Present: يُقَرِّرُ (yuqarriru).',
    },
    {
      arabic: 'تَعَلَّمَ',
      translit: 'taʿallama',
      english: 'he learned',
      note: 'Present: يَتَعَلَّمُ (yataʿallamu).',
    },
    {
      arabic: 'حَقَّقَ',
      translit: 'ḥaqqaqa',
      english: 'he achieved',
      note: 'Present: يُحَقِّقُ (yuḥaqqiqu).',
    },
    { arabic: 'أَمَلٌ', translit: 'amal', english: 'hope' },
    { arabic: 'حُلْمٌ', translit: 'ḥulm', english: 'dream' },
    { arabic: 'هَدَفٌ', translit: 'hadaf', english: 'goal', note: 'Plural: أَهْدَافٌ.' },
    { arabic: 'وَظِيفَةٌ', translit: 'waẓīfa', english: 'job' },
    { arabic: 'السَّنَةُ الْقَادِمَةُ', translit: 'as-sana al-qādima', english: 'next year' },
    { arabic: 'أَعْرِفُ أَنَّ', translit: 'aʿrifu anna', english: 'I know that' },
    { arabic: 'أَظُنُّ أَنَّ', translit: 'aẓunnu anna', english: 'I think that' },
    { arabic: 'قَالَ إِنَّ', translit: 'qāla inna', english: 'he said that' },
    {
      arabic: 'إِنْ شَاءَ اللَّهُ',
      translit: 'in shāʾa llāh',
      english: 'God willing',
      note: 'Added to almost any plan for the future.',
    },
    {
      arabic: 'بِالتَّوْفِيقِ',
      translit: 'bit-tawfīq',
      english: 'good luck',
      note: 'Said to someone who shares a goal or starts something new.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “I know that he is busy”?',
      options: ['أَظُنُّ أَنَّهُ مَشْغُولٌ.', 'أَعْرِفُ أَنَّهُ مَشْغُولٌ.', 'قَالَ إِنَّهُ مَشْغُولٌ.'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word means “that” after قَالَ (he said)?',
      options: ['أَنَّ', 'أَنْ', 'إِنَّ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'مَاذَا تَنْوِي أَنْ تَفْعَلَ السَّنَةَ الْقَادِمَةَ؟',
      options: ['أَنْوِي أَنْ أَتَعَلَّمَ السِّبَاحَةَ.', 'تَعَلَّمْتُ السِّبَاحَةَ أَمْسِ.', 'أَعْرِفُ أَنَّكَ مَشْغُولٌ.'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'أَتَمَنَّى أَنْ أَزُورَ الْمَغْرِبَ',
      options: ['أَنْوِي أَنْ أَزُورَ الْمَغْرِبَ', 'أَتَمَنَّى أَنْ أَزُورَ الْمَغْرِبَ', 'زُرْتُ الْمَغْرِبَ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'قَالَتْ إِنَّهَا سَعِيدَةٌ',
      options: ['قَالَ إِنَّهُ سَعِيدٌ', 'أَظُنُّ أَنَّهَا سَعِيدَةٌ', 'قَالَتْ إِنَّهَا سَعِيدَةٌ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'أَمَلٌ', english: 'hope' },
        { arabic: 'حُلْمٌ', english: 'dream' },
        { arabic: 'هَدَفٌ', english: 'goal' },
        { arabic: 'وَظِيفَةٌ', english: 'job' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each verb with its meaning.',
      pairs: [
        { arabic: 'أَتَمَنَّى', english: 'I hope' },
        { arabic: 'أَنْوِي', english: 'I intend' },
        { arabic: 'قَرَّرْتُ', english: 'I decided' },
        { arabic: 'أَظُنُّ', english: 'I think' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I think that the Arabic language is beautiful.',
      words: ['أَظُنُّ', 'أَنَّ', 'اللُّغَةَ', 'الْعَرَبِيَّةَ', 'جَمِيلَةٌ'],
      distractors: ['اللُّغَةُ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'He said that he will come.',
      words: ['قَالَ', 'إِنَّهُ', 'سَيَأْتِي'],
      distractors: ['أَنَّهُ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَعْرِفُ',
      after: 'تَعْمَلُ كَثِيرًا.',
      english: 'I know that you work a lot.',
      options: ['أَنَّكَ', 'إِنَّكَ', 'أَنْ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'أَنْ أُسَافِرَ إِلَى الْأُرْدُنِّ.',
      english: 'I intend to travel to Jordan.',
      options: ['أَعْرِفُ', 'أَنْوِي', 'قُلْتُ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَتَمَنَّى أَنْ',
      after: 'كُلَّ أَهْدَافِي.',
      english: 'I hope to achieve all my goals.',
      options: ['أُحَقِّقُ', 'حَقَّقْتُ', 'أُحَقِّقَ'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To say “that” before a full sentence, use أَنَّ after verbs like أَعْرِفُ (I know), أَظُنُّ (I think) and سَمِعْتُ (I heard). After قَالَ (he said) and its forms, use إِنَّ.',
    },
    {
      type: 'example',
      arabic: 'أَعْرِفُ أَنَّهُ مَشْغُولٌ.',
      translit: 'aʿrifu annahu mashghūl.',
      english: 'I know that he is busy.',
    },
    {
      type: 'example',
      arabic: 'قَالَتْ إِنَّهَا سَتُسَافِرُ.',
      translit: 'qālat innahā sa-tusāfir.',
      english: 'She said that she will travel.',
    },
    {
      type: 'p',
      text: 'The noun right after أَنَّ or إِنَّ takes the accusative (-a): أَنَّ الطَّقْسَ جَمِيلٌ. A pronoun is joined to it as an ending.',
    },
    {
      type: 'table',
      head: ['Person', 'After أَنَّ', 'After إِنَّ'],
      rows: [
        ['I', 'أَنَّنِي', 'إِنَّنِي'],
        ['you (m)', 'أَنَّكَ', 'إِنَّكَ'],
        ['you (f)', 'أَنَّكِ', 'إِنَّكِ'],
        ['he', 'أَنَّهُ', 'إِنَّهُ'],
        ['she', 'أَنَّهَا', 'إِنَّهَا'],
        ['we', 'أَنَّنَا', 'إِنَّنَا'],
      ],
    },
    {
      type: 'p',
      text: 'Do not mix it up with أَنْ (to), which comes before a verb in the subjunctive: أَتَمَنَّى أَنْ أُسَافِرَ (I hope to travel).',
    },
  ],
  cultureTip: {
    title: 'God willing, and good luck',
    body: 'When people talk about the future in Arabic, they usually add إِنْ شَاءَ اللَّهُ, “God willing”: سَأُسَافِرُ السَّنَةَ الْقَادِمَةَ، إِنْ شَاءَ اللَّهُ. In Egypt it is part of everyday speech for people of every faith. When a friend tells you about a goal, answer with بِالتَّوْفِيقِ, “good luck”.',
  },
};
