import type { ContentLesson } from '../types.ts';

// A2 L56: Ramadan and holidays, invitations and plans. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L56: C46, K16). The plan has no grammar item for this lesson, so the note
// covers inviting and answering an invitation. The owner reviews the Arabic before real learners
// see it.
export const lesson: ContentLesson = {
  slug: 'a2-ramadan',
  unit: 'A2.3',
  kind: 'lesson',
  title: 'Ramadan and holidays',
  topic: 'An iftar invitation',
  summary:
    'Invite someone to iftar, accept or decline an invitation politely, and talk about Ramadan.',
  goals: [
    'Invite someone with أَوَدُّ أَنْ أَدْعُوَكَ',
    'Accept an invitation, or decline it politely',
    'Talk about iftar, suhoor and Ramadan nights',
  ],
  grammarFocus: 'Inviting: أَوَدُّ أَنْ / هَلْ تُحِبُّ أَنْ + the subjunctive; answering with بِكُلِّ سُرُورٍ or لِلْأَسَفِ.',
  scenario:
    'You are Umm Youssef, the learner’s kind neighbour in Cairo. It is the first week of Ramadan. ' +
    'Invite them to iftar at your home on Thursday, explain that you break the fast at the sunset ' +
    'call to prayer, what you will eat, and that the whole family will be there. Answer their ' +
    'questions and let them accept, or decline politely and suggest another day. Use أَوَدُّ أَنْ ' +
    'أَدْعُوَكَ، هَلْ تُحِبُّ أَنْ…؟ and the future with سَـ. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'رَمَضَانُ كَرِيمٌ يَا جَارِي! أَوَدُّ أَنْ أَدْعُوَكَ إِلَى الْإِفْطَارِ عِنْدَنَا يَوْمَ الْخَمِيسِ.',
  vocab: [
    { arabic: 'رَمَضَانُ', translit: 'ramaḍān', english: 'Ramadan' },
    {
      arabic: 'صَامَ',
      translit: 'ṣāma',
      english: 'he fasted',
      note: 'Present: يَصُومُ (yaṣūmu). I fasted: صُمْتُ.',
    },
    { arabic: 'صِيَامٌ', translit: 'ṣiyām', english: 'fasting' },
    { arabic: 'إِفْطَارٌ', translit: 'ifṭār', english: 'iftar, the meal at sunset' },
    { arabic: 'سُحُورٌ', translit: 'suḥūr', english: 'suhoor, the meal before dawn' },
    {
      arabic: 'أَذَانُ الْمَغْرِبِ',
      translit: 'adhān al-maghrib',
      english: 'the sunset call to prayer',
    },
    { arabic: 'فَانُوسٌ', translit: 'fānūs', english: 'lantern', note: 'Plural: فَوَانِيسُ.' },
    { arabic: 'مِدْفَعٌ', translit: 'midfaʿ', english: 'cannon' },
    { arabic: 'دَعْوَةٌ', translit: 'daʿwa', english: 'invitation' },
    { arabic: 'تَمْرٌ', translit: 'tamr', english: 'dates (the fruit)' },
    { arabic: 'عَصِيرٌ', translit: 'ʿaṣīr', english: 'juice' },
    {
      arabic: 'قَطَائِفُ',
      translit: 'qaṭāʾif',
      english: 'qatayef',
      note: 'Small folded pancakes with nuts or cream, made in Ramadan.',
    },
    { arabic: 'مَائِدَةٌ', translit: 'māʾida', english: 'a laid table' },
    { arabic: 'جِيرَانٌ', translit: 'jīrān', english: 'neighbours', note: 'One neighbour: جَارٌ.' },
    {
      arabic: 'رَمَضَانُ كَرِيمٌ',
      translit: 'ramaḍān karīm',
      english: 'Ramadan greetings',
      note: 'The usual greeting during the month.',
    },
    {
      arabic: 'اللَّهُ أَكْرَمُ',
      translit: 'allāhu akram',
      english: 'God is more generous (the reply)',
    },
    { arabic: 'بِكُلِّ سُرُورٍ', translit: 'bi-kulli surūr', english: 'with pleasure' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'Your neighbour says this. What do you answer?',
      promptArabic: 'رَمَضَانُ كَرِيمٌ!',
      options: ['عِيدٌ مُبَارَكٌ!', 'اللَّهُ أَكْرَمُ!', 'أَلْفُ مَبْرُوكٍ!'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'What is the meal before dawn called?',
      options: ['الْإِفْطَارُ', 'الْغَدَاءُ', 'السُّحُورُ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Pick a polite way to say yes.',
      promptArabic: 'هَلْ تُحِبُّ أَنْ تُفْطِرَ عِنْدَنَا يَوْمَ الْجُمُعَةِ؟',
      options: ['بِكُلِّ سُرُورٍ، شُكْرًا!', 'لِلْأَسَفِ، أَنَا مَشْغُولٌ.', 'أَفْطَرْتُ أَمْسِ.'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'نُفْطِرُ عَلَى التَّمْرِ',
      options: ['نَتَسَحَّرُ عَلَى التَّمْرِ', 'نُفْطِرُ عَلَى التَّمْرِ', 'نُفْطِرُ عَلَى الْعَصِيرِ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'سَمِعْنَا الْمِدْفَعَ',
      options: ['سَمِعْنَا الْأَذَانَ', 'رَأَيْنَا الْفَانُوسَ', 'سَمِعْنَا الْمِدْفَعَ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'فَانُوسٌ', english: 'lantern' },
        { arabic: 'مِدْفَعٌ', english: 'cannon' },
        { arabic: 'تَمْرٌ', english: 'dates' },
        { arabic: 'جِيرَانٌ', english: 'neighbours' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'صِيَامٌ', english: 'fasting' },
        { arabic: 'دَعْوَةٌ', english: 'invitation' },
        { arabic: 'إِفْطَارٌ', english: 'the meal at sunset' },
        { arabic: 'سُحُورٌ', english: 'the meal before dawn' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'We break the fast at the sunset call to prayer.',
      words: ['نُفْطِرُ', 'عِنْدَ', 'أَذَانِ', 'الْمَغْرِبِ'],
      distractors: ['السُّحُورِ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I would like to invite you to iftar.',
      words: ['أَوَدُّ', 'أَنْ', 'أَدْعُوَكَ', 'إِلَى', 'الْإِفْطَارِ'],
      distractors: ['أَدْعُوكَ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'يَصُومُ النَّاسُ فِي',
      after: 'مِنَ الْفَجْرِ إِلَى الْمَغْرِبِ.',
      english: 'In Ramadan people fast from dawn to sunset.',
      options: ['الْعِيدِ', 'رَمَضَانَ', 'الصَّيْفِ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'سَآتِي بِكُلِّ سُرُورٍ، شُكْرًا عَلَى',
      after: '',
      english: 'I will come with pleasure, thank you for the invitation.',
      options: ['الدَّعْوَةِ', 'الْمِدْفَعِ', 'الصِّيَامِ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'فِي رَمَضَانَ',
      after: 'الْأَطْفَالُ بِالْفَوَانِيسِ فِي الشَّوَارِعِ.',
      english: 'In Ramadan children play with lanterns in the streets.',
      options: ['يَصُومُ', 'يَدْعُو', 'يَلْعَبُ'],
      answer: 2,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To invite someone politely, use أَوَدُّ أَنْ (I would like to) or هَلْ تُحِبُّ أَنْ (would you like to). The verb after أَنْ is in the subjunctive, as you saw in lesson 48.',
    },
    {
      type: 'example',
      arabic: 'أَوَدُّ أَنْ أَدْعُوَكَ إِلَى الْإِفْطَارِ.',
      translit: 'awaddu an adʿuwaka ilā l-ifṭār.',
      english: 'I would like to invite you to iftar.',
    },
    {
      type: 'example',
      arabic: 'هَلْ تُحِبِّينَ أَنْ تَتَسَحَّرِي مَعَنَا؟',
      translit: 'hal tuḥibbīna an tatasaḥḥarī maʿanā?',
      english: 'Would you (a woman) like to have suhoor with us?',
    },
    {
      type: 'table',
      head: ['Said by', 'Yes', 'No, politely'],
      rows: [
        ['a man', 'بِكُلِّ سُرُورٍ!', 'شُكْرًا، لَكِنِّي مَشْغُولٌ.'],
        ['a woman', 'بِكُلِّ سُرُورٍ!', 'شُكْرًا، لَكِنِّي مَشْغُولَةٌ.'],
      ],
    },
    {
      type: 'p',
      text: 'When you decline, suggest another time with the future: سَأَزُورُكُمْ بَعْدَ الْعِيدِ، إِنْ شَاءَ اللَّهُ (I will visit you after Eid, God willing).',
    },
  ],
  cultureTip: {
    title: 'Iftar, the cannon and the lanterns',
    body: 'In Ramadan, Muslims fast from dawn to sunset. In Cairo the fast ends with the sunset call to prayer, and the boom of the iftar cannon, مِدْفَعُ الْإِفْطَارِ, still marks the moment on television and radio. Streets and balconies fill with colourful lanterns, and families and neighbours invite each other to iftar, which often starts with dates and a drink. Long tables in the street offer a free iftar to anyone passing by. If you are invited, bring something sweet, such as qatayef or kunafa.',
  },
};
