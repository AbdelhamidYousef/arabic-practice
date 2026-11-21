import type { ContentLesson } from '../types.ts';

// A1 L22: fill in a form. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L22: C72, G29); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-forms',
  unit: 'A1.2',
  kind: 'lesson',
  title: 'Filling in a form',
  topic: 'Signing up at a gym: your name, details and signature',
  summary:
    'Give your personal details for a form, spell your name, and understand “write”, “wait” and “sign here”.',
  goals: [
    'Understand the fields of a form: name, nationality, date of birth',
    'Give your details and spell your name',
    'Understand and use polite commands: “write”, “wait”, “sign here”',
  ],
  grammarFocus: 'Common commands as phrases: تَفَضَّلْ، اُكْتُبْ، اِنْتَظِرْ، وَقِّعْ هُنَا.',
  scenario:
    'You are Omar, the receptionist at a gym in Cairo where the learner is signing up. Ask for ' +
    'their details one at a time: name (ask them to spell it letter by letter), nationality, date ' +
    'of birth, phone number, address and occupation. Use polite commands such as تَفَضَّلْ، ' +
    'اِنْتَظِرْ قَلِيلًا، اُكْتُبْ هُنَا، وَقِّعْ هُنَا. ' +
    'Use very short sentences and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا وَسَهْلًا! تَفَضَّلْ، اِجْلِسْ. مَا اسْمُكَ؟',
  vocab: [
    { arabic: 'اسْتِمَارَةٌ', translit: 'istimāra', english: 'form (to fill in)' },
    { arabic: 'الِاسْمُ', translit: 'al-ism', english: 'name' },
    { arabic: 'الْعُنْوَانُ', translit: 'al-ʿunwān', english: 'address' },
    { arabic: 'تَارِيخُ الْمِيلَادِ', translit: 'tārīkh al-mīlād', english: 'date of birth' },
    { arabic: 'الْجِنْسِيَّةُ', translit: 'al-jinsiyya', english: 'nationality' },
    { arabic: 'الْمِهْنَةُ', translit: 'al-mihna', english: 'occupation, job' },
    { arabic: 'الْبَرِيدُ الْإِلِكْتُرُونِيُّ', translit: 'al-barīd al-iliktrūnī', english: 'email' },
    { arabic: 'التَّوْقِيعُ', translit: 'at-tawqīʿ', english: 'signature' },
    {
      arabic: 'تَفَضَّلْ',
      translit: 'tafaḍḍal',
      english: 'please; here you are; come in',
      note: 'To a woman: تَفَضَّلِي.',
    },
    { arabic: 'اُكْتُبْ', translit: 'uktub', english: 'write!' },
    { arabic: 'اِمْلَأْ', translit: 'imlaʾ', english: 'fill in!' },
    { arabic: 'وَقِّعْ', translit: 'waqqiʿ', english: 'sign!' },
    { arabic: 'اِنْتَظِرْ', translit: 'intaẓir', english: 'wait!' },
    { arabic: 'هُنَا', translit: 'hunā', english: 'here' },
    {
      arabic: 'مِنْ فَضْلِكَ',
      translit: 'min faḍlik',
      english: 'please (to a man)',
      note: 'To a woman: مِنْ فَضْلِكِ.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'The receptionist hands you a pen and says “here you are”. Which word does he use?',
      options: ['اِنْتَظِرْ', 'تَفَضَّلْ', 'وَقِّعْ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which field asks for your date of birth?',
      options: ['الْجِنْسِيَّةُ', 'الْمِهْنَةُ', 'تَارِيخُ الْمِيلَادِ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'وَقِّعْ هُنَا',
      options: ['اُكْتُبْ هُنَا', 'اِنْتَظِرْ هُنَا', 'وَقِّعْ هُنَا'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'الْجِنْسِيَّةُ',
      options: ['الْجِنْسِيَّةُ', 'الْعُنْوَانُ', 'التَّوْقِيعُ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each field with its meaning.',
      pairs: [
        { arabic: 'الِاسْمُ', english: 'name' },
        { arabic: 'الْعُنْوَانُ', english: 'address' },
        { arabic: 'الْمِهْنَةُ', english: 'occupation' },
        { arabic: 'التَّوْقِيعُ', english: 'signature' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each command with its meaning.',
      pairs: [
        { arabic: 'اُكْتُبْ', english: 'write!' },
        { arabic: 'اِنْتَظِرْ', english: 'wait!' },
        { arabic: 'اِمْلَأْ', english: 'fill in!' },
        { arabic: 'وَقِّعْ', english: 'sign!' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Write your name here, please.',
      words: ['اُكْتُبِ', 'اسْمَكَ', 'هُنَا', 'مِنْ', 'فَضْلِكَ'],
      distractors: ['اِنْتَظِرْ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Wait a little, please.',
      words: ['اِنْتَظِرْ', 'قَلِيلًا', 'مِنْ', 'فَضْلِكَ'],
      distractors: ['وَقِّعْ'],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'What is your nationality? (to a man)',
      words: ['مَا', 'جِنْسِيَّتُكَ'],
      distractors: ['عُنْوَانُكَ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap (talking to a woman).',
      before: '',
      after: 'هُنَا، مِنْ فَضْلِكِ.',
      english: 'Sign here, please. (to a woman)',
      options: ['وَقِّعْ', 'وَقِّعِي'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'اِمْلَأِ',
      after: '، مِنْ فَضْلِكَ.',
      english: 'Fill in the form, please.',
      options: ['الِاسْتِمَارَةَ', 'الِاسْمَ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer to this question.',
      promptArabic: 'مَا مِهْنَتُكَ؟',
      options: ['أَنَا مُعَلِّمٌ', 'أَنَا مِصْرِيٌّ', 'فِي الْقَاهِرَةِ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'On a form, at a desk or in a shop you will hear short commands. For now, learn them as phrases: one form for a man, and one with ـِي at the end for a woman.',
    },
    {
      type: 'table',
      head: ['To a man', 'To a woman', 'Meaning'],
      rows: [
        ['تَفَضَّلْ', 'تَفَضَّلِي', 'please; here you are; come in'],
        ['اُكْتُبْ', 'اُكْتُبِي', 'write'],
        ['اِنْتَظِرْ', 'اِنْتَظِرِي', 'wait'],
        ['اِمْلَأْ', 'اِمْلَئِي', 'fill in'],
        ['وَقِّعْ', 'وَقِّعِي', 'sign'],
      ],
    },
    {
      type: 'p',
      text: 'Add مِنْ فَضْلِكَ (to a man) or مِنْ فَضْلِكِ (to a woman) to make any command polite. When the next word starts with الْ or a silent alif, the command ends in a short i to join them: اُكْتُبِ اسْمَكَ.',
    },
    {
      type: 'example',
      arabic: 'اُكْتُبِ اسْمَكَ هُنَا، مِنْ فَضْلِكَ.',
      translit: 'uktubi smaka hunā, min faḍlik',
      english: 'Write your name here, please.',
    },
    {
      type: 'example',
      arabic: 'اِنْتَظِرِي قَلِيلًا، مِنْ فَضْلِكِ.',
      translit: 'intaẓirī qalīlan, min faḍlik',
      english: 'Wait a little, please. (to a woman)',
    },
  ],
  cultureTip: {
    title: 'Your name in four parts',
    body: 'Egyptian forms often ask for your name in four parts: your own name, your father’s, your grandfather’s and the family name. As a foreigner, write your name exactly as it is in your passport, and keep the passport with you: its number is asked for almost everywhere.',
  },
};
