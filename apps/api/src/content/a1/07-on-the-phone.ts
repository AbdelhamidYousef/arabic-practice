import type { ContentLesson } from '../types.ts';

// A1 L07: on the phone, running late. Made-up for this app from the Classroom plan
// (curriculum/msa/a1.md, L07: C76; the row has no grammar spot, so this lesson teaches أَنَا فِي +
// place and the feminine ة on words about the speaker); the owner reviews the Arabic before real
// learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-on-the-phone',
  unit: 'A1.1',
  kind: 'lesson',
  title: 'On the phone: I’m late',
  topic: 'Calling your guide when you are running late',
  summary: 'Say where you are, that you are late and that you are on your way.',
  goals: [
    'Answer the phone and say who you are',
    'Say where you are with فِي',
    'Say you are late or on your way, as a man or a woman',
  ],
  grammarFocus: 'Where you are: أَنَا فِي + place; a woman adds ة: مُتَأَخِّرٌ / مُتَأَخِّرَةٌ.',
  scenario:
    'You are Karim, the learner’s local guide in Cairo. You are waiting for them at the hotel door ' +
    'for today’s tour, and you call them because they are late. Start with أَلُو, ask where they ' +
    'are, whether they are coming now and whether everything is all right, and say where you are ' +
    'waiting. Be patient and kind. Use very short sentences without verbs (أَنَا فِي…, أَنَا قَادِمٌ) ' +
    'and only words from the lesson. Reply only in Arabic with full harakat, ask one short question ' +
    'at a time, and never correct the learner yourself: a separate step does that.',
  openingLine: 'أَلُو؟ مَرْحَبًا، أَنَا كَرِيمٌ. أَيْنَ أَنْتَ الْآنَ؟',
  vocab: [
    { arabic: 'أَلُو', translit: 'alū', english: 'hello? (on the phone)' },
    { arabic: 'أَيْنَ', translit: 'ayna', english: 'where' },
    { arabic: 'فِي', translit: 'fī', english: 'in, at' },
    { arabic: 'فُنْدُقٌ', translit: 'funduq', english: 'hotel' },
    {
      arabic: 'طَرِيقٌ',
      translit: 'ṭarīq',
      english: 'road, way',
      note: 'فِي الطَّرِيقِ (fī ṭ-ṭarīq): on the way.',
    },
    {
      arabic: 'تَاكْسِي',
      translit: 'tāksī',
      english: 'taxi',
      note: 'The formal word is سَيَّارَةُ أُجْرَةٍ (sayyārat ujra).',
    },
    {
      arabic: 'مُتَأَخِّرٌ',
      translit: 'mutaʾakhkhir',
      english: 'late (a man)',
      note: 'A woman says مُتَأَخِّرَةٌ (mutaʾakhkhira).',
    },
    {
      arabic: 'قَادِمٌ',
      translit: 'qādim',
      english: 'coming, on my way (a man)',
      note: 'A woman says قَادِمَةٌ (qādima).',
    },
    { arabic: 'الْآنَ', translit: 'al-ān', english: 'now' },
    { arabic: 'قَرِيبٌ', translit: 'qarīb', english: 'near, close' },
    { arabic: 'بَعِيدٌ', translit: 'baʿīd', english: 'far' },
    { arabic: 'هُنَا', translit: 'hunā', english: 'here' },
    { arabic: 'أَمَامَ', translit: 'amāma', english: 'in front of' },
    { arabic: 'لَحْظَةً', translit: 'laḥẓatan', english: 'just a moment' },
    { arabic: 'لَا مُشْكِلَةَ', translit: 'lā mushkila', english: 'no problem' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'What do you say when you answer the phone?',
      options: ['فَقَطْ', 'أَلُو', 'حَقًّا'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'A woman says she is late. Pick her sentence.',
      options: ['أَنَا مُتَأَخِّرٌ', 'أَنَا مُتَأَخِّرَةٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer.',
      promptArabic: 'أَيْنَ أَنْتَ الْآنَ؟',
      options: ['أَنَا فِي التَّاكْسِي', 'أَنَا مِنْ لَنْدَنَ', 'بِخَيْرٍ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'أَنَا فِي الطَّرِيقِ',
      options: ['أَنَا فِي الْفُنْدُقِ', 'أَنَا فِي التَّاكْسِي', 'أَنَا فِي الطَّرِيقِ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'الْفُنْدُقُ قَرِيبٌ',
      options: ['الْفُنْدُقُ قَرِيبٌ', 'الْفُنْدُقُ بَعِيدٌ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'قَرِيبٌ', english: 'near' },
        { arabic: 'بَعِيدٌ', english: 'far' },
        { arabic: 'هُنَا', english: 'here' },
        { arabic: 'طَرِيقٌ', english: 'road' },
        { arabic: 'لَحْظَةً', english: 'just a moment' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I am in front of the hotel.',
      words: ['أَنَا', 'أَمَامَ', 'الْفُنْدُقِ'],
      distractors: ['أَيْنَ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence (you are a man).',
      english: 'Sorry, I am late.',
      words: ['آسِفٌ', 'أَنَا', 'مُتَأَخِّرٌ'],
      distractors: ['مُتَأَخِّرَةٌ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَنَا',
      after: 'الْآنَ.',
      english: 'I am coming now. (a woman)',
      options: ['قَادِمٌ', 'قَادِمَةٌ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'أَنْتَ؟',
      english: 'Where are you?',
      options: ['هَلْ', 'مِنْ', 'أَيْنَ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'You say sorry for being late. What does Karim kindly answer?',
      options: ['بَعِيدٌ', 'أَنَا مُتَأَخِّرٌ', 'لَا مُشْكِلَةَ'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To say where you are, use أَنَا فِي (anā fī), “I am in”, then the place. There is still no word for “am”. After فِي the noun ends in a kasra: الْفُنْدُقُ → فِي الْفُنْدُقِ.',
    },
    {
      type: 'example',
      arabic: 'أَنَا فِي التَّاكْسِي',
      translit: 'anā fī t-tāksī',
      english: 'I am in the taxi.',
    },
    {
      type: 'example',
      arabic: 'أَنَا فِي الطَّرِيقِ',
      translit: 'anā fī ṭ-ṭarīq',
      english: 'I am on the way.',
    },
    {
      type: 'p',
      text: 'A word that describes the speaker takes ة when the speaker is a woman, just like the adjectives of lesson 6.',
    },
    {
      type: 'table',
      head: ['A man says', 'A woman says', 'Meaning'],
      rows: [
        ['أَنَا مُتَأَخِّرٌ', 'أَنَا مُتَأَخِّرَةٌ', 'I am late.'],
        ['أَنَا قَادِمٌ', 'أَنَا قَادِمَةٌ', 'I am coming.'],
        ['أَنَا قَرِيبٌ', 'أَنَا قَرِيبَةٌ', 'I am close.'],
        ['أَنَا آسِفٌ', 'أَنَا آسِفَةٌ', 'I am sorry.'],
      ],
    },
    {
      type: 'example',
      arabic: 'آسِفَةٌ، أَنَا مُتَأَخِّرَةٌ',
      translit: 'āsifa, anā mutaʾakhkhira',
      english: 'Sorry, I am late. (a woman)',
    },
  ],
  cultureTip: {
    title: 'أَلُو and the first question',
    body: 'Phone calls in Egypt start with أَلُو, borrowed from French, and the first question after hello is often “where are you?”. If you are running late, a quick call is warmer than a text message, and a few minutes late is usually met with a relaxed لَا مُشْكِلَةَ.',
  },
};
