import type { ContentLesson } from '../types.ts';

// A2 L42: tell what happened, a small problem. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L42: C34, G39, V30). The owner reviews the Arabic before real learners
// see it.
export const lesson: ContentLesson = {
  slug: 'a2-a-small-problem',
  unit: 'A2.2',
  kind: 'lesson',
  title: 'A small problem',
  topic: 'A lost phone',
  summary: 'Tell what went wrong, say what you did and did not do, and ask for help.',
  goals: [
    'Say that something got lost or was stolen',
    'Say what you did not do with لَمْ',
    'Explain what happened and ask for help',
  ],
  grammarFocus: '“Did not” with لَمْ and the jussive: لَمْ أَجِدْ هَاتِفِي.',
  scenario:
    'You are Hany, the learner’s helpful friend in Cairo. The learner has a small problem: they ' +
    'lost their phone, maybe in a taxi or at a café. Ask what happened, where and when, what they ' +
    'did and did not do, and help them decide what to do next, such as calling the phone or going ' +
    'to the police station. Use the past tense and لَمْ with the jussive in short A2 sentences ' +
    'with mostly words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'مَا بِكَ؟ تَبْدُو قَلِقًا. هَلْ عِنْدَكَ مُشْكِلَةٌ؟',
  vocab: [
    { arabic: 'مُشْكِلَةٌ', translit: 'mushkila', english: 'problem' },
    {
      arabic: 'ضَاعَ',
      translit: 'ḍāʿa',
      english: 'it got lost',
      note: 'ضَاعَ هَاتِفِي: my phone got lost.',
    },
    {
      arabic: 'سُرِقَ',
      translit: 'suriqa',
      english: 'it was stolen',
      note: 'سُرِقَتْ حَقِيبَتِي: my bag was stolen.',
    },
    { arabic: 'فَقَدَ', translit: 'faqada', english: 'he lost', note: 'Present: يَفْقِدُ.' },
    { arabic: 'وَجَدَ', translit: 'wajada', english: 'he found', note: 'Present: يَجِدُ.' },
    { arabic: 'يَتَذَكَّرُ', translit: 'yatadhakkar', english: 'to remember' },
    { arabic: 'هَاتِفٌ', translit: 'hātif', english: 'phone' },
    { arabic: 'مَحْفَظَةٌ', translit: 'maḥfaẓa', english: 'wallet' },
    { arabic: 'حَقِيبَةٌ', translit: 'ḥaqība', english: 'bag' },
    { arabic: 'بِطَاقَةٌ', translit: 'biṭāqa', english: 'card' },
    { arabic: 'مِفْتَاحٌ', translit: 'miftāḥ', english: 'key' },
    { arabic: 'قِسْمُ الشُّرْطَةِ', translit: 'qism ash-shurṭa', english: 'police station' },
    { arabic: 'فَجْأَةً', translit: 'fajʾatan', english: 'suddenly' },
    { arabic: 'لِلْأَسَفِ', translit: 'lil-asaf', english: 'unfortunately' },
    { arabic: 'لَمْ', translit: 'lam', english: 'did not', note: 'Followed by the jussive.' },
    { arabic: 'قَلِقٌ', translit: 'qaliq', english: 'worried' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “I didn’t find it”?',
      options: ['وَجَدْتُهُ', 'لَمْ أَجِدْهُ', 'لَا أَجِدُهُ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'Pick the correct sentence: “I didn’t go.”',
      options: ['لَمْ ذَهَبْتُ', 'لَمْ أَذْهَبُ', 'لَمْ أَذْهَبْ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Your wallet was stolen. Where do you go?',
      options: ['إِلَى قِسْمِ الشُّرْطَةِ', 'إِلَى الْجَامِعَةِ', 'إِلَى الْمُتْحَفِ'],
      answer: 0,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'ضَاعَ هَاتِفِي',
      options: ['سُرِقَ هَاتِفِي', 'ضَاعَ هَاتِفِي', 'وَجَدْتُ هَاتِفِي'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'لَمْ أَتَذَكَّرْ',
      options: ['لَمْ أَتَذَكَّرْ', 'لَمْ أَجِدْ', 'لَمْ أَفْقِدْ'],
      answer: 0,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'مَحْفَظَةٌ', english: 'wallet' },
        { arabic: 'حَقِيبَةٌ', english: 'bag' },
        { arabic: 'بِطَاقَةٌ', english: 'card' },
        { arabic: 'مِفْتَاحٌ', english: 'key' },
        { arabic: 'هَاتِفٌ', english: 'phone' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'ضَاعَ', english: 'it got lost' },
        { arabic: 'سُرِقَ', english: 'it was stolen' },
        { arabic: 'وَجَدَ', english: 'he found' },
        { arabic: 'فَجْأَةً', english: 'suddenly' },
        { arabic: 'لِلْأَسَفِ', english: 'unfortunately' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I didn’t find the key.',
      words: ['لَمْ', 'أَجِدِ', 'الْمِفْتَاحَ'],
      distractors: ['وَجَدْتُ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'Suddenly my bag was stolen in the metro.',
      words: ['فَجْأَةً', 'سُرِقَتْ', 'حَقِيبَتِي', 'فِي', 'الْمِتْرُو'],
      distractors: ['سُرِقَ'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'بَحَثْتُ فِي كُلِّ مَكَانٍ، وَلٰكِنْ لَمْ',
      after: 'الْمَحْفَظَةَ.',
      english: 'I looked everywhere, but I didn’t find the wallet.',
      options: ['أَجِدِ', 'وَجَدْتُ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'هِيَ لَمْ',
      after: 'إِلَى الْعَمَلِ أَمْسِ.',
      english: 'She didn’t go to work yesterday.',
      options: ['تَذْهَبْ', 'ذَهَبَتْ', 'تَذْهَبُ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'لِلْأَسَفِ،',
      after: 'هَاتِفِي فِي سَيَّارَةِ الْأُجْرَةِ.',
      english: 'Unfortunately, I lost my phone in the taxi.',
      options: ['وَجَدْتُ', 'فَقَدْتُ'],
      answer: 1,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To say “did not”, Arabic does not use the past tense. It uses لَمْ with the present verb in the jussive: the last vowel -u becomes a sukun.',
    },
    {
      type: 'table',
      head: ['Present', 'After لَمْ', 'Meaning'],
      rows: [
        ['أَذْهَبُ', 'لَمْ أَذْهَبْ', 'I didn’t go'],
        ['تَجِدُ', 'لَمْ تَجِدْ', 'you didn’t find'],
        ['يَتَذَكَّرُ', 'لَمْ يَتَذَكَّرْ', 'he didn’t remember'],
        ['تَفْقِدِينَ', 'لَمْ تَفْقِدِي', 'you (f) didn’t lose'],
        ['يَبْحَثُونَ', 'لَمْ يَبْحَثُوا', 'they didn’t look'],
      ],
    },
    {
      type: 'p',
      text: 'Forms that end in ـِينَ or ـُونَ drop the نَ, just as after أَنْ. Before الْ, the sukun becomes a kasra so the words link: لَمْ أَجِدِ الْمِفْتَاحَ.',
    },
    {
      type: 'example',
      arabic: 'ذَهَبْتُ إِلَى الْعَمَلِ.',
      translit: 'dhahabtu ilā l-ʿamal',
      english: 'I went to work.',
    },
    {
      type: 'example',
      arabic: 'لَمْ أَذْهَبْ إِلَى الْعَمَلِ أَمْسِ.',
      translit: 'lam adhhab ilā l-ʿamal ams',
      english: 'I didn’t go to work yesterday.',
    },
    {
      type: 'example',
      arabic: 'بَحَثْنَا عَنِ الْمَحْفَظَةِ، وَلٰكِنْ لَمْ نَجِدْهَا.',
      translit: 'baḥathnā ʿani l-maḥfaẓa, wa-lākin lam najidhā',
      english: 'We looked for the wallet, but we didn’t find it.',
    },
  ],
  cultureTip: {
    title: 'If you lose something',
    body: 'If something is lost or stolen in Cairo, report it at the nearest قِسْمُ الشُّرْطَةِ, police station, and take your passport or ID. If you lost it on a ride booked in an app, the app keeps the trip and lets you contact the driver, which is often the quickest way to get it back.',
  },
};
