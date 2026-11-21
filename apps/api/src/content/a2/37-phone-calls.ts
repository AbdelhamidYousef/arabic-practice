import type { ContentLesson } from '../types.ts';

// A2 L37: phone calls, ask for someone, leave a message. Made-up for this app from the Classroom
// plan (curriculum/msa/a2.md, L37: C29, G73, V25). The owner reviews the Arabic before real
// learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-phone-calls',
  unit: 'A2.1',
  kind: 'lesson',
  title: 'Phone calls and messages',
  topic: 'Calling the landlord',
  summary: 'Ask for someone on the phone, leave a message, and say what you can, must or might do.',
  goals: [
    'Start a phone call and ask for someone',
    'Leave or take a short message',
    'Say “I can”, “I must” and “maybe” with أَنْ and a verb',
  ],
  grammarFocus: 'Can, must, maybe + أَنْ: أَسْتَطِيعُ أَنْ، يَجِبُ أَنْ، يُمْكِنُ أَنْ.',
  scenario:
    'You are Mrs Amal, the landlord’s wife, answering the landlord’s phone at home in Cairo. The ' +
    'learner calls to speak to the landlord, Mr Fathy, who is out. Ask who is calling, say he is ' +
    'not in, take a message and say when he can call back. Use يُمْكِنُ أَنْ، يَجِبُ أَنْ، ' +
    'أَسْتَطِيعُ أَنْ and رُبَّمَا in short A2 sentences with mostly words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَلُو، مَسَاءُ الْخَيْرِ. مَنْ يَتَكَلَّمُ، مِنْ فَضْلِكَ؟',
  vocab: [
    { arabic: 'هَاتِفٌ', translit: 'hātif', english: 'telephone' },
    { arabic: 'رَقْمٌ', translit: 'raqm', english: 'number' },
    { arabic: 'اتِّصَالٌ', translit: 'ittiṣāl', english: 'call' },
    {
      arabic: 'يَتَّصِلُ',
      translit: 'yattaṣil',
      english: 'to call (someone)',
      note: 'With بِـ: أَتَّصِلُ بِكَ, “I call you”.',
    },
    { arabic: 'رِسَالَةٌ', translit: 'risāla', english: 'message' },
    { arabic: 'يَتْرُكُ', translit: 'yatruk', english: 'to leave' },
    { arabic: 'يَرُدُّ عَلَى', translit: 'yarudd ʿalā', english: 'to answer, to reply to' },
    { arabic: 'أَلُو', translit: 'alū', english: 'hello (on the phone)' },
    { arabic: 'مَنْ يَتَكَلَّمُ', translit: 'man yatakallam', english: 'who is speaking?' },
    { arabic: 'لَحْظَةً', translit: 'laḥẓatan', english: 'one moment' },
    { arabic: 'مَشْغُولٌ', translit: 'mashghūl', english: 'busy (a person or a line)' },
    {
      arabic: 'مَوْجُودٌ',
      translit: 'mawjūd',
      english: 'here, in',
      note: 'غَيْرُ مَوْجُودٍ: not in, not here.',
    },
    { arabic: 'لَاحِقًا', translit: 'lāḥiqan', english: 'later' },
    {
      arabic: 'يَسْتَطِيعُ',
      translit: 'yastaṭīʿ',
      english: 'can, to be able to',
      note: 'أَسْتَطِيعُ أَنْ: I can.',
    },
    { arabic: 'يَجِبُ أَنْ', translit: 'yajib an', english: 'must, have to' },
    { arabic: 'يُمْكِنُ أَنْ', translit: 'yumkin an', english: 'it is possible to, can' },
    { arabic: 'رُبَّمَا', translit: 'rubbamā', english: 'maybe' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'You answer the phone. What do you say first?',
      options: ['لَاحِقًا', 'أَلُو', 'رُبَّمَا'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'The person you want is not in. What can you ask?',
      options: ['هَلْ يُمْكِنُ أَنْ أَطْبُخَ؟', 'هَلْ هٰذَا رَقْمُكَ الْقَدِيمُ؟', 'هَلْ يُمْكِنُ أَنْ أَتْرُكَ رِسَالَةً؟'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which sentence means “I must go now”?',
      options: ['يَجِبُ أَنْ أَذْهَبَ الْآنَ', 'أَسْتَطِيعُ أَنْ أَذْهَبَ الْآنَ', 'رُبَّمَا أَذْهَبُ الْآنَ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the question you hear.',
      audio: 'مَنْ يَتَكَلَّمُ',
      options: ['مَا رَقْمُكَ', 'هُوَ مَشْغُولٌ', 'مَنْ يَتَكَلَّمُ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'هُوَ غَيْرُ مَوْجُودٍ الْآنَ',
      options: ['هُوَ مَوْجُودٌ الْآنَ', 'هُوَ غَيْرُ مَوْجُودٍ الْآنَ', 'هُوَ مَشْغُولٌ الْآنَ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'هَاتِفٌ', english: 'telephone' },
        { arabic: 'رَقْمٌ', english: 'number' },
        { arabic: 'رِسَالَةٌ', english: 'message' },
        { arabic: 'اتِّصَالٌ', english: 'call' },
        { arabic: 'لَاحِقًا', english: 'later' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each phrase with its meaning.',
      pairs: [
        { arabic: 'أَسْتَطِيعُ أَنْ', english: 'I can' },
        { arabic: 'يَجِبُ أَنْ', english: 'must' },
        { arabic: 'يُمْكِنُ أَنْ', english: 'it is possible to' },
        { arabic: 'رُبَّمَا', english: 'maybe' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the question.',
      english: 'Can I speak to Mr Fathy?',
      words: ['هَلْ', 'يُمْكِنُ', 'أَنْ', 'أَتَكَلَّمَ', 'مَعَ', 'الْأُسْتَاذِ', 'فَتْحِي'],
      distractors: ['يَجِبُ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I must call him later.',
      words: ['يَجِبُ', 'أَنْ', 'أَتَّصِلَ', 'بِهِ', 'لَاحِقًا'],
      distractors: ['رُبَّمَا'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'لَا',
      after: 'أَنْ أَرُدَّ الْآنَ، أَنَا فِي اجْتِمَاعٍ.',
      english: 'I can’t answer now, I’m in a meeting.',
      options: ['أَسْتَطِيعُ', 'يَجِبُ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'يُمْكِنُكَ أَنْ',
      after: 'رِسَالَةً.',
      english: 'You can leave a message.',
      options: ['تَرُدَّ', 'تَتْرُكَ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To say what you can, must or might do, use one of these phrases, then أَنْ and a present verb. After أَنْ the verb ends in -a instead of -u: أَذْهَبُ becomes أَنْ أَذْهَبَ.',
    },
    {
      type: 'table',
      head: ['Phrase', 'Meaning', 'Example'],
      rows: [
        ['أَسْتَطِيعُ أَنْ', 'I can', 'أَسْتَطِيعُ أَنْ أَتَّصِلَ بِكَ.'],
        ['يَجِبُ أَنْ', 'must, have to', 'يَجِبُ أَنْ أَذْهَبَ.'],
        ['يُمْكِنُ أَنْ', 'it is possible to, can', 'يُمْكِنُ أَنْ تَتْرُكَ رِسَالَةً.'],
        ['رُبَّمَا', 'maybe', 'رُبَّمَا هُوَ مَشْغُولٌ.'],
      ],
    },
    {
      type: 'p',
      text: 'أَسْتَطِيعُ changes with the person (تَسْتَطِيعُ، يَسْتَطِيعُ، نَسْتَطِيعُ). يَجِبُ and يُمْكِنُ never change; the second verb shows who: يَجِبُ أَنْ تَذْهَبَ, “you must go”. With a pronoun, يُمْكِنُكَ means “you can”. رُبَّمَا takes a normal sentence, with no أَنْ.',
    },
    {
      type: 'example',
      arabic: 'هَلْ يُمْكِنُ أَنْ أَتَكَلَّمَ مَعَ الْأُسْتَاذِ فَتْحِي؟',
      translit: 'hal yumkin an atakallama maʿa l-ustādh fatḥī',
      english: 'Can I speak to Mr Fathy?',
    },
    {
      type: 'example',
      arabic: 'لَا أَسْتَطِيعُ أَنْ أَرُدَّ الْآنَ.',
      translit: 'lā astaṭīʿ an arudda l-ān',
      english: 'I can’t answer now.',
    },
    {
      type: 'p',
      text: 'A verb that ends in ـِينَ or ـُونَ drops its نَ after أَنْ: يَجِبُ أَنْ تَتَّصِلِي بِهِ, “you must call him” (to a woman); يَجِبُ أَنْ يَذْهَبُوا, “they must go”.',
    },
  ],
  cultureTip: {
    title: 'Calling or messaging?',
    body: 'Many people answer the phone with أَلُو, and a business may answer with السَّلَامُ عَلَيْكُمْ or its name. Short voice and text messages are very common in Egypt: if you call someone you do not know well and they do not answer, a short polite message saying who you are is welcome.',
  },
};
