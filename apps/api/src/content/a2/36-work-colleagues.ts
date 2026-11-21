import type { ContentLesson } from '../types.ts';

// A2 L36: talk about your work and your colleagues. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L36: C23, G69 + G72, V20, K22). The owner reviews the Arabic before real
// learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-work-colleagues',
  unit: 'A2.1',
  kind: 'lesson',
  title: 'Work and colleagues',
  topic: 'A busy week at the office',
  summary: 'Talk about your job, your colleagues and your week, and use polite titles at work.',
  goals: [
    'Talk about your work, your meetings and your projects',
    'Say “he helps me” or “I know her” with a pronoun on the verb',
    'Spot the three-letter root that related words share',
  ],
  grammarFocus: 'Pronouns on verbs (يَعْرِفُنِي، أَعْرِفُهَا) and the three-letter root (ك ت ب).',
  scenario:
    'You are Rania, the learner’s friendly colleague at a company in Cairo, chatting in the office ' +
    'kitchen on a busy Sunday, the first day of the working week. Talk about work, meetings, the ' +
    'project and colleagues, including the manager, whom you call الْأُسْتَاذُ هِشَامٌ. Use pronouns ' +
    'on verbs (يُسَاعِدُنِي، أَعْرِفُهُ) and polite titles in short A2 sentences with mostly words from ' +
    'the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'صَبَاحُ الْخَيْرِ! أَنَا رَانِيَا، زَمِيلَتُكَ فِي الْمَشْرُوعِ الْجَدِيدِ. كَيْفَ الْعَمَلُ مَعَنَا؟',
  vocab: [
    { arabic: 'شَرِكَةٌ', translit: 'sharika', english: 'company' },
    { arabic: 'مَكْتَبٌ', translit: 'maktab', english: 'office, desk' },
    { arabic: 'مُدِيرٌ', translit: 'mudīr', english: 'manager' },
    {
      arabic: 'زَمِيلٌ',
      translit: 'zamīl',
      english: 'colleague',
      note: 'Feminine زَمِيلَةٌ; plural زُمَلَاءُ.',
    },
    { arabic: 'اجْتِمَاعٌ', translit: 'ijtimāʿ', english: 'meeting' },
    { arabic: 'مَشْرُوعٌ', translit: 'mashrūʿ', english: 'project' },
    { arabic: 'عَمِيلٌ', translit: 'ʿamīl', english: 'client' },
    { arabic: 'تَقْرِيرٌ', translit: 'taqrīr', english: 'report' },
    { arabic: 'مَوْعِدٌ', translit: 'mawʿid', english: 'appointment; deadline' },
    { arabic: 'بَرِيدٌ إِلِكْتُرُونِيٌّ', translit: 'barīd iliktrūnī', english: 'email' },
    { arabic: 'يَعْمَلُ', translit: 'yaʿmal', english: 'to work' },
    { arabic: 'يَكْتُبُ', translit: 'yaktub', english: 'to write' },
    { arabic: 'يُرْسِلُ', translit: 'yursil', english: 'to send' },
    { arabic: 'يُسَاعِدُ', translit: 'yusāʿid', english: 'to help' },
    { arabic: 'يَعْرِفُ', translit: 'yaʿrif', english: 'to know' },
    {
      arabic: 'أُسْتَاذٌ',
      translit: 'ustādh',
      english: 'Mr, sir (a polite title); teacher',
      note: 'For a woman: أُسْتَاذَةٌ.',
    },
    {
      arabic: 'حَضْرَتُكَ',
      translit: 'ḥaḍratuka',
      english: 'you (very polite)',
      note: 'To a woman: حَضْرَتُكِ.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word shares a root with this word?',
      promptArabic: 'كِتَابٌ',
      options: ['مَدِيرٌ', 'مَكْتَبٌ', 'شَرِكَةٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Which word shares a root with this word?',
      promptArabic: 'يَعْمَلُ',
      options: ['عَمِيلٌ', 'مَوْعِدٌ', 'زَمِيلٌ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'How do you say “he knows me”?',
      options: ['يَعْرِفُهُ', 'أَعْرِفُهُ', 'يَعْرِفُنِي'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'الْمُدِيرُ فِي اجْتِمَاعٍ',
      options: ['الْمُدِيرُ فِي مَكْتَبِهِ', 'الْمُدِيرُ فِي اجْتِمَاعٍ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'زَمِيلَتِي تُسَاعِدُنِي',
      options: ['زَمِيلَتِي تُسَاعِدُنِي', 'زَمِيلِي يُسَاعِدُنِي', 'زَمِيلَتِي تُسَاعِدُهُ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'مُدِيرٌ', english: 'manager' },
        { arabic: 'زَمِيلٌ', english: 'colleague' },
        { arabic: 'عَمِيلٌ', english: 'client' },
        { arabic: 'تَقْرِيرٌ', english: 'report' },
        { arabic: 'مَوْعِدٌ', english: 'appointment' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each verb with its meaning.',
      pairs: [
        { arabic: 'يَعْرِفُنِي', english: 'he knows me' },
        { arabic: 'يَعْرِفُكَ', english: 'he knows you' },
        { arabic: 'يَعْرِفُهُ', english: 'he knows him' },
        { arabic: 'يَعْرِفُهَا', english: 'he knows her' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I write the report and send it to the manager.',
      words: ['أَكْتُبُ', 'التَّقْرِيرَ', 'وَأُرْسِلُهُ', 'إِلَى', 'الْمُدِيرِ'],
      distractors: ['وَأُرْسِلُهَا'],
    },
    {
      type: 'build',
      prompt: 'Build the polite question.',
      english: 'How can I help you, sir?',
      words: ['كَيْفَ', 'أُسَاعِدُ', 'حَضْرَتَكَ'],
      distractors: ['يُسَاعِدُنِي'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هَلْ تَعْرِفُ الْأُسْتَاذَ هِشَامًا؟ نَعَمْ،',
      after: '',
      english: 'Do you know Mr Hesham? Yes, I know him.',
      options: ['أَعْرِفُهُ', 'أَعْرِفُهَا'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'عِنْدِي',
      after: 'مَعَ عَمِيلٍ فِي الْعَاشِرَةِ.',
      english: 'I have a meeting with a client at ten.',
      options: ['تَقْرِيرٌ', 'اجْتِمَاعٌ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'The pronoun endings you know on nouns (كِتَابِي، كِتَابُكَ) also go on verbs, as the object: “he knows me”, “I help her”. For “me”, a verb takes ـنِي, not ـِي.',
    },
    {
      type: 'table',
      head: ['Ending', 'Meaning', 'Example'],
      rows: [
        ['ـنِي', 'me', 'يَعْرِفُنِي'],
        ['ـكَ / ـكِ', 'you (m / f)', 'أُسَاعِدُكَ / أُسَاعِدُكِ'],
        ['ـهُ', 'him, it', 'أَكْتُبُهُ'],
        ['ـهَا', 'her, it', 'أُحِبُّهَا'],
        ['ـنَا', 'us', 'يَعْرِفُنَا'],
      ],
    },
    {
      type: 'example',
      arabic: 'الْمُدِيرُ يَعْرِفُنِي، وَأَنَا أَعْرِفُهُ.',
      translit: 'al-mudīr yaʿrifunī, wa-anā aʿrifuh',
      english: 'The manager knows me, and I know him.',
    },
    {
      type: 'p',
      text: 'Most Arabic words are built on a root of three letters that carries the meaning. Different patterns around the root make related words, so one root you know opens many words.',
    },
    {
      type: 'table',
      head: ['Root', 'Words', 'Meanings'],
      rows: [
        ['ك ت ب', 'كَتَبَ، كِتَابٌ، مَكْتَبٌ، كَاتِبٌ', 'he wrote, book, office, writer'],
        ['ع م ل', 'عَمِلَ، عَمَلٌ، عَمِيلٌ', 'he worked, work, client'],
        ['د ر س', 'دَرَسَ، دَرْسٌ، مَدْرَسَةٌ', 'he studied, lesson, school'],
      ],
    },
    {
      type: 'example',
      arabic: 'أَكْتُبُ التَّقْرِيرَ فِي مَكْتَبِي.',
      translit: 'aktub at-taqrīr fī maktabī',
      english: 'I write the report in my office.',
    },
  ],
  cultureTip: {
    title: 'Titles at work',
    body: 'In Egypt a bare first name is rare with someone older or senior. A man is أُسْتَاذ, “Mr”, before his first name (أُسْتَاذ هِشَام), a woman أُسْتَاذَة. A doctor, and often any senior professional, is يَا دُكْتُور. حَضْرَتُكَ, literally “your presence”, is a very polite “you” for a stranger, a customer or your boss.',
  },
};
