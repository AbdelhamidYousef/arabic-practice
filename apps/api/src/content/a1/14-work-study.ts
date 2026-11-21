import type { ContentLesson } from '../types.ts';

// A1 L14: work and study. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L14: C08, G11, G12; the row has no culture item, so the tip is a short practical one); the owner
// reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-work-study',
  unit: 'A1.2',
  kind: 'lesson',
  title: 'What do you do?',
  topic: 'Talking about work and study',
  summary: 'Say your job and nationality, and where and with whom you work or study.',
  goals: [
    'Say your job or what you study',
    'Make nationality words: مِصْرِيٌّ, مِصْرِيَّةٌ',
    'Use فِي, مِنْ, إِلَى, عَلَى and مَعَ',
  ],
  grammarFocus: 'Nationality ends in -iyy / -iyya; the prepositions فِي, مِنْ, إِلَى, عَلَى, مَعَ.',
  scenario:
    'You are Rana, a friendly Egyptian engineer who works in the same office building in Cairo as ' +
    'the learner. You meet in the lift in the morning. Ask what their job is, where they are from ' +
    '(their nationality), where they work or study and with whom, and say the same about yourself: ' +
    'you are Egyptian, an engineer in a company, and your brother is a student at the university. ' +
    'Use very short sentences, the I-forms أَعْمَلُ and أَدْرُسُ, and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'صَبَاحُ الْخَيْرِ! أَنَا رَنَا، مُهَنْدِسَةٌ. مَا عَمَلُكَ؟',
  vocab: [
    { arabic: 'عَمَلٌ', translit: 'ʿamal', english: 'work, job' },
    {
      arabic: 'مُهَنْدِسٌ',
      translit: 'muhandis',
      english: 'engineer',
      note: 'A woman: مُهَنْدِسَةٌ (muhandisa). Most jobs add ة the same way.',
    },
    { arabic: 'طَبِيبٌ', translit: 'ṭabīb', english: 'doctor' },
    { arabic: 'مُعَلِّمٌ', translit: 'muʿallim', english: 'teacher' },
    { arabic: 'طَالِبٌ', translit: 'ṭālib', english: 'student' },
    { arabic: 'مُوَظَّفٌ', translit: 'muwaẓẓaf', english: 'employee, office worker' },
    { arabic: 'شَرِكَةٌ', translit: 'sharika', english: 'company' },
    { arabic: 'مَكْتَبٌ', translit: 'maktab', english: 'office, desk' },
    { arabic: 'جَامِعَةٌ', translit: 'jāmiʿa', english: 'university' },
    { arabic: 'مَدْرَسَةٌ', translit: 'madrasa', english: 'school' },
    { arabic: 'مُسْتَشْفًى', translit: 'mustashfā', english: 'hospital' },
    { arabic: 'أَعْمَلُ', translit: 'aʿmal', english: 'I work' },
    { arabic: 'أَدْرُسُ', translit: 'adrus', english: 'I study' },
    {
      arabic: 'مِصْرِيٌّ',
      translit: 'miṣrī',
      english: 'Egyptian (a man)',
      note: 'A woman: مِصْرِيَّةٌ (miṣriyya).',
    },
    { arabic: 'مَعَ', translit: 'maʿa', english: 'with' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word means “student”?',
      options: ['مُعَلِّمٌ', 'طَالِبٌ', 'طَبِيبٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'A woman from Egypt. Pick the right word.',
      options: ['مِصْرِيَّةٌ', 'مِصْرُ', 'مِصْرِيٌّ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Pick a natural answer.',
      promptArabic: 'مَا عَمَلُكَ؟',
      options: ['أَنَا مِنْ مِصْرَ', 'أَنَا بِخَيْرٍ', 'أَنَا طَبِيبٌ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'أَعْمَلُ فِي مُسْتَشْفًى',
      options: ['أَعْمَلُ فِي مَدْرَسَةٍ', 'أَعْمَلُ فِي مُسْتَشْفًى', 'أَعْمَلُ فِي شَرِكَةٍ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'أَدْرُسُ فِي الْجَامِعَةِ',
      options: ['أَدْرُسُ فِي الْجَامِعَةِ', 'أَعْمَلُ فِي الْجَامِعَةِ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'مُهَنْدِسٌ', english: 'engineer' },
        { arabic: 'مُعَلِّمٌ', english: 'teacher' },
        { arabic: 'مُوَظَّفٌ', english: 'employee' },
        { arabic: 'شَرِكَةٌ', english: 'company' },
        { arabic: 'جَامِعَةٌ', english: 'university' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I work in an office.',
      words: ['أَعْمَلُ', 'فِي', 'مَكْتَبٍ'],
      distractors: ['مَعَ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I study with my sister.',
      words: ['أَدْرُسُ', 'مَعَ', 'أُخْتِي'],
      distractors: ['عَلَى'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَنَا',
      after: 'لُبْنَانَ.',
      english: 'I am from Lebanon.',
      options: ['إِلَى', 'مِنْ', 'عَلَى'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هِيَ طَالِبَةٌ',
      after: '',
      english: 'She is an Egyptian student.',
      options: ['مِصْرِيٌّ', 'مِصْرِيَّةٌ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'الْكِتَابُ',
      after: 'الْمَكْتَبِ.',
      english: 'The book is on the desk.',
      options: ['عَلَى', 'مَعَ', 'مِنْ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Ask a man if he is a teacher.',
      options: ['هَلْ أَنْتِ مُعَلِّمَةٌ؟', 'هَلْ أَنْتَ مُعَلِّمٌ؟', 'أَيْنَ الْمُعَلِّمُ؟'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To make a nationality, add -iyy (ـِيٌّ) to the name of the country, and -iyya (ـِيَّةٌ) for a woman. A country with الـ drops it, and a final ا usually goes too.',
    },
    {
      type: 'table',
      head: ['Country', 'He is…', 'She is…'],
      rows: [
        ['مِصْرُ', 'مِصْرِيٌّ', 'مِصْرِيَّةٌ'],
        ['لُبْنَانُ', 'لُبْنَانِيٌّ', 'لُبْنَانِيَّةٌ'],
        ['الْمَغْرِبُ', 'مَغْرِبِيٌّ', 'مَغْرِبِيَّةٌ'],
        ['أَمْرِيكَا', 'أَمْرِيكِيٌّ', 'أَمْرِيكِيَّةٌ'],
      ],
    },
    {
      type: 'p',
      text: 'Prepositions are the small words before a noun. The noun after them ends in a kasra: فِي شَرِكَةٍ, عَلَى الْمَكْتَبِ.',
    },
    {
      type: 'table',
      head: ['Word', 'Meaning', 'Example'],
      rows: [
        ['فِي', 'in, at', 'أَعْمَلُ فِي شَرِكَةٍ.'],
        ['مِنْ', 'from', 'أَنَا مِنْ لُبْنَانَ.'],
        ['إِلَى', 'to', 'أَذْهَبُ إِلَى الْجَامِعَةِ.'],
        ['عَلَى', 'on', 'الْكِتَابُ عَلَى الْمَكْتَبِ.'],
        ['مَعَ', 'with', 'أَعْمَلُ مَعَ رَنَا.'],
      ],
    },
    {
      type: 'example',
      arabic: 'أَنَا مُهَنْدِسَةٌ مِصْرِيَّةٌ، أَعْمَلُ فِي شَرِكَةٍ',
      translit: 'anā muhandisa miṣriyya, aʿmal fī sharika',
      english: 'I am an Egyptian engineer (a woman); I work in a company.',
    },
  ],
  cultureTip: {
    title: 'Asking about work',
    body: 'In Egypt “what do you do?” comes early in a conversation, often with where you studied. A short answer is fine. People may also be curious about why you came to Cairo, so have a simple sentence ready, like أَعْمَلُ هُنَا (I work here) or أَدْرُسُ الْعَرَبِيَّةَ (I study Arabic).',
  },
};
