import type { ContentLesson } from '../types.ts';

// A1 L26: at the restaurant. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L26: C16, G23, K11); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-restaurant',
  unit: 'A1.3',
  kind: 'lesson',
  title: 'At the restaurant',
  topic: 'Ordering lunch and asking for the bill',
  summary: 'Read the main words of a menu, order food and drinks, and ask for the bill.',
  goals: [
    'Order a meal and a drink',
    'Say what you want to do: “I want to order”, “I want to pay”',
    'Ask for the bill politely',
  ],
  grammarFocus: '“I want to…”: أُرِيدُ أَنْ + verb, as a phrase: أُرِيدُ أَنْ أَشْرَبَ.',
  scenario:
    'You are Samir, a friendly waiter in a small restaurant in Cairo. Welcome the learner, give ' +
    'them the menu, take their order (food and a drink), suggest koshari or grilled chicken, ' +
    'ask if they want anything else, and bring the bill when they ask. ' +
    'Use very short sentences with أُرِيدُ أَنْ / تُرِيدُ أَنْ and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا وَسَهْلًا! تَفَضَّلْ، هٰذِهِ قَائِمَةُ الطَّعَامِ. مَاذَا تُرِيدُ أَنْ تَأْكُلَ؟',
  vocab: [
    { arabic: 'قَائِمَةُ الطَّعَامِ', translit: 'qāʾimat aṭ-ṭaʿām', english: 'menu' },
    { arabic: 'نَادِلٌ', translit: 'nādil', english: 'waiter' },
    {
      arabic: 'أُرِيدُ',
      translit: 'urīd',
      english: 'I want',
      note: 'You want (to a man): تُرِيدُ; to a woman: تُرِيدِينَ.',
    },
    { arabic: 'خُبْزٌ', translit: 'khubz', english: 'bread' },
    { arabic: 'أَرُزٌّ', translit: 'aruzz', english: 'rice' },
    { arabic: 'دَجَاجٌ', translit: 'dajāj', english: 'chicken' },
    { arabic: 'لَحْمٌ', translit: 'laḥm', english: 'meat' },
    { arabic: 'سَمَكٌ', translit: 'samak', english: 'fish' },
    { arabic: 'سَلَطَةٌ', translit: 'salaṭa', english: 'salad' },
    { arabic: 'حَسَاءٌ', translit: 'ḥasāʾ', english: 'soup' },
    { arabic: 'مَاءٌ', translit: 'māʾ', english: 'water' },
    { arabic: 'عَصِيرٌ', translit: 'ʿaṣīr', english: 'juice' },
    { arabic: 'نَبَاتِيٌّ', translit: 'nabātī', english: 'vegetarian' },
    { arabic: 'لَذِيذٌ', translit: 'ladhīdh', english: 'tasty, delicious' },
    {
      arabic: 'الْحِسَابُ',
      translit: 'al-ḥisāb',
      english: 'the bill',
      note: 'The bill, please: الْحِسَابُ، مِنْ فَضْلِكَ.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'You want to pay. What do you ask for?',
      options: ['الْخُبْزُ', 'الْحِسَابُ', 'الْمَاءُ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick the correct sentence: “I want to drink water.”',
      options: ['أُرِيدُ أَنْ يَشْرَبَ مَاءً', 'أُرِيدُ أَشْرَبُ مَاءً', 'أُرِيدُ أَنْ أَشْرَبَ مَاءً'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'دَجَاجٌ',
      options: ['دَجَاجٌ', 'سَمَكٌ', 'لَحْمٌ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the question you hear.',
      audio: 'هَلْ تُرِيدُ أَنْ تَشْرَبَ شَيْئًا',
      options: ['هَلْ تُرِيدُ أَنْ تَأْكُلَ شَيْئًا', 'هَلْ تُرِيدُ أَنْ تَشْرَبَ شَيْئًا', 'هَلْ تُرِيدِينَ الْحِسَابَ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'خُبْزٌ', english: 'bread' },
        { arabic: 'أَرُزٌّ', english: 'rice' },
        { arabic: 'سَمَكٌ', english: 'fish' },
        { arabic: 'حَسَاءٌ', english: 'soup' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'مَاءٌ', english: 'water' },
        { arabic: 'عَصِيرٌ', english: 'juice' },
        { arabic: 'نَادِلٌ', english: 'waiter' },
        { arabic: 'قَائِمَةُ الطَّعَامِ', english: 'menu' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I want to order chicken and rice.',
      words: ['أُرِيدُ', 'أَنْ', 'أَطْلُبَ', 'دَجَاجًا', 'وَأَرُزًّا'],
      distractors: ['أَطْلُبُ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The bill, please.',
      words: ['الْحِسَابُ', 'مِنْ', 'فَضْلِكَ'],
      distractors: ['الطَّعَامُ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The fish is very tasty.',
      words: ['السَّمَكُ', 'لَذِيذٌ', 'جِدًّا'],
      distractors: ['لَذِيذَةٌ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أُرِيدُ أَنْ',
      after: 'الْحِسَابَ.',
      english: 'I want to pay the bill.',
      options: ['أَدْفَعُ', 'أَدْفَعَ', 'يَدْفَعَ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap (talking to a woman).',
      before: 'مَاذَا',
      after: 'أَنْ تَأْكُلِي؟',
      english: 'What do you want to eat? (to a woman)',
      options: ['تُرِيدُ', 'أُرِيدُ', 'تُرِيدِينَ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'You don’t eat meat or fish. What do you say?',
      options: ['أُرِيدُ لَحْمًا', 'أَنَا نَبَاتِيٌّ', 'السَّمَكُ لَذِيذٌ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To say what you want to do, use أُرِيدُ أَنْ and then a verb. After أَنْ, the verb ends in -a instead of -u: أَشْرَبُ becomes أَنْ أَشْرَبَ.',
    },
    {
      type: 'table',
      head: ['Who', 'Arabic', 'Meaning'],
      rows: [
        ['I', 'أُرِيدُ أَنْ آكُلَ', 'I want to eat'],
        ['you (m)', 'تُرِيدُ أَنْ تَأْكُلَ', 'you want to eat'],
        ['you (f)', 'تُرِيدِينَ أَنْ تَأْكُلِي', 'you want to eat'],
        ['he', 'يُرِيدُ أَنْ يَأْكُلَ', 'he wants to eat'],
        ['she', 'تُرِيدُ أَنْ تَأْكُلَ', 'she wants to eat'],
      ],
    },
    {
      type: 'p',
      text: 'Talking to a woman, ـِينَ loses its ـنَ after أَنْ: تَأْكُلِينَ becomes أَنْ تَأْكُلِي. With a thing instead of an action, just put the noun after أُرِيدُ.',
    },
    {
      type: 'example',
      arabic: 'أُرِيدُ أَنْ أَطْلُبَ، مِنْ فَضْلِكَ.',
      translit: 'urīdu an aṭluba, min faḍlik',
      english: 'I would like to order, please.',
    },
    {
      type: 'example',
      arabic: 'أُرِيدُ مَاءً وَسَلَطَةً.',
      translit: 'urīdu māʾan wa-salaṭa',
      english: 'I want water and a salad.',
    },
  ],
  cultureTip: {
    title: 'Koshari and street food',
    body: 'Koshari is Egypt’s favourite cheap lunch: rice, lentils and pasta topped with chickpeas, a spicy tomato sauce and crispy fried onions. It is vegetarian, filling and served fast in busy koshari shops. For breakfast, try ful (slow-cooked beans) and taʿmiyya, the Egyptian falafel made from broad beans.',
  },
};
