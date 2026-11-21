import type { ContentLesson } from '../types.ts';

// A2 L34: hobbies, sport and free time. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L34: C27, G33 + G34, V23). The owner reviews the Arabic before real
// learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-free-time',
  unit: 'A2.1',
  kind: 'lesson',
  title: 'Sport and free time',
  topic: 'Talking about hobbies at the sports club',
  summary: 'Talk about your hobbies and sports, say how often you do them, and give a date.',
  goals: [
    'Talk about the sports and hobbies you like',
    'Say how often: always, usually, sometimes, never',
    'Use “first”, “second”, “third” and say a date',
  ],
  grammarFocus: 'How often (دَائِمًا، أَحْيَانًا، لَا … أَبَدًا) and ordinal numbers (الْأَوَّلُ، الثَّانِي).',
  scenario:
    'You are Youssef, a friendly member of a sports club in Heliopolis, Cairo, chatting with the ' +
    'learner after a game of football. Talk about sports, hobbies and free time, ask how often the ' +
    'learner does things, and mention the date of the next match. Use frequency words and ordinal ' +
    'numbers in short A2 sentences with mostly words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'مَسَاءُ الْخَيْرِ! أَنَا يُوسُفُ. أَلْعَبُ كُرَةَ الْقَدَمِ هُنَا كُلَّ أُسْبُوعٍ. وَأَنْتَ، هَلْ تَلْعَبُ رِيَاضَةً؟',
  vocab: [
    { arabic: 'رِيَاضَةٌ', translit: 'riyāḍa', english: 'sport' },
    { arabic: 'هِوَايَةٌ', translit: 'hiwāya', english: 'hobby' },
    { arabic: 'وَقْتُ الْفَرَاغِ', translit: 'waqt al-farāgh', english: 'free time' },
    { arabic: 'كُرَةُ الْقَدَمِ', translit: 'kurat al-qadam', english: 'football' },
    { arabic: 'سِبَاحَةٌ', translit: 'sibāḥa', english: 'swimming' },
    { arabic: 'فَرِيقٌ', translit: 'farīq', english: 'team' },
    { arabic: 'نَادٍ', translit: 'nādī', english: 'club (sports club)', note: 'With الْ: النَّادِي.' },
    { arabic: 'يَلْعَبُ', translit: 'yalʿab', english: 'to play' },
    { arabic: 'يَسْبَحُ', translit: 'yasbaḥ', english: 'to swim' },
    { arabic: 'يَجْرِي', translit: 'yajrī', english: 'to run' },
    { arabic: 'دَائِمًا', translit: 'dāʾiman', english: 'always' },
    { arabic: 'غَالِبًا', translit: 'ghāliban', english: 'usually' },
    { arabic: 'أَحْيَانًا', translit: 'aḥyānan', english: 'sometimes' },
    { arabic: 'نَادِرًا', translit: 'nādiran', english: 'rarely' },
    {
      arabic: 'أَبَدًا',
      translit: 'abadan',
      english: 'never (with a negative)',
      note: 'Always with a negative verb: لَا أَسْبَحُ أَبَدًا.',
    },
    { arabic: 'مَرَّةً', translit: 'marratan', english: 'once', note: 'Twice: مَرَّتَيْنِ.' },
    { arabic: 'الْأَوَّلُ', translit: 'al-awwal', english: 'the first', note: 'Feminine: الْأُولَى.' },
    {
      arabic: 'الثَّالِثُ',
      translit: 'ath-thālith',
      english: 'the third',
      note: 'Feminine: الثَّالِثَةُ. “The second” is الثَّانِي.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word means “sometimes”?',
      options: ['دَائِمًا', 'أَحْيَانًا', 'أَبَدًا'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick the sentence that means “I never swim”.',
      options: ['أَسْبَحُ أَبَدًا', 'لَا أَسْبَحُ دَائِمًا', 'لَا أَسْبَحُ أَبَدًا'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'What do you call something you enjoy doing in your free time?',
      options: ['هِوَايَةٌ', 'فَرِيقٌ', 'نَادٍ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'أَلْعَبُ كُرَةَ الْقَدَمِ أَحْيَانًا',
      options: ['أَلْعَبُ كُرَةَ الْقَدَمِ أَحْيَانًا', 'أَلْعَبُ كُرَةَ الْقَدَمِ دَائِمًا', 'أَلْعَبُ كُرَةَ الْقَدَمِ غَالِبًا'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'الثَّالِثُ',
      options: ['الثَّانِيَةُ', 'الْأَوَّلُ', 'الثَّالِثُ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'يَلْعَبُ', english: 'to play' },
        { arabic: 'يَسْبَحُ', english: 'to swim' },
        { arabic: 'يَجْرِي', english: 'to run' },
        { arabic: 'فَرِيقٌ', english: 'team' },
        { arabic: 'نَادٍ', english: 'club' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'دَائِمًا', english: 'always' },
        { arabic: 'غَالِبًا', english: 'usually' },
        { arabic: 'أَحْيَانًا', english: 'sometimes' },
        { arabic: 'نَادِرًا', english: 'rarely' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I swim twice a week.',
      words: ['أَسْبَحُ', 'مَرَّتَيْنِ', 'فِي', 'الْأُسْبُوعِ'],
      distractors: ['مَرَّةً'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'My birthday is on the first of May.',
      words: ['عِيدُ', 'مِيلَادِي', 'فِي', 'الْأَوَّلِ', 'مِنْ', 'مَايُو'],
      distractors: ['الْأُولَى'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هَلْ تَلْعَبُ',
      after: 'فِي وَقْتِ الْفَرَاغِ؟',
      english: 'Do you play sport in your free time?',
      options: ['هِوَايَةً', 'رِيَاضَةً'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'تَسْكُنُ هُدَى فِي الطَّابِقِ',
      after: '',
      english: 'Hoda lives on the third floor.',
      options: ['ثَلَاثَةٍ', 'الثَّالِثِ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To say how often, put a frequency word after the verb or at the end of the sentence. أَبَدًا, “never”, always goes with a negative verb: لَا … أَبَدًا.',
    },
    {
      type: 'example',
      arabic: 'أَشْرَبُ الْقَهْوَةَ دَائِمًا.',
      translit: 'ashrab al-qahwa dāʾiman',
      english: 'I always drink coffee.',
    },
    {
      type: 'example',
      arabic: 'لَا أَجْرِي أَبَدًا.',
      translit: 'lā ajrī abadan',
      english: 'I never run.',
    },
    {
      type: 'p',
      text: 'Ordinal numbers (first, second, third) are adjectives: they come after the noun and agree with it. Only “first” is irregular. For a date, say فِي, the ordinal, مِنْ and the month.',
    },
    {
      type: 'table',
      head: ['Meaning', 'Masculine', 'Feminine'],
      rows: [
        ['first', 'الْأَوَّلُ', 'الْأُولَى'],
        ['second', 'الثَّانِي', 'الثَّانِيَةُ'],
        ['third', 'الثَّالِثُ', 'الثَّالِثَةُ'],
        ['fourth', 'الرَّابِعُ', 'الرَّابِعَةُ'],
        ['fifth', 'الْخَامِسُ', 'الْخَامِسَةُ'],
        ['tenth', 'الْعَاشِرُ', 'الْعَاشِرَةُ'],
      ],
    },
    {
      type: 'example',
      arabic: 'عِيدُ مِيلَادِي فِي الثَّالِثِ مِنْ مَايُو.',
      translit: 'ʿīd mīlādī fī th-thālith min māyū',
      english: 'My birthday is on the third of May.',
    },
  ],
  cultureTip: {
    title: 'Al Ahly or Zamalek?',
    body: 'Cairo’s two biggest football clubs are الْأَهْلِيُّ and الزَّمَالِكُ. Their match, the Cairo derby, is one of the biggest games in Africa, and people watch it together at home and in cafés. “Ahly or Zamalek?” is an easy way to start a conversation, but choose your answer with care!',
  },
};
