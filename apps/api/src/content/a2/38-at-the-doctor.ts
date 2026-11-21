import type { ContentLesson } from '../types.ts';

// A2 L38: at the doctor. Made-up for this app from the Classroom plan (curriculum/msa/a2.md, L38:
// C30, V26). The plan gives this lesson no grammar spot, so it practises two from the lessons
// before: pronouns on verbs (يُؤْلِمُنِي, G72) and advice with يَجِبُ أَنْ (G73). The owner reviews
// the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-at-the-doctor',
  unit: 'A2.1',
  kind: 'lesson',
  title: 'At the doctor',
  topic: 'A fever and a sore throat',
  summary: 'Say what hurts and since when, understand simple advice, and get your medicine.',
  goals: [
    'Say what hurts and how you feel',
    'Say how long you have been ill with مُنْذُ',
    'Understand the doctor’s advice with يَجِبُ أَنْ',
  ],
  grammarFocus: 'What hurts: يُؤْلِمُنِي رَأْسِي، تُؤْلِمُنِي مَعِدَتِي, and advice with يَجِبُ أَنْ.',
  scenario:
    'You are Dr Samir, a kind family doctor in a clinic in Maadi, Cairo. The learner is your ' +
    'patient. Ask what is wrong, what hurts, since when, and whether they have a temperature, then ' +
    'give simple advice with يَجِبُ أَنْ and say which medicine to get at the pharmacy. Use short ' +
    'A2 sentences with mostly words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا، تَفَضَّلْ بِالْجُلُوسِ. مِمَّ تَشْكُو؟',
  vocab: [
    {
      arabic: 'طَبِيبٌ',
      translit: 'ṭabīb',
      english: 'doctor',
      note: 'You address a doctor as دُكْتُور.',
    },
    { arabic: 'عِيَادَةٌ', translit: 'ʿiyāda', english: 'clinic, surgery' },
    { arabic: 'مَرِيضٌ', translit: 'marīḍ', english: 'ill; a patient' },
    {
      arabic: 'يَشْعُرُ',
      translit: 'yashʿur',
      english: 'to feel',
      note: 'With بِـ: أَشْعُرُ بِالتَّعَبِ, “I feel tired”.',
    },
    { arabic: 'حَرَارَةٌ', translit: 'ḥarāra', english: 'temperature, fever' },
    { arabic: 'سُعَالٌ', translit: 'suʿāl', english: 'cough' },
    { arabic: 'زُكَامٌ', translit: 'zukām', english: 'a cold' },
    {
      arabic: 'يُؤْلِمُ',
      translit: 'yuʾlim',
      english: 'to hurt',
      note: 'يُؤْلِمُنِي ظَهْرِي: my back hurts.',
    },
    { arabic: 'حَلْقٌ', translit: 'ḥalq', english: 'throat' },
    { arabic: 'مَعِدَةٌ', translit: 'maʿida', english: 'stomach' },
    { arabic: 'ظَهْرٌ', translit: 'ẓahr', english: 'back' },
    { arabic: 'دَوَاءٌ', translit: 'dawāʾ', english: 'medicine', note: 'Plural أَدْوِيَةٌ.' },
    { arabic: 'حَبَّةٌ', translit: 'ḥabba', english: 'pill, tablet' },
    { arabic: 'صَيْدَلِيَّةٌ', translit: 'ṣaydaliyya', english: 'pharmacy' },
    { arabic: 'وَصْفَةٌ طِبِّيَّةٌ', translit: 'waṣfa ṭibbiyya', english: 'prescription' },
    { arabic: 'يَرْتَاحُ', translit: 'yartāḥ', english: 'to rest' },
    { arabic: 'مُنْذُ', translit: 'mundhu', english: 'since, for (a time)' },
    {
      arabic: 'سَلَامَتُكَ',
      translit: 'salāmatuka',
      english: 'get well soon',
      note: 'To a woman: سَلَامَتُكِ.',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Your friend is ill. What do you say?',
      options: ['شُكْرًا', 'أَلُو', 'سَلَامَتُكَ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Where do you get medicine?',
      options: ['فِي الصَّيْدَلِيَّةِ', 'فِي الْمَطْبَخِ', 'فِي الْمُتْحَفِ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Pick the correct sentence: “My stomach hurts.”',
      options: ['يُؤْلِمُنِي مَعِدَتِي', 'تُؤْلِمُنِي مَعِدَتِي'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'عِنْدِي حَرَارَةٌ وَسُعَالٌ',
      options: ['عِنْدِي زُكَامٌ وَسُعَالٌ', 'عِنْدِي حَرَارَةٌ وَسُعَالٌ', 'عِنْدِي حَرَارَةٌ وَزُكَامٌ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'يُؤْلِمُنِي حَلْقِي',
      options: ['يُؤْلِمُنِي ظَهْرِي', 'يُؤْلِمُنِي رَأْسِي', 'يُؤْلِمُنِي حَلْقِي'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each part of the body with its meaning.',
      pairs: [
        { arabic: 'حَلْقٌ', english: 'throat' },
        { arabic: 'مَعِدَةٌ', english: 'stomach' },
        { arabic: 'ظَهْرٌ', english: 'back' },
        { arabic: 'رَأْسٌ', english: 'head' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'دَوَاءٌ', english: 'medicine' },
        { arabic: 'حَبَّةٌ', english: 'pill' },
        { arabic: 'صَيْدَلِيَّةٌ', english: 'pharmacy' },
        { arabic: 'عِيَادَةٌ', english: 'clinic' },
        { arabic: 'وَصْفَةٌ طِبِّيَّةٌ', english: 'prescription' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I have had a fever for two days.',
      words: ['عِنْدِي', 'حَرَارَةٌ', 'مُنْذُ', 'يَوْمَيْنِ'],
      distractors: ['يَوْمَانِ'],
    },
    {
      type: 'build',
      prompt: 'Build the doctor’s advice.',
      english: 'You must rest and drink a lot of water.',
      words: ['يَجِبُ', 'أَنْ', 'تَرْتَاحَ', 'وَتَشْرَبَ', 'الْكَثِيرَ', 'مِنَ', 'الْمَاءِ'],
      distractors: ['رُبَّمَا'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'رَأْسِي مُنْذُ الصَّبَاحِ.',
      english: 'My head has hurt since the morning.',
      options: ['تُؤْلِمُنِي', 'يُؤْلِمُنِي'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'خُذْ',
      after: 'وَاحِدَةً بَعْدَ الْأَكْلِ.',
      english: 'Take one tablet after eating.',
      options: ['حَبَّةً', 'دَوَاءً'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To say what hurts, Arabic says “my head hurts me”: the verb يُؤْلِمُ with ـنِي, then the body part with ـِي. The verb agrees with the body part: يُؤْلِمُنِي for a masculine word, تُؤْلِمُنِي for a feminine one.',
    },
    {
      type: 'table',
      head: ['Body part', 'Gender', 'What hurts'],
      rows: [
        ['رَأْسٌ', 'masculine', 'يُؤْلِمُنِي رَأْسِي'],
        ['ظَهْرٌ', 'masculine', 'يُؤْلِمُنِي ظَهْرِي'],
        ['مَعِدَةٌ', 'feminine', 'تُؤْلِمُنِي مَعِدَتِي'],
        ['يَدٌ', 'feminine', 'تُؤْلِمُنِي يَدِي'],
      ],
    },
    {
      type: 'p',
      text: 'For symptoms, use عِنْدِي, “I have”: عِنْدِي حَرَارَةٌ، عِنْدِي سُعَالٌ. Add مُنْذُ to say since when.',
    },
    {
      type: 'example',
      arabic: 'عِنْدِي زُكَامٌ مُنْذُ ثَلَاثَةِ أَيَّامٍ.',
      translit: 'ʿindī zukām mundhu thalāthat ayyām',
      english: 'I have had a cold for three days.',
    },
    {
      type: 'p',
      text: 'The doctor gives advice with يَجِبُ أَنْ and a verb ending in -a, as in the last lesson.',
    },
    {
      type: 'example',
      arabic: 'يَجِبُ أَنْ تَرْتَاحَ فِي الْبَيْتِ.',
      translit: 'yajib an tartāḥa fī l-bayt',
      english: 'You must rest at home.',
    },
  ],
  cultureTip: {
    title: 'Get well: سَلَامَتُكَ',
    body: 'When someone is ill, you say سَلَامَتُكَ (to a woman سَلَامَتُكِ), literally “your safety”, and the answer is اللَّهُ يُسَلِّمُكَ. Pharmacies in Cairo are everywhere, many stay open late, and the pharmacist is often the first person people ask about a small health problem.',
  },
};
