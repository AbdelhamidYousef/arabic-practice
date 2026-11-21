import type { ContentLesson } from '../types.ts';

// A1 L29: invite, accept, refuse politely. Made-up for this app from the Classroom plan
// (curriculum/msa/a1.md, L29: C22, G27, G70); the owner reviews the Arabic before real learners
// see it.
export const lesson: ContentLesson = {
  slug: 'a1-invitations',
  unit: 'A1.3',
  kind: 'lesson',
  title: 'Invitations',
  topic: 'Dinner at a colleague’s family home',
  summary:
    'Invite someone, accept with pleasure or say no politely, and point at things near and far.',
  goals: [
    'Accept an invitation with pleasure',
    'Refuse politely and suggest another time',
    'Say “that”, “these” and “those”, and describe things in the plural',
  ],
  grammarFocus: 'Plural things take “she”: هٰذِهِ الْهَدَايَا جَمِيلَةٌ; and ذٰلِكَ، تِلْكَ، هٰؤُلَاءِ، أُولٰئِكَ.',
  scenario:
    'You are Rami, a colleague of the learner in Cairo. Invite them to dinner at your family’s ' +
    'home on Thursday evening. If they accept, say who will be there and thank them; if they ' +
    'say no, insist kindly once, then accept their answer and suggest another time. ' +
    'Use very short sentences and only words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'مَسَاءُ الْخَيْرِ! عِنْدِي دَعْوَةٌ لَكَ: عَشَاءٌ فِي بَيْتِنَا يَوْمَ الْخَمِيسِ. هَلْ أَنْتَ مَشْغُولٌ؟',
  vocab: [
    { arabic: 'دَعْوَةٌ', translit: 'daʿwa', english: 'invitation' },
    { arabic: 'عَشَاءٌ', translit: 'ʿashāʾ', english: 'dinner' },
    { arabic: 'حَفْلَةٌ', translit: 'ḥafla', english: 'party' },
    {
      arabic: 'هَدِيَّةٌ',
      translit: 'hadiyya',
      english: 'gift, present',
      note: 'Plural: هَدَايَا.',
    },
    {
      arabic: 'ضَيْفٌ',
      translit: 'ḍayf',
      english: 'guest',
      note: 'Plural: ضُيُوفٌ.',
    },
    { arabic: 'تَعَالَ', translit: 'taʿāla', english: 'come! (to a man)' },
    { arabic: 'بِكُلِّ سُرُورٍ', translit: 'bi-kulli surūr', english: 'with pleasure' },
    {
      arabic: 'شُكْرًا عَلَى الدَّعْوَةِ',
      translit: 'shukran ʿala d-daʿwa',
      english: 'thank you for the invitation',
    },
    { arabic: 'لِلْأَسَفِ', translit: 'lil-asaf', english: 'unfortunately, I’m sorry' },
    { arabic: 'مَشْغُولٌ', translit: 'mashghūl', english: 'busy' },
    { arabic: 'مَرَّةً أُخْرَى', translit: 'marratan ukhrā', english: 'another time' },
    {
      arabic: 'إِنْ شَاءَ اللَّهُ',
      translit: 'in shāʾa llāh',
      english: 'God willing; I hope so',
    },
    { arabic: 'ذٰلِكَ', translit: 'dhālika', english: 'that (m)' },
    { arabic: 'تِلْكَ', translit: 'tilka', english: 'that (f)' },
    { arabic: 'هٰؤُلَاءِ', translit: 'hāʾulāʾ', english: 'these (people)' },
    { arabic: 'أُولٰئِكَ', translit: 'ulāʾika', english: 'those (people)' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'You are free and happy to come. What do you say?',
      options: ['لِلْأَسَفِ، أَنَا مَشْغُولٌ', 'بِكُلِّ سُرُورٍ', 'مَرَّةً أُخْرَى'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick the correct sentence: “These houses are big.”',
      options: ['هٰذَا الْبُيُوتُ كَبِيرٌ', 'هٰؤُلَاءِ الْبُيُوتُ كِبَارٌ', 'هٰذِهِ الْبُيُوتُ كَبِيرَةٌ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which word means “that” with a feminine noun?',
      options: ['تِلْكَ', 'ذٰلِكَ', 'هٰذِهِ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'شُكْرًا عَلَى الدَّعْوَةِ',
      options: ['شُكْرًا عَلَى الْعَشَاءِ', 'شُكْرًا عَلَى الدَّعْوَةِ', 'شُكْرًا عَلَى الْهَدِيَّةِ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'أُولٰئِكَ',
      options: ['هٰؤُلَاءِ', 'ذٰلِكَ', 'أُولٰئِكَ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'دَعْوَةٌ', english: 'invitation' },
        { arabic: 'عَشَاءٌ', english: 'dinner' },
        { arabic: 'حَفْلَةٌ', english: 'party' },
        { arabic: 'هَدِيَّةٌ', english: 'gift' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'هٰذَا', english: 'this (m)' },
        { arabic: 'ذٰلِكَ', english: 'that (m)' },
        { arabic: 'هٰؤُلَاءِ', english: 'these (people)' },
        { arabic: 'أُولٰئِكَ', english: 'those (people)' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Unfortunately, I am busy on Thursday.',
      words: ['لِلْأَسَفِ', 'أَنَا', 'مَشْغُولٌ', 'يَوْمَ', 'الْخَمِيسِ'],
      distractors: ['بِكُلِّ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Those guests are from Alexandria.',
      words: ['أُولٰئِكَ', 'الضُّيُوفُ', 'مِنَ', 'الْإِسْكَنْدَرِيَّةِ'],
      distractors: ['تِلْكَ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'These gifts are beautiful.',
      words: ['هٰذِهِ', 'الْهَدَايَا', 'جَمِيلَةٌ'],
      distractors: ['جَمِيلُونَ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'تِلْكَ',
      after: 'جَدِيدَةٌ.',
      english: 'That car is new.',
      options: ['السَّيَّارَةُ', 'الْمَطْعَمُ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'الْكُتُبُ',
      after: '',
      english: 'The books are new.',
      options: ['جَدِيدٌ', 'جَدِيدَةٌ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'The plural of a thing (not a person) is treated as “she”: its describing word takes ـَةٌ, and “these” is هٰذِهِ.',
    },
    {
      type: 'example',
      arabic: 'هٰذِهِ الْكُتُبُ جَدِيدَةٌ.',
      translit: 'hādhihi l-kutubu jadīda',
      english: 'These books are new.',
    },
    {
      type: 'example',
      arabic: 'الْهَدَايَا جَمِيلَةٌ.',
      translit: 'al-hadāyā jamīla',
      english: 'The gifts are beautiful.',
    },
    {
      type: 'p',
      text: 'For something far away, use “that” and “those”. هٰؤُلَاءِ and أُولٰئِكَ are for people only; for plural things, use هٰذِهِ and تِلْكَ.',
    },
    {
      type: 'table',
      head: ['', 'Near', 'Far'],
      rows: [
        ['masculine', 'هٰذَا (this)', 'ذٰلِكَ (that)'],
        ['feminine, and plural things', 'هٰذِهِ (this, these)', 'تِلْكَ (that, those)'],
        ['plural people', 'هٰؤُلَاءِ (these)', 'أُولٰئِكَ (those)'],
      ],
    },
    {
      type: 'example',
      arabic: 'أُولٰئِكَ الضُّيُوفُ مِنْ لُبْنَانَ.',
      translit: 'ulāʾika ḍ-ḍuyūfu min lubnān',
      english: 'Those guests are from Lebanon.',
    },
  ],
  cultureTip: {
    title: 'Saying yes, saying no',
    body: 'Hosts in Egypt insist, and a first “no” is often heard as politeness, so you may be asked again. To really say no, thank them warmly, give a short reason and add مَرَّةً أُخْرَى، إِنْ شَاءَ اللَّهُ. If you go, bring something small, such as sweets or fruit, and expect far more food than you can eat.',
  },
};
