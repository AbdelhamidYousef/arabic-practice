import type { ContentLesson } from '../types.ts';

// A1 L02: saying sorry and "I don't understand". Made-up for this app from the Classroom plan
// (curriculum/msa/a1.md, L02: C02, G03, K02); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-sorry',
  unit: 'A1.1',
  kind: 'lesson',
  title: 'Sorry, I don’t understand',
  topic: 'When breakfast goes wrong at the hotel',
  summary: 'Say sorry, say you don’t understand and ask someone to speak slowly.',
  goals: [
    'Say sorry and answer an apology',
    'Say “I don’t understand” and “I don’t know”',
    'Ask someone to say it again or to speak slowly',
  ],
  grammarFocus: '“Not” before a present verb: لَا أَفْهَمُ, I don’t understand.',
  scenario:
    'You are Hassan, a friendly waiter at the breakfast buffet of a hotel in Cairo. The learner is a ' +
    'guest who is new in the city. You have brought coffee, but they wanted tea. Apologise, offer to ' +
    'fix it, and speak a little fast at first so the learner has to ask you to repeat or to speak ' +
    'slowly; then slow down. Use very short present-tense sentences and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'صَبَاحُ الْخَيْرِ! تَفَضَّلْ، الْقَهْوَةُ.',
  vocab: [
    {
      arabic: 'آسِفٌ',
      translit: 'āsif',
      english: 'sorry (said by a man)',
      note: 'A woman says آسِفَةٌ (āsifa).',
    },
    {
      arabic: 'عَفْوًا',
      translit: 'ʿafwan',
      english: 'excuse me, pardon?',
      note: 'It also answers شُكْرًا: “you are welcome”.',
    },
    { arabic: 'لَا بَأْسَ', translit: 'lā baʾs', english: 'no problem, it’s all right' },
    { arabic: 'مِنْ فَضْلِكَ', translit: 'min faḍlika', english: 'please (to a man)' },
    { arabic: 'نَعَمْ', translit: 'naʿam', english: 'yes' },
    { arabic: 'لَا', translit: 'lā', english: 'no, not' },
    { arabic: 'لَا أَفْهَمُ', translit: 'lā afham', english: 'I don’t understand' },
    { arabic: 'لَا أَعْرِفُ', translit: 'lā aʿrif', english: 'I don’t know' },
    { arabic: 'أَتَكَلَّمُ', translit: 'atakallam', english: 'I speak' },
    { arabic: 'الْعَرَبِيَّةُ', translit: 'al-ʿarabiyya', english: 'Arabic (the language)' },
    { arabic: 'قَلِيلًا', translit: 'qalīlan', english: 'a little' },
    { arabic: 'بِبُطْءٍ', translit: 'bi-buṭʾ', english: 'slowly' },
    { arabic: 'مَرَّةً أُخْرَى', translit: 'marratan ukhrā', english: 'again, once more' },
    { arabic: 'شَايٌ', translit: 'shāy', english: 'tea' },
    { arabic: 'قَهْوَةٌ', translit: 'qahwa', english: 'coffee' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'You bump into someone (you are a man). What do you say?',
      options: ['شُكْرًا', 'آسِفٌ', 'مَرْحَبًا'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Someone says sorry to you. Pick a kind answer.',
      promptArabic: 'آسِفٌ!',
      options: ['لَا بَأْسَ', 'لَا أَعْرِفُ', 'قَلِيلًا'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'A woman says sorry. Which word does she use?',
      options: ['آسِفٌ', 'آسِفَةٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'لَا أَفْهَمُ',
      options: ['لَا أَعْرِفُ', 'أَتَكَلَّمُ', 'لَا أَفْهَمُ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'بِبُطْءٍ، مِنْ فَضْلِكَ',
      options: ['مَرَّةً أُخْرَى، مِنْ فَضْلِكَ', 'بِبُطْءٍ، مِنْ فَضْلِكَ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each phrase with its meaning.',
      pairs: [
        { arabic: 'آسِفٌ', english: 'sorry' },
        { arabic: 'لَا بَأْسَ', english: 'no problem' },
        { arabic: 'بِبُطْءٍ', english: 'slowly' },
        { arabic: 'مَرَّةً أُخْرَى', english: 'again' },
        { arabic: 'قَلِيلًا', english: 'a little' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I don’t understand.',
      words: ['لَا', 'أَفْهَمُ'],
      distractors: ['نَعَمْ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I speak a little Arabic.',
      words: ['أَتَكَلَّمُ', 'الْعَرَبِيَّةَ', 'قَلِيلًا'],
      distractors: ['لَا'],
    },
    {
      type: 'build',
      prompt: 'Build the request.',
      english: 'Slowly, please.',
      words: ['بِبُطْءٍ', 'مِنْ', 'فَضْلِكَ'],
      distractors: ['آسِفٌ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'أَعْرِفُ.',
      english: 'I don’t know.',
      options: ['نَعَمْ', 'لَا'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'آسِفٌ، لَا',
      after: '',
      english: 'Sorry, I don’t understand.',
      options: ['قَهْوَةٌ', 'أَفْهَمُ', 'شَايٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Someone thanks you. Pick the reply.',
      promptArabic: 'شُكْرًا!',
      options: ['عَفْوًا', 'آسِفٌ', 'مَرْحَبًا'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To say “not” about something you do now, put لَا (lā) before the verb. Learn the first ones as phrases: the whole present tense comes later in the course.',
    },
    {
      type: 'table',
      head: ['Yes', 'Not', 'Meaning'],
      rows: [
        ['أَفْهَمُ', 'لَا أَفْهَمُ', 'I (don’t) understand'],
        ['أَعْرِفُ', 'لَا أَعْرِفُ', 'I (don’t) know'],
        ['أَتَكَلَّمُ', 'لَا أَتَكَلَّمُ', 'I (don’t) speak'],
      ],
    },
    {
      type: 'p',
      text: 'The أَ at the start of each verb means “I”. On its own, لَا also means “no”.',
    },
    { type: 'example', arabic: 'لَا، شُكْرًا', translit: 'lā, shukran', english: 'No, thank you.' },
    {
      type: 'example',
      arabic: 'آسِفٌ، لَا أَتَكَلَّمُ الْعَرَبِيَّةَ',
      translit: 'āsif, lā atakallam al-ʿarabiyya',
      english: 'Sorry, I don’t speak Arabic.',
    },
  ],
  cultureTip: {
    title: 'Arabic in numbers',
    body: 'Online, many Arabs type Arabic in Latin letters and use digits for sounds English has no letter for: 3 for ع, 7 for ح, 2 for the hamza. So 3arabi is عَرَبِيٌّ (Arabic) and mar7aban is مَرْحَبًا. You will see it in chats; in this course you read and write the real letters.',
  },
};
