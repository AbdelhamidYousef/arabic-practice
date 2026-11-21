import type { ContentLesson } from '../types.ts';

// A1 L11: inviting and answering. Made-up for this app from the Classroom plan (curriculum/msa/a1.md,
// L11: C78; the row has no grammar spot, so this lesson teaches أَدْعُوكَ / تَعَالَ for a man and a
// woman and the ladder of polite answers); the owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a1-invitation',
  unit: 'A1.1',
  kind: 'lesson',
  title: 'Come to lunch on Friday',
  topic: 'Inviting someone and answering an invitation',
  summary: 'Invite someone, and say yes, maybe or not this time, politely.',
  goals: [
    'Invite a friend, a man or a woman',
    'Accept with pleasure or say maybe',
    'Say no politely and give a short reason',
  ],
  grammarFocus: 'Invitations: أَدْعُوكَ / تَعَالَ to a man, أَدْعُوكِ / تَعَالَيْ to a woman.',
  scenario:
    'You are Karim, the learner’s guide and new friend in Cairo. Invite them to lunch with your ' +
    'family at your home on Friday at noon. Answer their simple questions, react warmly if they say ' +
    'yes and kindly if they say maybe or no, and insist a little, the way hosts do. Use very short ' +
    'sentences and only words from the lesson. Reply only in Arabic with full harakat, ask one ' +
    'short question at a time, and never correct the learner yourself: a separate step does that.',
  openingLine: 'مَرْحَبًا يَا صَدِيقِي! أَدْعُوكَ إِلَى الْغَدَاءِ يَوْمَ الْجُمُعَةِ.',
  vocab: [
    {
      arabic: 'أَدْعُوكَ',
      translit: 'adʿūka',
      english: 'I invite you (a man)',
      note: 'To a woman: أَدْعُوكِ (adʿūki).',
    },
    {
      arabic: 'تَعَالَ',
      translit: 'taʿāla',
      english: 'come! (to a man)',
      note: 'To a woman: تَعَالَيْ (taʿālay).',
    },
    { arabic: 'إِلَى', translit: 'ilā', english: 'to' },
    { arabic: 'غَدَاءٌ', translit: 'ghadāʾ', english: 'lunch' },
    { arabic: 'عَشَاءٌ', translit: 'ʿashāʾ', english: 'dinner' },
    { arabic: 'يَوْمُ الْجُمُعَةِ', translit: 'yawm al-jumuʿa', english: 'Friday' },
    { arabic: 'يَوْمُ السَّبْتِ', translit: 'yawm as-sabt', english: 'Saturday' },
    { arabic: 'ظُهْرًا', translit: 'ẓuhran', english: 'at noon' },
    { arabic: 'عَائِلَةٌ', translit: 'ʿāʾila', english: 'family' },
    { arabic: 'بِكُلِّ سُرُورٍ', translit: 'bi-kulli surūr', english: 'with pleasure' },
    { arabic: 'طَبْعًا', translit: 'ṭabʿan', english: 'of course' },
    { arabic: 'رُبَّمَا', translit: 'rubbamā', english: 'maybe' },
    {
      arabic: 'مَشْغُولٌ',
      translit: 'mashghūl',
      english: 'busy (a man)',
      note: 'A woman: مَشْغُولَةٌ (mashghūla).',
    },
    {
      arabic: 'مَرَّةً أُخْرَى',
      translit: 'marratan ukhrā',
      english: 'another time, again',
      note: 'رُبَّمَا مَرَّةً أُخْرَى: maybe another time.',
    },
    {
      arabic: 'شُكْرًا عَلَى الدَّعْوَةِ',
      translit: 'shukran ʿalā d-daʿwa',
      english: 'thank you for the invitation',
    },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Which word means “lunch”?',
      options: ['عَشَاءٌ', 'غَدَاءٌ', 'عَائِلَةٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'You invite a woman to come. Which word do you use?',
      options: ['تَعَالَيْ', 'تَعَالَ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Accept the invitation warmly.',
      promptArabic: 'أَدْعُوكَ إِلَى الْغَدَاءِ.',
      options: ['لَا أَعْرِفُ', 'أَنَا مَشْغُولٌ', 'بِكُلِّ سُرُورٍ!'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the answer you hear.',
      audio: 'رُبَّمَا مَرَّةً أُخْرَى',
      options: ['بِكُلِّ سُرُورٍ', 'رُبَّمَا مَرَّةً أُخْرَى', 'طَبْعًا'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose when lunch is.',
      audio: 'يَوْمَ الْجُمُعَةِ ظُهْرًا',
      options: ['يَوْمَ الْجُمُعَةِ ظُهْرًا', 'يَوْمَ السَّبْتِ ظُهْرًا'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'غَدَاءٌ', english: 'lunch' },
        { arabic: 'عَشَاءٌ', english: 'dinner' },
        { arabic: 'رُبَّمَا', english: 'maybe' },
        { arabic: 'طَبْعًا', english: 'of course' },
        { arabic: 'عَائِلَةٌ', english: 'family' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the invitation (to a man).',
      english: 'Come to lunch on Friday!',
      words: ['تَعَالَ', 'إِلَى', 'الْغَدَاءِ', 'يَوْمَ', 'الْجُمُعَةِ'],
      distractors: ['تَعَالَيْ'],
    },
    {
      type: 'build',
      prompt: 'Build the answer (you are a woman).',
      english: 'Sorry, I am busy.',
      words: ['آسِفَةٌ', 'أَنَا', 'مَشْغُولَةٌ'],
      distractors: ['مَشْغُولٌ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'شُكْرًا',
      after: 'الدَّعْوَةِ.',
      english: 'Thank you for the invitation.',
      options: ['فِي', 'عَلَى', 'مِنْ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هَلْ أَنْتِ',
      after: '',
      english: 'Are you busy? (to a woman)',
      options: ['مَشْغُولٌ', 'مَشْغُولَةٌ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Karim adds “God willing” about Friday. Which phrase is it?',
      options: ['إِنْ شَاءَ اللَّهُ', 'الْحَمْدُ لِلَّهِ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To invite, say أَدْعُوكَ (adʿūka), “I invite you”, or simply تَعَالَ (taʿāla), “come!”. Both change when you speak to a woman.',
    },
    {
      type: 'table',
      head: ['Meaning', 'To a man', 'To a woman'],
      rows: [
        ['I invite you', 'أَدْعُوكَ', 'أَدْعُوكِ'],
        ['Come!', 'تَعَالَ', 'تَعَالَيْ'],
        ['Are you busy?', 'هَلْ أَنْتَ مَشْغُولٌ؟', 'هَلْ أَنْتِ مَشْغُولَةٌ؟'],
      ],
    },
    {
      type: 'example',
      arabic: 'أَدْعُوكِ إِلَى الْعَشَاءِ يَوْمَ السَّبْتِ',
      translit: 'adʿūki ilā l-ʿashāʾ yawm as-sabt',
      english: 'I invite you (a woman) to dinner on Saturday.',
    },
    {
      type: 'p',
      text: 'Answers go on a ladder from yes to no. بِكُلِّ سُرُورٍ (with pleasure) and طَبْعًا (of course) are a clear yes; رُبَّمَا (maybe) and إِنْ شَاءَ اللَّهُ leave it open; for a no, say sorry, give a short reason and thank them.',
    },
    {
      type: 'example',
      arabic: 'آسِفٌ، أَنَا مَشْغُولٌ. شُكْرًا عَلَى الدَّعْوَةِ',
      translit: 'āsif, anā mashghūl. shukran ʿalā d-daʿwa',
      english: 'Sorry, I’m busy. Thank you for the invitation.',
    },
    {
      type: 'example',
      arabic: 'رُبَّمَا مَرَّةً أُخْرَى',
      translit: 'rubbamā marratan ukhrā',
      english: 'Maybe another time.',
    },
  ],
  cultureTip: {
    title: 'Friday lunch',
    body: 'A long family lunch on Friday is a high point of the week in many Egyptian homes. If you are invited, bring something small, like sweets or fruit. A first “no” is often heard as politeness, so your host may insist: if you really can’t come, say so warmly and thank them.',
  },
};
