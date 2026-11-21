import type { ContentLesson } from '../types.ts';

// A1 L19: when are you free? Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L19: C12, G16 continued); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-appointments',
  unit: 'A1.2',
  kind: 'lesson',
  title: 'When are you free?',
  topic: 'Making a plan to meet',
  summary: 'Name the days of the week, say when you are busy or free, and agree a day to meet.',
  goals: [
    'Name the seven days of the week',
    'Ask “Do you have time on Thursday?” and say you are busy',
    'Agree on a day and a time of day to meet',
  ],
  grammarFocus: 'More present tense, and “on Sunday”: أَعْمَلُ يَوْمَ الْأَحَدِ.',
  scenario:
    'You are Mariam, a classmate from the learner’s Arabic class in Cairo. You want to meet for ' +
    'coffee this week. Ask when they are free, say which days you are busy (you work on Sunday ' +
    'and Monday), suggest a day and a time of day, and agree on one. ' +
    'Use very short present-tense sentences, the days of the week and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'مَرْحَبًا! هَلْ عِنْدَكَ وَقْتٌ هٰذَا الْأُسْبُوعَ؟',
  vocab: [
    {
      arabic: 'الْأَحَدُ',
      translit: 'al-aḥad',
      english: 'Sunday',
      note: '“On Sunday” is يَوْمَ الْأَحَدِ.',
    },
    { arabic: 'الِاثْنَيْنِ', translit: 'al-ithnayn', english: 'Monday' },
    { arabic: 'الثُّلَاثَاءُ', translit: 'ath-thulāthāʾ', english: 'Tuesday' },
    { arabic: 'الْأَرْبِعَاءُ', translit: 'al-arbiʿāʾ', english: 'Wednesday' },
    { arabic: 'الْخَمِيسُ', translit: 'al-khamīs', english: 'Thursday' },
    { arabic: 'الْجُمُعَةُ', translit: 'al-jumuʿa', english: 'Friday' },
    { arabic: 'السَّبْتُ', translit: 'as-sabt', english: 'Saturday' },
    { arabic: 'أُسْبُوعٌ', translit: 'usbūʿ', english: 'week' },
    { arabic: 'الْيَوْمَ', translit: 'al-yawm', english: 'today' },
    { arabic: 'غَدًا', translit: 'ghadan', english: 'tomorrow' },
    { arabic: 'وَقْتٌ', translit: 'waqt', english: 'time' },
    { arabic: 'مَوْعِدٌ', translit: 'mawʿid', english: 'appointment, date to meet' },
    {
      arabic: 'مَشْغُولٌ',
      translit: 'mashghūl',
      english: 'busy',
      note: 'For a woman: مَشْغُولَةٌ.',
    },
    { arabic: 'مُمْكِنٌ', translit: 'mumkin', english: 'possible; OK' },
    { arabic: 'نَلْتَقِي', translit: 'naltaqī', english: 'we meet' },
    { arabic: 'يَزُورُ', translit: 'yazūr', english: 'to visit' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which day comes after Thursday?',
      options: ['الْأَرْبِعَاءُ', 'السَّبْتُ', 'الْجُمُعَةُ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'How do you say “tomorrow”?',
      options: ['غَدًا', 'الْيَوْمَ', 'مَسَاءً'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the day you hear.',
      audio: 'الثُّلَاثَاءُ',
      options: ['الْخَمِيسُ', 'الثُّلَاثَاءُ', 'الْأَحَدُ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'أَنَا مَشْغُولٌ غَدًا',
      options: ['أَنَا مَشْغُولٌ الْيَوْمَ', 'عِنْدِي وَقْتٌ غَدًا', 'أَنَا مَشْغُولٌ غَدًا'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each day with its meaning.',
      pairs: [
        { arabic: 'الْأَحَدُ', english: 'Sunday' },
        { arabic: 'الِاثْنَيْنِ', english: 'Monday' },
        { arabic: 'الْأَرْبِعَاءُ', english: 'Wednesday' },
        { arabic: 'السَّبْتُ', english: 'Saturday' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'مَوْعِدٌ', english: 'appointment' },
        { arabic: 'وَقْتٌ', english: 'time' },
        { arabic: 'مَشْغُولٌ', english: 'busy' },
        { arabic: 'أُسْبُوعٌ', english: 'week' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'Do you have time on Thursday?',
      words: ['هَلْ', 'عِنْدَكَ', 'وَقْتٌ', 'يَوْمَ', 'الْخَمِيسِ'],
      distractors: ['مَتَى'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I work on Sunday.',
      words: ['أَعْمَلُ', 'يَوْمَ', 'الْأَحَدِ'],
      distractors: ['تَعْمَلُ'],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'When do you go to the office? (to a man)',
      words: ['مَتَى', 'تَذْهَبُ', 'إِلَى', 'الْمَكْتَبِ'],
      distractors: ['أَذْهَبُ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَنَا',
      after: 'يَوْمَ الْجُمُعَةِ.',
      english: 'I am busy on Friday.',
      options: ['مَوْعِدٌ', 'مَشْغُولٌ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap (talking to a woman).',
      before: 'هَلْ',
      after: 'سَلْمَى يَوْمَ السَّبْتِ؟',
      english: 'Are you visiting Salma on Saturday? (to a woman)',
      options: ['تَزُورِينَ', 'أَزُورُ', 'يَزُورُ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'مَتَى نَلْتَقِي؟',
      options: ['أَنَا مُهَنْدِسٌ', 'فِي الْمَكْتَبِ', 'يَوْمَ الْأَرْبِعَاءِ مَسَاءً'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To say “on” a day, put يَوْمَ (“on the day of”) before it. The day then ends in -i: الْأَحَدُ becomes يَوْمَ الْأَحَدِ.',
    },
    {
      type: 'example',
      arabic: 'أَعْمَلُ يَوْمَ الْأَحَدِ.',
      translit: 'aʿmalu yawma l-aḥad',
      english: 'I work on Sunday.',
    },
    {
      type: 'p',
      text: 'More present tense. Verbs with a long vowel in the middle, like يَزُورُ, keep it in every form. Questions start with هَلْ (yes or no) or مَتَى (when).',
    },
    {
      type: 'table',
      head: ['Who', 'to go', 'to visit'],
      rows: [
        ['I', 'أَذْهَبُ', 'أَزُورُ'],
        ['you (m)', 'تَذْهَبُ', 'تَزُورُ'],
        ['you (f)', 'تَذْهَبِينَ', 'تَزُورِينَ'],
        ['he', 'يَذْهَبُ', 'يَزُورُ'],
        ['she', 'تَذْهَبُ', 'تَزُورُ'],
      ],
    },
    {
      type: 'example',
      arabic: 'هَلْ أَنْتِ مَشْغُولَةٌ يَوْمَ الْخَمِيسِ؟',
      translit: 'hal anti mashghūla yawma l-khamīs',
      english: 'Are you (to a woman) busy on Thursday?',
    },
    {
      type: 'example',
      arabic: 'مَتَى تَزُورُ أُمَّكَ؟',
      translit: 'matā tazūru ummak',
      english: 'When do you visit your mother?',
    },
  ],
  cultureTip: {
    title: 'Plans stay loose',
    body: 'In Cairo a plan for “Thursday evening” is often confirmed again on the day itself. A short message in the morning (“are we still meeting?”) is normal and polite, and nobody minds if you ask.',
  },
};
