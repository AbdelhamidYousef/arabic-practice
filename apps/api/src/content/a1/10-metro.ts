import type { ContentLesson } from '../types.ts';

// A1 L10: taking the metro. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L10: C06, K06; the row has no grammar spot, so this lesson teaches أَيْنَ + place with هُنَا /
// هُنَاكَ, and one / two tickets); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-metro',
  unit: 'A1.1',
  kind: 'lesson',
  title: 'Taking the metro',
  topic: 'Finding the station, buying a ticket, getting out',
  summary: 'Ask where something is, buy a metro ticket and find the way out.',
  goals: [
    'Ask where a place is with أَيْنَ',
    'Understand here, there, right and left',
    'Buy one or two tickets',
  ],
  grammarFocus: 'أَيْنَ + place? Answers: هُنَا, هُنَاكَ, عَلَى الْيَمِينِ, عَلَى الْيَسَارِ.',
  scenario:
    'You are Tarek, a helpful man at the ticket window of a metro station in downtown Cairo. The ' +
    'learner, who is new in the city, wants to take the metro. Sell them one or two tickets, and ' +
    'answer where things are (the platform, the train, the exit, the entrance) with هُنَا, هُنَاكَ, ' +
    'on the right and on the left. Use very short sentences without verbs and only words from the ' +
    'lesson. Reply only in Arabic with full harakat, ask one short question at a time, and never ' +
    'correct the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا! تَفَضَّلْ، تَذْكِرَةٌ وَاحِدَةٌ؟',
  vocab: [
    {
      arabic: 'مِتْرُو',
      translit: 'mitrū',
      english: 'metro, underground',
      note: 'In full: مِتْرُو الْأَنْفَاقِ (mitrū l-anfāq), “the metro of the tunnels”.',
    },
    { arabic: 'مَحَطَّةٌ', translit: 'maḥaṭṭa', english: 'station' },
    { arabic: 'تَذْكِرَةٌ', translit: 'tadhkira', english: 'ticket' },
    { arabic: 'تَذْكِرَتَانِ', translit: 'tadhkiratān', english: 'two tickets' },
    { arabic: 'شُبَّاكُ التَّذَاكِرِ', translit: 'shubbāk at-tadhākir', english: 'ticket window' },
    { arabic: 'قِطَارٌ', translit: 'qiṭār', english: 'train' },
    {
      arabic: 'رَصِيفٌ',
      translit: 'raṣīf',
      english: 'platform',
      note: 'Also the pavement in the street.',
    },
    { arabic: 'خَطٌّ', translit: 'khaṭṭ', english: 'line' },
    { arabic: 'مَخْرَجٌ', translit: 'makhraj', english: 'exit' },
    { arabic: 'مَدْخَلٌ', translit: 'madkhal', english: 'entrance' },
    { arabic: 'أَيْنَ', translit: 'ayna', english: 'where' },
    { arabic: 'هُنَاكَ', translit: 'hunāka', english: 'there, over there' },
    {
      arabic: 'يَمِينٌ',
      translit: 'yamīn',
      english: 'right (side)',
      note: 'عَلَى الْيَمِينِ (ʿalā l-yamīn): on the right.',
    },
    {
      arabic: 'يَسَارٌ',
      translit: 'yasār',
      english: 'left (side)',
      note: 'عَلَى الْيَسَارِ (ʿalā l-yasār): on the left.',
    },
    {
      arabic: 'الْمَحَطَّةُ الْقَادِمَةُ',
      translit: 'al-maḥaṭṭa al-qādima',
      english: 'the next station',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word means “exit”?',
      options: ['مَدْخَلٌ', 'مَخْرَجٌ', 'رَصِيفٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'You need two tickets. What do you say?',
      options: ['تَذْكِرَةٌ وَاحِدَةٌ', 'شُبَّاكُ التَّذَاكِرِ', 'تَذْكِرَتَانِ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the question you hear.',
      audio: 'أَيْنَ الْمَحَطَّةُ؟',
      options: ['أَيْنَ الْمَحَطَّةُ؟', 'أَيْنَ الْمَخْرَجُ؟', 'أَيْنَ الْقِطَارُ؟'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'الْمَخْرَجُ عَلَى الْيَسَارِ',
      options: ['الْمَخْرَجُ عَلَى الْيَمِينِ', 'الْمَخْرَجُ عَلَى الْيَسَارِ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'مَحَطَّةٌ', english: 'station' },
        { arabic: 'تَذْكِرَةٌ', english: 'ticket' },
        { arabic: 'قِطَارٌ', english: 'train' },
        { arabic: 'رَصِيفٌ', english: 'platform' },
        { arabic: 'خَطٌّ', english: 'line' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'Where is the ticket window?',
      words: ['أَيْنَ', 'شُبَّاكُ', 'التَّذَاكِرِ'],
      distractors: ['هُنَا'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The exit is on the right.',
      words: ['الْمَخْرَجُ', 'عَلَى', 'الْيَمِينِ'],
      distractors: ['فِي'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'تَذْكِرَةٌ',
      after: '، مِنْ فَضْلِكَ.',
      english: 'One ticket, please.',
      options: ['وَاحِدٌ', 'وَاحِدَةٌ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'الْقِطَارُ',
      after: '',
      english: 'The train is here.',
      options: ['هُنَا', 'أَيْنَ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer.',
      promptArabic: 'أَيْنَ الرَّصِيفُ؟',
      options: ['تَذْكِرَتَانِ', 'هُنَاكَ، عَلَى الْيَسَارِ', 'أَنَا مِنْ مِصْرَ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'The station is far. Pick the right sentence.',
      options: ['الْمَحَطَّةُ بَعِيدٌ', 'الْمَحَطَّةُ بَعِيدَةٌ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To ask where something is, put أَيْنَ (ayna), “where”, before it. The answer needs no verb either.',
    },
    {
      type: 'example',
      arabic: 'أَيْنَ الْمَخْرَجُ؟',
      translit: 'ayna l-makhraj?',
      english: 'Where is the exit?',
    },
    {
      type: 'example',
      arabic: 'الْمَخْرَجُ هُنَاكَ، عَلَى الْيَمِينِ',
      translit: 'al-makhraj hunāka, ʿalā l-yamīn',
      english: 'The exit is over there, on the right.',
    },
    {
      type: 'table',
      head: ['Arabic', 'Meaning'],
      rows: [
        ['هُنَا', 'here'],
        ['هُنَاكَ', 'there'],
        ['عَلَى الْيَمِينِ', 'on the right'],
        ['عَلَى الْيَسَارِ', 'on the left'],
      ],
    },
    {
      type: 'p',
      text: 'One ticket is تَذْكِرَةٌ وَاحِدَةٌ: “one” comes after the noun, like an adjective, and is feminine here because تَذْكِرَةٌ is. For two, Arabic has its own ending, -ān, and needs no number word: تَذْكِرَتَانِ, “two tickets”.',
    },
    {
      type: 'example',
      arabic: 'تَذْكِرَتَانِ، مِنْ فَضْلِكَ',
      translit: 'tadhkiratān, min faḍlika',
      english: 'Two tickets, please.',
    },
  ],
  cultureTip: {
    title: 'The Cairo metro',
    body: 'Cairo’s metro was the first in Africa and is the quickest way across the city. Keep your ticket until the exit gate. Each train has cars for women only, marked on the platform; men ride in the others. Downtown, the big interchange is Sadat station, under Tahrir Square.',
  },
};
