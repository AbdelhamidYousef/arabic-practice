import type { ContentLesson } from '../types.ts';

// A2 L46: a short message about your day. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L46: C37, G41 and G74; no culture item, so a short practical tip). The
// owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-message-home',
  unit: 'A2.2',
  kind: 'lesson',
  title: 'A message about your day',
  topic: 'Writing home about your day',
  summary: 'Write a short message about what you did today, and tell a friend what not to do.',
  goals: [
    'Write three or four sentences about your day',
    'Use verbs with a hamza: أَكَلَ، سَأَلَ، قَرَأَ',
    'Say “don’t…” with لَا and the jussive: لَا تَتَأَخَّرْ',
  ],
  grammarFocus: 'Verbs with a hamza (أَكَلْتُ، سَأَلْتُ، قَرَأْتُ) and “don’t…”: لَا + the jussive (لَا تَتَأَخَّرْ!).',
  scenario:
    'You are Nadia, the learner’s friend back home, chatting with them by message in the evening. ' +
    'Ask what they did today in Cairo: what they ate, what they read, whom they asked for help, ' +
    'whether they were late. Share your own day in two short sentences, and once give friendly ' +
    'advice with لَا + the jussive (لَا تَتَأَخَّرْ، لَا تَنَمْ مُتَأَخِّرًا). Use the hamzated verbs ' +
    'أَكَلَ، سَأَلَ، قَرَأَ، أَخَذَ in the past. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'مَسَاءُ الْخَيْرِ! اشْتَقْتُ إِلَيْكَ. مَاذَا فَعَلْتَ الْيَوْمَ؟',
  vocab: [
    { arabic: 'رِسَالَةٌ', translit: 'risāla', english: 'message, letter' },
    {
      arabic: 'أَكَلَ',
      translit: 'akala',
      english: 'he ate',
      note: 'Present: يَأْكُلُ (yaʾkulu). I eat: آكُلُ.',
    },
    {
      arabic: 'سَأَلَ',
      translit: 'saʾala',
      english: 'he asked',
      note: 'Present: يَسْأَلُ (yasʾalu).',
    },
    {
      arabic: 'قَرَأَ',
      translit: 'qaraʾa',
      english: 'he read',
      note: 'Present: يَقْرَأُ (yaqraʾu).',
    },
    {
      arabic: 'أَخَذَ',
      translit: 'akhadha',
      english: 'he took',
      note: 'Present: يَأْخُذُ (yaʾkhudhu). I take: آخُذُ.',
    },
    {
      arabic: 'بَدَأَ',
      translit: 'badaʾa',
      english: 'he began',
      note: 'Present: يَبْدَأُ (yabdaʾu).',
    },
    {
      arabic: 'تَأَخَّرَ',
      translit: 'taʾakhkhara',
      english: 'he was late',
      note: 'Present: يَتَأَخَّرُ (yataʾakhkharu).',
    },
    { arabic: 'الْيَوْمَ', translit: 'al-yawm', english: 'today' },
    { arabic: 'صَبَاحًا', translit: 'ṣabāḥan', english: 'in the morning' },
    { arabic: 'ظُهْرًا', translit: 'ẓuhran', english: 'at noon' },
    { arabic: 'مَسَاءً', translit: 'masāʾan', english: 'in the evening' },
    { arabic: 'ثُمَّ', translit: 'thumma', english: 'then' },
    { arabic: 'بَعْدَ ذَلِكَ', translit: 'baʿda dhālika', english: 'after that' },
    { arabic: 'غَدَاءٌ', translit: 'ghadāʾ', english: 'lunch' },
    { arabic: 'مُتْعَبٌ', translit: 'mutʿab', english: 'tired' },
    { arabic: 'أَخْبَارٌ', translit: 'akhbār', english: 'news' },
    {
      arabic: 'اشْتَقْتُ إِلَيْكَ',
      translit: 'ishtaqtu ilayk',
      english: 'I miss you (to a man)',
      note: 'To a woman: اشْتَقْتُ إِلَيْكِ.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “I asked”?',
      options: ['سَأَلْتُ', 'سَأَلَ', 'يَسْأَلُ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Which sentence means “Don’t be late!”?',
      options: ['تَأَخَّرْتُ!', 'لَا تَتَأَخَّرْ!', 'لَمْ أَتَأَخَّرْ.'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'مَاذَا أَكَلْتَ عَلَى الْغَدَاءِ؟',
      options: ['قَرَأْتُ كِتَابًا.', 'سَأَلْتُ صَدِيقِي.', 'أَكَلْتُ سَمَكًا وَأَرُزًّا.'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'قَرَأْتُ رِسَالَتَكَ صَبَاحًا',
      options: ['قَرَأَ رِسَالَتَكَ مَسَاءً', 'أَخَذْتُ رِسَالَتَكَ صَبَاحًا', 'قَرَأْتُ رِسَالَتَكَ صَبَاحًا'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'لَا تَأْكُلْ كَثِيرًا',
      options: ['لَمْ آكُلْ كَثِيرًا', 'لَا تَأْكُلْ كَثِيرًا', 'أَكَلْتُ كَثِيرًا'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each time word with its meaning.',
      pairs: [
        { arabic: 'صَبَاحًا', english: 'in the morning' },
        { arabic: 'ظُهْرًا', english: 'at noon' },
        { arabic: 'مَسَاءً', english: 'in the evening' },
        { arabic: 'بَعْدَ ذَلِكَ', english: 'after that' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each verb with its meaning.',
      pairs: [
        { arabic: 'أَخَذَ', english: 'he took' },
        { arabic: 'بَدَأَ', english: 'he began' },
        { arabic: 'قَرَأَ', english: 'he read' },
        { arabic: 'سَأَلَ', english: 'he asked' },
        { arabic: 'أَكَلَ', english: 'he ate' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I took the metro in the morning.',
      words: ['أَخَذْتُ', 'الْمِتْرُو', 'صَبَاحًا'],
      distractors: ['أَخَذَ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Don’t sleep late!',
      words: ['لَا', 'تَنَمْ', 'مُتَأَخِّرًا'],
      distractors: ['تَنَامُ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'بَعْدَ الدَّرْسِ',
      after: 'الْمُعَلِّمَةَ سُؤَالًا.',
      english: 'After the lesson I asked the teacher a question.',
      options: ['قَرَأْتُ', 'سَأَلْتُ', 'أَكَلْتُ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَنَا',
      after: 'جِدًّا الْيَوْمَ.',
      english: 'I am very tired today.',
      options: ['رِسَالَةٌ', 'غَدَاءٌ', 'مُتْعَبٌ'],
      answer: 2,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'يَا أُمِّي،',
      after: 'إِلَيْكِ كَثِيرًا!',
      english: 'Mum, I miss you a lot!',
      options: ['اشْتَقْتُ', 'تَأَخَّرْتُ', 'بَدَأْتُ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Some verbs have a hamza (ء) among their three root letters: أَكَلَ at the start, سَأَلَ in the middle, قَرَأَ at the end. In the past they take the usual endings.',
    },
    {
      type: 'table',
      head: ['Person', 'أَكَلَ (to eat)', 'سَأَلَ (to ask)', 'قَرَأَ (to read)'],
      rows: [
        ['I', 'أَكَلْتُ', 'سَأَلْتُ', 'قَرَأْتُ'],
        ['you (m)', 'أَكَلْتَ', 'سَأَلْتَ', 'قَرَأْتَ'],
        ['she', 'أَكَلَتْ', 'سَأَلَتْ', 'قَرَأَتْ'],
        ['we', 'أَكَلْنَا', 'سَأَلْنَا', 'قَرَأْنَا'],
      ],
    },
    {
      type: 'p',
      text: 'In the present, “I” plus a verb that starts with a hamza writes the two hamzas as one آ: آكُلُ (I eat), آخُذُ (I take).',
    },
    {
      type: 'example',
      arabic: 'آكُلُ الْفُولَ صَبَاحًا.',
      translit: 'ākulu l-fūla ṣabāḥan.',
      english: 'I eat fava beans in the morning.',
    },
    {
      type: 'p',
      text: 'To say “don’t…”, put لَا before the you-form of the present and drop its last vowel (the jussive, as after لَمْ): تَتَأَخَّرُ → لَا تَتَأَخَّرْ. To a woman, ـِينَ becomes ـِي: لَا تَتَأَخَّرِي.',
    },
    {
      type: 'example',
      arabic: 'لَا تَتَأَخَّرْ عَنِ الدَّرْسِ!',
      translit: 'lā tataʾakhkhar ʿani d-dars!',
      english: 'Don’t be late for the lesson!',
    },
  ],
  cultureTip: {
    title: 'A message home',
    body: 'An Arabic message rarely starts with the news. Open with a greeting such as السَّلَامُ عَلَيْكُمْ or مَسَاءُ الْخَيْرِ, ask how everyone is, and only then tell your day. A warm way to end is فِي أَمَانِ اللَّهِ, “in God’s safekeeping”. In everyday messages people write without vowel marks, so the words you know well are the ones you will recognise first.',
  },
};
