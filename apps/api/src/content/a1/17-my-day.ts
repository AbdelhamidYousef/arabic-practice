import type { ContentLesson } from '../types.ts';

// A1 L17: your day. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L17: C11, G16, K08); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-my-day',
  unit: 'A1.2',
  kind: 'lesson',
  title: 'Your day',
  topic: 'What you do on a normal day, and when',
  summary:
    'Say what you do in the morning, at noon and in the evening, and ask about someone’s day.',
  goals: [
    'Say what you do every day: wake up, work, eat, sleep',
    'Say when: in the morning, at noon, in the evening, at night',
    'Ask someone what they do, to a man and to a woman',
  ],
  grammarFocus: 'The present tense, singular: أَعْمَلُ، تَعْمَلُ، تَعْمَلِينَ، يَعْمَلُ.',
  scenario:
    'You are Yusuf, the learner’s friendly neighbour in Cairo. Chat about a normal day: ask what ' +
    'they do in the morning, at noon, in the evening and at night, and tell them about your own ' +
    'day (you work in an office and do not work on Friday). ' +
    'Use very short present-tense sentences with I, you, he and she, and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'صَبَاحُ الْخَيْرِ! أَنَا يُوسُفُ، جَارُكَ. مَاذَا تَفْعَلُ صَبَاحًا؟',
  vocab: [
    {
      arabic: 'يَسْتَيْقِظُ',
      translit: 'yastayqiẓ',
      english: 'to wake up (he wakes up)',
      note: 'Verbs are given in the “he” form. “I wake up” is أَسْتَيْقِظُ.',
    },
    { arabic: 'يَشْرَبُ', translit: 'yashrab', english: 'to drink' },
    { arabic: 'يَأْكُلُ', translit: 'yaʾkul', english: 'to eat' },
    { arabic: 'يَذْهَبُ', translit: 'yadhhab', english: 'to go' },
    { arabic: 'يَعْمَلُ', translit: 'yaʿmal', english: 'to work' },
    { arabic: 'يَدْرُسُ', translit: 'yadrus', english: 'to study' },
    { arabic: 'يَرْجِعُ', translit: 'yarjiʿ', english: 'to come back' },
    { arabic: 'يَطْبُخُ', translit: 'yaṭbukh', english: 'to cook' },
    { arabic: 'يَقْرَأُ', translit: 'yaqraʾ', english: 'to read' },
    { arabic: 'يَنَامُ', translit: 'yanām', english: 'to sleep' },
    { arabic: 'يَفْعَلُ', translit: 'yafʿal', english: 'to do' },
    { arabic: 'صَبَاحًا', translit: 'ṣabāḥan', english: 'in the morning' },
    { arabic: 'ظُهْرًا', translit: 'ẓuhran', english: 'at noon' },
    { arabic: 'مَسَاءً', translit: 'masāʾan', english: 'in the evening' },
    { arabic: 'لَيْلًا', translit: 'laylan', english: 'at night' },
    { arabic: 'كُلَّ يَوْمٍ', translit: 'kulla yawm', english: 'every day' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “I drink”?',
      options: ['يَشْرَبُ', 'أَشْرَبُ', 'تَشْرَبِينَ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick the form for “she works”.',
      options: ['يَعْمَلُ', 'أَعْمَلُ', 'تَعْمَلُ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the verb you hear.',
      audio: 'يَسْتَيْقِظُ',
      options: ['يَسْتَيْقِظُ', 'يَنَامُ', 'يَرْجِعُ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'أَرْجِعُ إِلَى الْبَيْتِ مَسَاءً',
      options: ['أَذْهَبُ إِلَى الْعَمَلِ صَبَاحًا', 'أَرْجِعُ إِلَى الْبَيْتِ مَسَاءً', 'أَشْرَبُ الْقَهْوَةَ صَبَاحًا'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each verb with its meaning.',
      pairs: [
        { arabic: 'يَأْكُلُ', english: 'to eat' },
        { arabic: 'يَنَامُ', english: 'to sleep' },
        { arabic: 'يَقْرَأُ', english: 'to read' },
        { arabic: 'يَطْبُخُ', english: 'to cook' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each time of day with its meaning.',
      pairs: [
        { arabic: 'صَبَاحًا', english: 'in the morning' },
        { arabic: 'ظُهْرًا', english: 'at noon' },
        { arabic: 'مَسَاءً', english: 'in the evening' },
        { arabic: 'لَيْلًا', english: 'at night' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I drink coffee in the morning.',
      words: ['أَشْرَبُ', 'الْقَهْوَةَ', 'صَبَاحًا'],
      distractors: ['يَشْرَبُ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'She studies at night.',
      words: ['هِيَ', 'تَدْرُسُ', 'لَيْلًا'],
      distractors: ['يَدْرُسُ'],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'What do you do in the evening? (to a man)',
      words: ['مَاذَا', 'تَفْعَلُ', 'مَسَاءً'],
      distractors: ['أَفْعَلُ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَنْتِ',
      after: 'فِي الْبَيْتِ كُلَّ يَوْمٍ.',
      english: 'You (to a woman) cook at home every day.',
      options: ['تَطْبُخِينَ', 'تَطْبُخُ', 'أَطْبُخُ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هُوَ',
      after: 'إِلَى الْبَيْتِ ظُهْرًا.',
      english: 'He comes back home at noon.',
      options: ['أَرْجِعُ', 'يَرْجِعُ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick the sentence that means “I don’t work on Friday.”',
      options: ['أَعْمَلُ يَوْمَ الْجُمُعَةِ', 'لَا يَعْمَلُ يَوْمَ الْجُمُعَةِ', 'لَا أَعْمَلُ يَوْمَ الْجُمُعَةِ'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'A present-tense verb shows who is doing it with a letter at the front: أَـ for “I”, تَـ for “you” and “she”, يَـ for “he”. Talking to a woman, you also add ـِينَ at the end.',
    },
    {
      type: 'table',
      head: ['Who', 'Arabic', 'Say', 'Meaning'],
      rows: [
        ['I', 'أَنَا أَعْمَلُ', 'anā aʿmal', 'I work'],
        ['you (m)', 'أَنْتَ تَعْمَلُ', 'anta taʿmal', 'you work'],
        ['you (f)', 'أَنْتِ تَعْمَلِينَ', 'anti taʿmalīn', 'you work'],
        ['he', 'هُوَ يَعْمَلُ', 'huwa yaʿmal', 'he works'],
        ['she', 'هِيَ تَعْمَلُ', 'hiya taʿmal', 'she works'],
      ],
    },
    {
      type: 'p',
      text: 'The verb already says who, so أَنَا, أَنْتَ and the others are often left out. تَعْمَلُ is both “you (m) work” and “she works”: the rest of the sentence tells them apart.',
    },
    {
      type: 'example',
      arabic: 'أَشْرَبُ الْقَهْوَةَ صَبَاحًا.',
      translit: 'ashrabu l-qahwa ṣabāḥan',
      english: 'I drink coffee in the morning.',
    },
    {
      type: 'example',
      arabic: 'لَا أَعْمَلُ يَوْمَ الْجُمُعَةِ.',
      translit: 'lā aʿmalu yawma l-jumuʿa',
      english: 'I don’t work on Friday.',
    },
  ],
  cultureTip: {
    title: 'The Arab week: Friday off',
    body: 'In Egypt the weekend is Friday, and for many offices and schools Saturday too. Friday is the day of the big noon prayer, so streets are quiet in the morning and busy in the evening. The working week starts on Sunday, الْأَحَدُ, “the first day”.',
  },
};
