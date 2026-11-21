import type { ContentLesson } from '../types.ts';

// A2 L51: make, move and cancel arrangements. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L51: C42, G46; no culture item, so a short practical tip). The owner
// reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-arrangements',
  unit: 'A2.3',
  kind: 'lesson',
  title: 'Changing a plan',
  topic: '“Can we meet later?”',
  summary: 'Make, move and cancel an arrangement, and say which meeting or place you mean.',
  goals: [
    'Move or cancel a meeting politely',
    'Suggest another day and agree on it',
    'Say which one you mean with الَّذِي، الَّتِي، الَّذِينَ',
  ],
  grammarFocus:
    '“Who / which”: الَّذِي (masculine), الَّتِي (feminine and things in the plural), الَّذِينَ (people in the plural).',
  scenario:
    'You are Sherif, the learner’s language-exchange partner in Cairo. You had planned to meet at a ' +
    'café on Tuesday, but you now have a meeting at work. Call to move or cancel your plan, suggest ' +
    'another day and time, and agree on a new plan. Use الَّذِي، الَّتِي and الَّذِينَ in simple ' +
    'sentences (الْمَقْهَى الَّذِي…، الصَّدِيقَةُ الَّتِي…). ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'آسِفٌ جِدًّا، عِنْدِي اجْتِمَاعٌ يَوْمَ الثُّلَاثَاءِ. هَلْ يُمْكِنُ أَنْ نَلْتَقِيَ لَاحِقًا؟',
  vocab: [
    { arabic: 'مَوْعِدٌ', translit: 'mawʿid', english: 'appointment, meeting time' },
    { arabic: 'اجْتِمَاعٌ', translit: 'ijtimāʿ', english: 'meeting (at work)' },
    {
      arabic: 'أَجَّلَ',
      translit: 'ajjala',
      english: 'he postponed',
      note: 'Present: يُؤَجِّلُ (yuʾajjilu).',
    },
    {
      arabic: 'أَلْغَى',
      translit: 'alghā',
      english: 'he cancelled',
      note: 'Present: يُلْغِي (yulghī). I cancelled: أَلْغَيْتُ.',
    },
    {
      arabic: 'غَيَّرَ',
      translit: 'ghayyara',
      english: 'he changed',
      note: 'Present: يُغَيِّرُ (yughayyiru).',
    },
    {
      arabic: 'اتَّفَقَ',
      translit: 'ittafaqa',
      english: 'he agreed',
      note: 'Present: يَتَّفِقُ (yattafiqu). We agreed: اتَّفَقْنَا.',
    },
    { arabic: 'مُنَاسِبٌ', translit: 'munāsib', english: 'suitable, convenient' },
    { arabic: 'مَشْغُولٌ', translit: 'mashghūl', english: 'busy' },
    {
      arabic: 'آسِفٌ',
      translit: 'āsif',
      english: 'sorry (said by a man)',
      note: 'A woman says آسِفَةٌ.',
    },
    { arabic: 'لِلْأَسَفِ', translit: 'lil-asaf', english: 'unfortunately' },
    { arabic: 'لَاحِقًا', translit: 'lāḥiqan', english: 'later' },
    { arabic: 'مُمْكِنٌ', translit: 'mumkin', english: 'possible' },
    { arabic: 'بَدَلًا مِنْ', translit: 'badalan min', english: 'instead of' },
    { arabic: 'الَّذِي', translit: 'alladhī', english: 'who, which (masculine)' },
    { arabic: 'الَّتِي', translit: 'allatī', english: 'who, which (feminine)' },
    { arabic: 'الَّذِينَ', translit: 'alladhīna', english: 'who (people, plural)' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “Can we meet later?”',
      options: ['لَنْ نَلْتَقِيَ لَاحِقًا.', 'هَلْ يُمْكِنُ أَنْ نَلْتَقِيَ لَاحِقًا؟', 'هَلِ الْتَقَيْنَا لَاحِقًا؟'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word means “unfortunately”?',
      options: ['لَاحِقًا', 'مُمْكِنٌ', 'لِلْأَسَفِ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'هَلْ يُنَاسِبُكَ يَوْمُ الْخَمِيسِ؟',
      options: ['نَعَمْ، الْخَمِيسُ مُنَاسِبٌ.', 'أَلْغَيْتُ الْخَمِيسَ أَمْسِ.', 'الْمَقْهَى الَّذِي فِي الزَّمَالِكِ.'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'أُرِيدُ أَنْ أُؤَجِّلَ الْمَوْعِدَ',
      options: ['أُرِيدُ أَنْ أُلْغِيَ الْمَوْعِدَ', 'أُرِيدُ أَنْ أُؤَجِّلَ الْمَوْعِدَ', 'أُرِيدُ أَنْ أُغَيِّرَ الْمَوْعِدَ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'الصَّدِيقَةُ الَّتِي تَعْمَلُ مَعِي',
      options: ['الصَّدِيقُ الَّذِي يَعْمَلُ مَعِي', 'الْأَصْدِقَاءُ الَّذِينَ يَعْمَلُونَ مَعِي', 'الصَّدِيقَةُ الَّتِي تَعْمَلُ مَعِي'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'مَوْعِدٌ', english: 'appointment' },
        { arabic: 'اجْتِمَاعٌ', english: 'meeting at work' },
        { arabic: 'مَشْغُولٌ', english: 'busy' },
        { arabic: 'مُنَاسِبٌ', english: 'convenient' },
        { arabic: 'آسِفٌ', english: 'sorry' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with the noun it goes with.',
      pairs: [
        { arabic: 'الَّذِي', english: 'a masculine noun' },
        { arabic: 'الَّتِي', english: 'a feminine noun' },
        { arabic: 'الَّذِينَ', english: 'people in the plural' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I cancelled the meeting that was on Tuesday.',
      words: ['أَلْغَيْتُ', 'الِاجْتِمَاعَ', 'الَّذِي', 'كَانَ', 'يَوْمَ', 'الثُّلَاثَاءِ'],
      distractors: ['الَّتِي'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'The café that we like is closed.',
      words: ['الْمَقْهَى', 'الَّذِي', 'نُحِبُّهُ', 'مُغْلَقٌ'],
      distractors: ['الَّذِينَ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَيْنَ الْمَطْعَمُ',
      after: 'تَحَدَّثْتَ عَنْهُ؟',
      english: 'Where is the restaurant you talked about?',
      options: ['الَّذِي', 'الَّتِي', 'الَّذِينَ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هَؤُلَاءِ هُمُ الطُّلَّابُ',
      after: 'يَدْرُسُونَ مَعِي.',
      english: 'These are the students who study with me.',
      options: ['الَّتِي', 'الَّذِي', 'الَّذِينَ'],
      answer: 2,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'لِلْأَسَفِ،',
      after: 'الْمَوْعِدَ إِلَى الْأُسْبُوعِ الْقَادِمِ.',
      english: 'Unfortunately, we postponed the appointment to next week.',
      options: ['اتَّفَقْنَا', 'أَجَّلْنَا', 'أَلْغَيْنَا'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'الَّذِي، الَّتِي and الَّذِينَ join a sentence to a definite noun, like “who”, “which” or “that” in English. Pick the one that matches the noun.',
    },
    {
      type: 'table',
      head: ['Noun', 'Word', 'Example'],
      rows: [
        ['masculine', 'الَّذِي', 'الْفُنْدُقُ الَّذِي حَجَزْتُهُ'],
        ['feminine, or things in the plural', 'الَّتِي', 'الْغُرْفَةُ الَّتِي حَجَزْتُهَا'],
        ['people in the plural', 'الَّذِينَ', 'الطُّلَّابُ الَّذِينَ يَدْرُسُونَ مَعِي'],
      ],
    },
    {
      type: 'example',
      arabic: 'الْفُنْدُقُ الَّذِي حَجَزْتُهُ قَرِيبٌ مِنَ الْبَحْرِ.',
      translit: 'al-funduqu lladhī ḥajaztuhu qarībun mina l-baḥr.',
      english: 'The hotel I booked is close to the sea.',
    },
    {
      type: 'p',
      text: 'When the verb after it has an object, Arabic points back to the noun with a pronoun: الْفُنْدُقُ الَّذِي حَجَزْتُهُ is literally “the hotel which I booked it”. English leaves that pronoun out.',
    },
    {
      type: 'p',
      text: 'Use these words only after a definite noun (one with الـ, or a name). After an indefinite noun Arabic leaves them out; you will meet that in B1.',
    },
    {
      type: 'example',
      arabic: 'أَلْغَيْتُ الْمَوْعِدَ الَّذِي كَانَ يَوْمَ الْأَحَدِ.',
      translit: 'alghaytu l-mawʿida lladhī kāna yawma l-aḥad.',
      english: 'I cancelled the appointment that was on Sunday.',
    },
  ],
  cultureTip: {
    title: 'Moving a plan',
    body: 'Plans in Cairo bend easily: traffic, work and family can move a meeting at short notice, and changing it is not rude as long as you call or message early. Soften it with آسِفٌ جِدًّا and suggest a new time yourself: هَلْ يُنَاسِبُكَ يَوْمُ الْخَمِيسِ؟',
  },
};
