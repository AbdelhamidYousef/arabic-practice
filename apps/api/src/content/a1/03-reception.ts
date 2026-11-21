import type { ContentLesson } from '../types.ts';

// A1 L03: help at reception. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L03: C74; the row has no grammar spot, so this lesson extends L02's لَا to "it doesn't work" and
// adds أُرِيدُ + a thing); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-reception',
  unit: 'A1.1',
  kind: 'lesson',
  title: 'Help at reception',
  topic: 'Asking the hotel for help',
  summary: 'Tell reception what is not working and ask for what you need.',
  goals: [
    'Say that the key card or the wifi does not work',
    'Ask for what you need with أُرِيدُ',
    'Answer the receptionist politely',
  ],
  grammarFocus: '“It doesn’t work”: لَا يَعْمَلُ / لَا تَعْمَلُ, and أُرِيدُ + a thing.',
  scenario:
    'You are Samira, a friendly receptionist at a hotel in Cairo. The learner is a guest who is new ' +
    'in the city and comes to the desk after breakfast with a problem: the room card, the wifi or ' +
    'the air conditioner does not work, or they need towels or water. Ask what the problem is, ' +
    'offer to fix it right away and hand things over with تَفَضَّلْ. Use very short present-tense ' +
    'sentences and only words from the lesson. Reply only in Arabic with full harakat, ask one ' +
    'short question at a time, and never correct the learner yourself: a separate step does that.',
  openingLine: 'مَسَاءُ الْخَيْرِ! أَنَا سَمِيرَةُ مِنَ الِاسْتِقْبَالِ. هَلْ مِنْ مُشْكِلَةٍ؟',
  vocab: [
    { arabic: 'الِاسْتِقْبَالُ', translit: 'al-istiqbāl', english: 'reception (the hotel desk)' },
    { arabic: 'غُرْفَةٌ', translit: 'ghurfa', english: 'room' },
    { arabic: 'مِفْتَاحٌ', translit: 'miftāḥ', english: 'key' },
    {
      arabic: 'بِطَاقَةٌ',
      translit: 'biṭāqa',
      english: 'card',
      note: 'The key card is بِطَاقَةُ الْغُرْفَةِ (biṭāqat al-ghurfa), “the card of the room”.',
    },
    { arabic: 'مِنْشَفَةٌ', translit: 'minshafa', english: 'towel' },
    { arabic: 'مَاءٌ', translit: 'māʾ', english: 'water' },
    { arabic: 'الْإِنْتَرْنِتُ', translit: 'al-intarnit', english: 'the internet, the wifi' },
    { arabic: 'كَلِمَةُ السِّرِّ', translit: 'kalimat as-sirr', english: 'password' },
    { arabic: 'مُكَيِّفٌ', translit: 'mukayyif', english: 'air conditioner' },
    {
      arabic: 'يَعْمَلُ',
      translit: 'yaʿmal',
      english: 'it works, he works',
      note: 'For a feminine thing: تَعْمَلُ (taʿmal).',
    },
    { arabic: 'أُرِيدُ', translit: 'urīd', english: 'I want, I would like' },
    { arabic: 'مُشْكِلَةٌ', translit: 'mushkila', english: 'problem' },
    { arabic: 'الْآنَ', translit: 'al-ān', english: 'now' },
    { arabic: 'حَالًا', translit: 'ḥālan', english: 'right away' },
    {
      arabic: 'تَفَضَّلْ',
      translit: 'tafaḍḍal',
      english: 'here you are, please go ahead (to a man)',
      note: 'To a woman: تَفَضَّلِي (tafaḍḍalī).',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word means “key”?',
      options: ['مِنْشَفَةٌ', 'مِفْتَاحٌ', 'غُرْفَةٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'The card is feminine. Pick the right sentence.',
      options: ['الْبِطَاقَةُ لَا تَعْمَلُ', 'الْبِطَاقَةُ لَا يَعْمَلُ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'The air conditioner is masculine. Pick the right sentence.',
      options: ['الْمُكَيِّفُ لَا تَعْمَلُ', 'الْمُكَيِّفُ لَا يَعْمَلُ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'أُرِيدُ مِنْشَفَةً',
      options: ['أُرِيدُ مَاءً', 'أُرِيدُ مِنْشَفَةً', 'أُرِيدُ مِفْتَاحًا'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'الْإِنْتَرْنِتُ لَا يَعْمَلُ',
      options: ['الْمِفْتَاحُ لَا يَعْمَلُ', 'الْمُكَيِّفُ لَا يَعْمَلُ', 'الْإِنْتَرْنِتُ لَا يَعْمَلُ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'مِنْشَفَةٌ', english: 'towel' },
        { arabic: 'كَلِمَةُ السِّرِّ', english: 'password' },
        { arabic: 'غُرْفَةٌ', english: 'room' },
        { arabic: 'مُشْكِلَةٌ', english: 'problem' },
        { arabic: 'الْآنَ', english: 'now' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The key doesn’t work.',
      words: ['الْمِفْتَاحُ', 'لَا', 'يَعْمَلُ'],
      distractors: ['تَعْمَلُ'],
    },
    {
      type: 'build',
      prompt: 'Build the request.',
      english: 'I would like water, please.',
      words: ['أُرِيدُ', 'مَاءً', 'مِنْ', 'فَضْلِكَ'],
      distractors: ['آسِفٌ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'بِطَاقَةُ الْغُرْفَةِ لَا',
      after: '',
      english: 'The room card doesn’t work.',
      options: ['يَعْمَلُ', 'تَعْمَلُ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'كَلِمَةَ السِّرِّ، مِنْ فَضْلِكَ.',
      english: 'I would like the password, please.',
      options: ['أُرِيدُ', 'أَفْهَمُ', 'أَعْرِفُ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'The receptionist speaks too fast. What do you say?',
      options: ['بِبُطْءٍ، مِنْ فَضْلِكَ', 'لَا بَأْسَ', 'الْآنَ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'The receptionist hands you the towels. What does he say?',
      options: ['آسِفٌ', 'مُشْكِلَةٌ', 'تَفَضَّلْ'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'In the last lesson you put لَا before a verb: لَا أَفْهَمُ. It works the same with “it”: يَعْمَلُ means “he works” or “it works”, so لَا يَعْمَلُ is “it doesn’t work”.',
    },
    {
      type: 'example',
      arabic: 'الْمِفْتَاحُ لَا يَعْمَلُ',
      translit: 'al-miftāḥ lā yaʿmal',
      english: 'The key doesn’t work.',
    },
    {
      type: 'p',
      text: 'Every Arabic noun is masculine or feminine, things too. Most words that end in ة are feminine, and for a feminine thing the verb starts with تَـ instead of يَـ.',
    },
    {
      type: 'table',
      head: ['Thing', 'Gender', 'It doesn’t work'],
      rows: [
        ['الْمِفْتَاحُ', 'masculine', 'الْمِفْتَاحُ لَا يَعْمَلُ'],
        ['الْمُكَيِّفُ', 'masculine', 'الْمُكَيِّفُ لَا يَعْمَلُ'],
        ['الْبِطَاقَةُ', 'feminine', 'الْبِطَاقَةُ لَا تَعْمَلُ'],
      ],
    },
    {
      type: 'p',
      text: 'To ask for something, say أُرِيدُ (urīd), “I want”, then the thing, and add مِنْ فَضْلِكَ. After أُرِيدُ the ending -un (ـٌ) becomes -an (ـً): مَاءٌ → مَاءً, مِنْشَفَةٌ → مِنْشَفَةً.',
    },
    {
      type: 'example',
      arabic: 'أُرِيدُ مِنْشَفَةً، مِنْ فَضْلِكَ',
      translit: 'urīd minshafatan, min faḍlika',
      english: 'I would like a towel, please.',
    },
  ],
  cultureTip: {
    title: 'The front desk is there to help',
    body: 'In a hotel you can call the front desk from the room phone for almost anything: towels, water, the wifi password. Short sentences are fine: say the thing, add مِنْ فَضْلِكَ and thank them with شُكْرًا. A small tip for the person who brings it to your room is common.',
  },
};
