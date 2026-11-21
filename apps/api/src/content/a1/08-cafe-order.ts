import type { ContentLesson } from '../types.ts';

// A1 L08: ordering a drink your way. Made-up for this app from the Classroom plan
// (curriculum/msa/a1.md, L08: C05, K05; the row has no grammar spot, so this lesson teaches
// أُرِيدُ + drink and بِـ / بِدُونِ); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-cafe-order',
  unit: 'A1.1',
  kind: 'lesson',
  title: 'Tea your way',
  topic: 'Ordering a drink at the café',
  summary: 'Order a drink just the way you like it: with or without sugar, with milk, hot or cold.',
  goals: [
    'Order a drink with أُرِيدُ',
    'Say “with” and “without”: بِـ and بِدُونِ',
    'Choose between two things with أَمْ',
  ],
  grammarFocus: 'Ordering: أُرِيدُ + drink, then بِـ (with) or بِدُونِ (without) + the extra.',
  scenario:
    'You are Mahmoud, a cheerful waiter in a traditional café (an ahwa) in Cairo. The learner, who ' +
    'is new in the city, sits down. Take their order: ask what they want to drink and how (sugar, ' +
    'milk, mint, lemon, hot or cold), repeat the order back, then bring it and, when they ask, the ' +
    'bill. Use very short sentences and only words from the lesson. Reply only in Arabic with full ' +
    'harakat, ask one short question at a time, and never correct the learner yourself: a separate ' +
    'step does that.',
  openingLine: 'أَهْلًا وَسَهْلًا! شَايٌ أَمْ قَهْوَةٌ؟',
  vocab: [
    { arabic: 'شَايٌ', translit: 'shāy', english: 'tea' },
    { arabic: 'قَهْوَةٌ', translit: 'qahwa', english: 'coffee' },
    { arabic: 'سُكَّرٌ', translit: 'sukkar', english: 'sugar' },
    { arabic: 'حَلِيبٌ', translit: 'ḥalīb', english: 'milk' },
    { arabic: 'نَعْنَاعٌ', translit: 'naʿnāʿ', english: 'mint' },
    { arabic: 'عَصِيرٌ', translit: 'ʿaṣīr', english: 'juice' },
    { arabic: 'لَيْمُونٌ', translit: 'laymūn', english: 'lemon' },
    { arabic: 'كُوبٌ', translit: 'kūb', english: 'glass, mug' },
    {
      arabic: 'فِنْجَانٌ',
      translit: 'finjān',
      english: 'small cup',
      note: 'The little cup for coffee.',
    },
    { arabic: 'سَاخِنٌ', translit: 'sākhin', english: 'hot' },
    { arabic: 'بَارِدٌ', translit: 'bārid', english: 'cold' },
    { arabic: 'بِدُونِ', translit: 'bidūn', english: 'without' },
    { arabic: 'أَمْ', translit: 'am', english: 'or (in a question)' },
    { arabic: 'أُرِيدُ', translit: 'urīd', english: 'I want, I would like' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word means “sugar”?',
      options: ['حَلِيبٌ', 'سُكَّرٌ', 'نَعْنَاعٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'You want your tea with no sugar. What do you say?',
      options: ['شَايٌ بِدُونِ سُكَّرٍ', 'شَايٌ بِالسُّكَّرِ', 'عَصِيرُ لَيْمُونٍ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the order you hear.',
      audio: 'قَهْوَةٌ بِالْحَلِيبِ',
      options: ['قَهْوَةٌ بِدُونِ حَلِيبٍ', 'شَايٌ بِالْحَلِيبِ', 'قَهْوَةٌ بِالْحَلِيبِ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the order you hear.',
      audio: 'أُرِيدُ عَصِيرًا بَارِدًا',
      options: ['أُرِيدُ عَصِيرًا بَارِدًا', 'أُرِيدُ شَايًا سَاخِنًا'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'حَلِيبٌ', english: 'milk' },
        { arabic: 'نَعْنَاعٌ', english: 'mint' },
        { arabic: 'لَيْمُونٌ', english: 'lemon' },
        { arabic: 'سَاخِنٌ', english: 'hot' },
        { arabic: 'فِنْجَانٌ', english: 'small cup' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the order.',
      english: 'I would like tea with mint, please.',
      words: ['أُرِيدُ', 'شَايًا', 'بِالنَّعْنَاعِ', 'مِنْ', 'فَضْلِكَ'],
      distractors: ['بِدُونِ'],
    },
    {
      type: 'build',
      prompt: 'Build the order.',
      english: 'Coffee without sugar.',
      words: ['قَهْوَةٌ', 'بِدُونِ', 'سُكَّرٍ'],
      distractors: ['حَلِيبٌ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'شَايٌ',
      after: 'قَهْوَةٌ؟',
      english: 'Tea or coffee?',
      options: ['فِي', 'أَمْ', 'مِنْ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أُرِيدُ',
      after: '، مِنْ فَضْلِكَ.',
      english: 'I would like a coffee, please.',
      options: ['قَهْوَةٌ', 'قَهْوَةً'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick the right phrase: “a cold juice”.',
      options: ['عَصِيرٌ بَارِدَةٌ', 'عَصِيرٌ بَارِدٌ', 'بَارِدٌ عَصِيرٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'You have finished. What do you ask the waiter?',
      options: ['أَلُو؟', 'مِنْ أَيْنَ أَنْتَ؟', 'الْحِسَابُ، مِنْ فَضْلِكَ'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To order, say أُرِيدُ (urīd), “I want”, and the drink. After أُرِيدُ the drink ends in -an (ـً): شَايٌ → شَايًا, قَهْوَةٌ → قَهْوَةً. Add مِنْ فَضْلِكَ and it is polite.',
    },
    {
      type: 'example',
      arabic: 'أُرِيدُ قَهْوَةً، مِنْ فَضْلِكَ',
      translit: 'urīd qahwatan, min faḍlika',
      english: 'I would like a coffee, please.',
    },
    {
      type: 'p',
      text: 'For the extras, use بِـ (bi-), “with”, joined to the next word, and بِدُونِ (bidūn), “without”. With الـ, بِـ joins straight on: بِالْحَلِيبِ. The word after both ends in a kasra.',
    },
    {
      type: 'table',
      head: ['Arabic', 'Meaning'],
      rows: [
        ['شَايٌ بِالنَّعْنَاعِ', 'tea with mint'],
        ['قَهْوَةٌ بِالْحَلِيبِ', 'coffee with milk'],
        ['شَايٌ بِدُونِ سُكَّرٍ', 'tea without sugar'],
        ['عَصِيرُ لَيْمُونٍ', 'lemon juice'],
      ],
    },
    {
      type: 'p',
      text: 'To offer a choice in a question, Arabic uses أَمْ (am), “or”: شَايٌ أَمْ قَهْوَةٌ؟ (tea or coffee?).',
    },
    {
      type: 'example',
      arabic: 'أُرِيدُ شَايًا بِالنَّعْنَاعِ',
      translit: 'urīd shāyan bi-n-naʿnāʿ',
      english: 'I would like tea with mint.',
    },
  ],
  cultureTip: {
    title: 'The ahwa and tea your way',
    body: 'The ahwa (in MSA مَقْهًى) is the traditional Egyptian café: chairs out on the pavement, tea in small glasses, backgammon and long talks. Tea is strong and often very sweet, so say how you like it: بِدُونِ سُكَّرٍ, or سُكَّرٌ قَلِيلٌ for a little sugar, بِالنَّعْنَاعِ for mint, بِالْحَلِيبِ for milk.',
  },
};
