import type { ContentLesson } from '../types.ts';

// A1 L09: at the pharmacy. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L09: C77; the row has no grammar spot, so this lesson teaches يُؤْلِمُنِي / تُؤْلِمُنِي and عِنْدِي +
// an illness as a phrase); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-pharmacy',
  unit: 'A1.1',
  kind: 'lesson',
  title: 'At the pharmacy',
  topic: 'Saying what hurts and asking for medicine',
  summary: 'Tell a pharmacist what hurts and ask for something for it.',
  goals: [
    'Name a few parts of the body',
    'Say what hurts: رَأْسِي يُؤْلِمُنِي',
    'Ask for medicine and understand simple advice',
  ],
  grammarFocus: '“It hurts me”: يُؤْلِمُنِي for a masculine body part, تُؤْلِمُنِي for a feminine one.',
  scenario:
    'You are Nadia, a kind pharmacist in a small pharmacy in Cairo. The learner, who is new in the ' +
    'city, comes in in the evening after a long, hot day at the pyramids. Ask what the problem is ' +
    'and what hurts, offer something simple (tablets for a headache, water, rest), say in simple ' +
    'words how often to take it (twice a day) and wish them well. Stay inside this simple role-play ' +
    'and give no real medical advice. Use very short sentences and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'مَسَاءُ الْخَيْرِ! مَا الْمُشْكِلَةُ؟',
  vocab: [
    { arabic: 'صَيْدَلِيَّةٌ', translit: 'ṣaydaliyya', english: 'pharmacy' },
    { arabic: 'دَوَاءٌ', translit: 'dawāʾ', english: 'medicine' },
    { arabic: 'رَأْسٌ', translit: 'raʾs', english: 'head' },
    { arabic: 'بَطْنٌ', translit: 'baṭn', english: 'stomach, belly' },
    { arabic: 'ظَهْرٌ', translit: 'ẓahr', english: 'back' },
    { arabic: 'حَلْقٌ', translit: 'ḥalq', english: 'throat' },
    { arabic: 'عَيْنٌ', translit: 'ʿayn', english: 'eye', note: 'Feminine, though it has no ة.' },
    { arabic: 'يَدٌ', translit: 'yad', english: 'hand', note: 'Feminine, though it has no ة.' },
    { arabic: 'صُدَاعٌ', translit: 'ṣudāʿ', english: 'headache' },
    { arabic: 'حَرَارَةٌ', translit: 'ḥarāra', english: 'fever, temperature' },
    { arabic: 'يُؤْلِمُنِي', translit: 'yuʾlimunī', english: 'it hurts me' },
    { arabic: 'حُبُوبٌ', translit: 'ḥubūb', english: 'tablets, pills' },
    {
      arabic: 'مَرِيضٌ',
      translit: 'marīḍ',
      english: 'ill, sick (a man)',
      note: 'A woman: مَرِيضَةٌ (marīḍa).',
    },
    { arabic: 'رَاحَةٌ', translit: 'rāḥa', english: 'rest' },
    { arabic: 'مَرَّتَيْنِ فِي الْيَوْمِ', translit: 'marratayn fī l-yawm', english: 'twice a day' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word means “medicine”?',
      options: ['صُدَاعٌ', 'دَوَاءٌ', 'رَاحَةٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'The eye is feminine. Pick the right sentence.',
      options: ['عَيْنِي يُؤْلِمُنِي', 'عَيْنِي تُؤْلِمُنِي'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Your stomach hurts. What do you say?',
      options: ['ظَهْرِي يُؤْلِمُنِي', 'رَأْسِي يُؤْلِمُنِي', 'بَطْنِي يُؤْلِمُنِي'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'عِنْدِي صُدَاعٌ',
      options: ['عِنْدِي حَرَارَةٌ', 'عِنْدِي صُدَاعٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'حَلْقِي يُؤْلِمُنِي',
      options: ['حَلْقِي يُؤْلِمُنِي', 'يَدِي تُؤْلِمُنِي', 'رَأْسِي يُؤْلِمُنِي'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each body part with its meaning.',
      pairs: [
        { arabic: 'رَأْسٌ', english: 'head' },
        { arabic: 'ظَهْرٌ', english: 'back' },
        { arabic: 'يَدٌ', english: 'hand' },
        { arabic: 'عَيْنٌ', english: 'eye' },
        { arabic: 'حَلْقٌ', english: 'throat' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'My head hurts.',
      words: ['رَأْسِي', 'يُؤْلِمُنِي'],
      distractors: ['تُؤْلِمُنِي'],
    },
    {
      type: 'build',
      prompt: 'Build the request.',
      english: 'I would like medicine for a headache.',
      words: ['أُرِيدُ', 'دَوَاءً', 'لِلصُّدَاعِ'],
      distractors: ['حَرَارَةٌ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'يَدِي',
      after: '',
      english: 'My hand hurts.',
      options: ['يُؤْلِمُنِي', 'تُؤْلِمُنِي'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'مَرِيضَةٌ.',
      english: 'I am ill. (a woman)',
      options: ['أَنَا', 'أَنْتَ', 'هَلْ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'How do you say “twice a day”?',
      options: ['مَرَّةً أُخْرَى', 'مَرَّتَيْنِ فِي الْيَوْمِ', 'غَدًا'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'The pharmacist speaks too fast. What do you say?',
      options: ['لَا أَفْهَمُ، بِبُطْءٍ مِنْ فَضْلِكَ', 'أَنَا فِي الطَّرِيقِ', 'هٰذَا جَمِيلٌ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To say what hurts, name the body part with ـِي (my, from lesson 4), then يُؤْلِمُنِي (yuʾlimunī), “it hurts me”.',
    },
    {
      type: 'example',
      arabic: 'رَأْسِي يُؤْلِمُنِي',
      translit: 'raʾsī yuʾlimunī',
      english: 'My head hurts.',
    },
    {
      type: 'p',
      text: 'Some body parts are feminine without ة, mostly the ones that come in pairs: عَيْنٌ (eye), يَدٌ (hand), أُذُنٌ (ear). With them the verb starts with تُـ, like تَعْمَلُ in lesson 3.',
    },
    {
      type: 'table',
      head: ['Body part', 'Gender', 'It hurts'],
      rows: [
        ['رَأْسٌ', 'masculine', 'رَأْسِي يُؤْلِمُنِي'],
        ['بَطْنٌ', 'masculine', 'بَطْنِي يُؤْلِمُنِي'],
        ['عَيْنٌ', 'feminine', 'عَيْنِي تُؤْلِمُنِي'],
        ['يَدٌ', 'feminine', 'يَدِي تُؤْلِمُنِي'],
      ],
    },
    {
      type: 'p',
      text: 'For an illness, say عِنْدِي (ʿindī), “I have”, and its name. Take it as a phrase for now: lesson 15 explains عِنْدِي.',
    },
    {
      type: 'example',
      arabic: 'عِنْدِي صُدَاعٌ وَحَرَارَةٌ',
      translit: 'ʿindī ṣudāʿ wa-ḥarāra',
      english: 'I have a headache and a fever.',
    },
  ],
  cultureTip: {
    title: 'Ask the pharmacist first',
    body: 'In Egypt the pharmacist is often the first person people ask about a small health problem: pharmacies are everywhere, many open late and some deliver. For anything serious, see a doctor (طَبِيبٌ). In the summer heat, drink plenty of water: a headache after a day in the sun is very common.',
  },
};
