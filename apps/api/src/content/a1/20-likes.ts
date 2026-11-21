import type { ContentLesson } from '../types.ts';

// A1 L20: likes and dislikes. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L20: C13, G18); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-likes',
  unit: 'A1.2',
  kind: 'lesson',
  title: 'What you like',
  topic: 'Food, drinks, music, films and sport',
  summary: 'Say what you like and don’t like, ask someone about their tastes, and join two nouns.',
  goals: [
    'Say what you like and what you don’t like',
    'Ask “Do you like…?” and answer it',
    'Join two nouns: “a cup of coffee”, “Karim’s house”',
  ],
  grammarFocus: 'Iḍāfa, two nouns side by side: فِنْجَانُ قَهْوَةٍ، بَيْتُ كَرِيمٍ.',
  scenario:
    'You are Tarek, a friendly colleague having lunch with the learner in Cairo. Chat about what ' +
    'you both like and don’t like: food and drinks, music, films, sport and travel. You love ' +
    'football and coffee and you don’t like cooking. ' +
    'Use very short present-tense sentences with أُحِبُّ and لَا أُحِبُّ and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا! أَنَا طَارِقٌ. هَلْ تُحِبُّ كُرَةَ الْقَدَمِ؟',
  vocab: [
    {
      arabic: 'أُحِبُّ',
      translit: 'uḥibb',
      english: 'I like, I love',
      note: 'Do you like…? هَلْ تُحِبُّ…؟',
    },
    { arabic: 'لَا أُحِبُّ', translit: 'lā uḥibb', english: 'I don’t like' },
    { arabic: 'هِوَايَةٌ', translit: 'hiwāya', english: 'hobby' },
    {
      arabic: 'كُرَةُ الْقَدَمِ',
      translit: 'kurat al-qadam',
      english: 'football',
      note: 'Literally “the ball of the foot”.',
    },
    { arabic: 'الْمُوسِيقَى', translit: 'al-mūsīqā', english: 'music' },
    { arabic: 'فِيلْمٌ', translit: 'film', english: 'film' },
    { arabic: 'الْقِرَاءَةُ', translit: 'al-qirāʾa', english: 'reading' },
    { arabic: 'السِّبَاحَةُ', translit: 'as-sibāḥa', english: 'swimming' },
    { arabic: 'الطَّبْخُ', translit: 'aṭ-ṭabkh', english: 'cooking' },
    { arabic: 'الرِّيَاضَةُ', translit: 'ar-riyāḍa', english: 'sport' },
    { arabic: 'السَّفَرُ', translit: 'as-safar', english: 'travel' },
    { arabic: 'فِنْجَانُ قَهْوَةٍ', translit: 'finjān qahwa', english: 'a cup of coffee' },
    { arabic: 'كُوبُ شَايٍ', translit: 'kūb shāy', english: 'a glass of tea' },
    { arabic: 'لَذِيذٌ', translit: 'ladhīdh', english: 'tasty, delicious' },
    { arabic: 'جِدًّا', translit: 'jiddan', english: 'very' },
    { arabic: 'كَثِيرًا', translit: 'kathīran', english: 'a lot, very much' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “I don’t like”?',
      options: ['أُحِبُّ', 'لَا أُحِبُّ', 'كَثِيرًا'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which one means “a cup of coffee”?',
      options: ['الْفِنْجَانُ قَهْوَةٌ', 'قَهْوَةُ فِنْجَانٍ', 'فِنْجَانُ قَهْوَةٍ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'السِّبَاحَةُ',
      options: ['السِّبَاحَةُ', 'الْقِرَاءَةُ', 'الرِّيَاضَةُ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'أُحِبُّ الْمُوسِيقَى كَثِيرًا',
      options: ['لَا أُحِبُّ الْمُوسِيقَى', 'أُحِبُّ الطَّبْخَ كَثِيرًا', 'أُحِبُّ الْمُوسِيقَى كَثِيرًا'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'كُرَةُ الْقَدَمِ', english: 'football' },
        { arabic: 'السَّفَرُ', english: 'travel' },
        { arabic: 'الطَّبْخُ', english: 'cooking' },
        { arabic: 'فِيلْمٌ', english: 'film' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each phrase with its meaning.',
      pairs: [
        { arabic: 'بَيْتُ سَلْمَى', english: 'Salma’s house' },
        { arabic: 'كُوبُ شَايٍ', english: 'a glass of tea' },
        { arabic: 'فِنْجَانُ قَهْوَةٍ', english: 'a cup of coffee' },
        { arabic: 'كِتَابُ كَرِيمٍ', english: 'Karim’s book' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I like reading very much.',
      words: ['أُحِبُّ', 'الْقِرَاءَةَ', 'كَثِيرًا'],
      distractors: ['لَا'],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'Do you like swimming? (to a man)',
      words: ['هَلْ', 'تُحِبُّ', 'السِّبَاحَةَ'],
      distractors: ['أُحِبُّ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'This is Karim’s house.',
      words: ['هٰذَا', 'بَيْتُ', 'كَرِيمٍ'],
      distractors: ['الْبَيْتُ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَشْرَبُ',
      after: 'شَايٍ صَبَاحًا.',
      english: 'I drink a glass of tea in the morning.',
      options: ['كُوبَ', 'كُوبًا', 'الْكُوبَ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'لَا أُحِبُّ',
      after: 'الْقَدَمِ.',
      english: 'I don’t like football.',
      options: ['الْكُرَةَ', 'كُرَةَ', 'كُرَةً'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'هَلْ تُحِبُّ السَّفَرَ؟',
      options: ['أَنَا مَشْغُولٌ', 'نَعَمْ، أُحِبُّ السَّفَرَ كَثِيرًا', 'يَوْمَ السَّبْتِ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To say “a cup of coffee” or “Karim’s house”, Arabic puts two nouns side by side. This is called iḍāfa. The first noun is the thing, the second says whose it is or what is in it.',
    },
    {
      type: 'p',
      text: 'The first noun never takes الْ and never ends in -un: it is already made definite by the second. The second noun ends in -i (or -in without الْ).',
    },
    {
      type: 'table',
      head: ['Alone', 'In iḍāfa', 'Meaning'],
      rows: [
        ['بَيْتٌ', 'بَيْتُ كَرِيمٍ', 'Karim’s house'],
        ['فِنْجَانٌ', 'فِنْجَانُ قَهْوَةٍ', 'a cup of coffee'],
        ['كُرَةٌ', 'كُرَةُ الْقَدَمِ', 'football'],
      ],
    },
    {
      type: 'p',
      text: 'A word ending in ة is said with a t when it is the first noun: kura, but kurat al-qadam.',
    },
    {
      type: 'example',
      arabic: 'أُحِبُّ فِنْجَانَ قَهْوَةٍ صَبَاحًا.',
      translit: 'uḥibbu finjāna qahwatin ṣabāḥan',
      english: 'I like a cup of coffee in the morning.',
    },
    {
      type: 'example',
      arabic: 'لَا أُحِبُّ كُرَةَ الْقَدَمِ.',
      translit: 'lā uḥibbu kurata l-qadam',
      english: 'I don’t like football.',
    },
  ],
  cultureTip: {
    title: 'Football opens doors',
    body: 'Football is the great conversation starter in Egypt. Ask هَلْ تُحِبُّ كُرَةَ الْقَدَمِ؟ and most people will tell you which of the two big Cairo clubs they support, and why the other one is worse.',
  },
};
