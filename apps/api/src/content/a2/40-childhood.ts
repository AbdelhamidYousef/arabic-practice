import type { ContentLesson } from '../types.ts';

// A2 L40: where you grew up, your childhood. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L40: C32, G37 continued, V28). The owner reviews the Arabic before real
// learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-childhood',
  unit: 'A2.2',
  kind: 'lesson',
  title: 'Where you grew up',
  topic: 'Childhood memories',
  summary: 'Say where you were born and grew up, and tell a few things about your childhood.',
  goals: [
    'Say where you were born and grew up',
    'Talk about your school, your neighbours and your childhood friends',
    'Use the past tense with longer verbs and with a subject',
  ],
  grammarFocus: 'More past tense: longer verbs (تَعَلَّمْتُ، انْتَقَلْنَا) and the verb before its subject.',
  scenario:
    'You are Layla, the learner’s kind older neighbour in Cairo. You grew up in a village near ' +
    'Mansoura in the Nile Delta and moved to Cairo for university. Ask where the learner was born ' +
    'and grew up, about their school and childhood friends, and share your own memories. Use the ' +
    'past tense in short A2 sentences with mostly words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَنَا وُلِدْتُ فِي قَرْيَةٍ صَغِيرَةٍ قُرْبَ الْمَنْصُورَةِ. وَأَنْتَ، أَيْنَ وُلِدْتَ؟',
  vocab: [
    {
      arabic: 'وُلِدَ',
      translit: 'wulida',
      english: 'he was born',
      note: 'وُلِدْتُ, “I was born”: learn it as a phrase.',
    },
    { arabic: 'كَبِرَ', translit: 'kabira', english: 'he grew up', note: 'Present: يَكْبَرُ.' },
    { arabic: 'طُفُولَةٌ', translit: 'ṭufūla', english: 'childhood' },
    { arabic: 'طِفْلٌ', translit: 'ṭifl', english: 'child', note: 'Plural أَطْفَالٌ.' },
    { arabic: 'قَرْيَةٌ', translit: 'qarya', english: 'village' },
    { arabic: 'جَارٌ', translit: 'jār', english: 'neighbour', note: 'Plural جِيرَانٌ.' },
    { arabic: 'سَكَنَ', translit: 'sakana', english: 'he lived', note: '“In” is فِي.' },
    { arabic: 'انْتَقَلَ', translit: 'intaqala', english: 'he moved', note: '“To” is إِلَى.' },
    { arabic: 'تَعَلَّمَ', translit: 'taʿallama', english: 'he learned' },
    { arabic: 'تَخَرَّجَ', translit: 'takharraja', english: 'he graduated' },
    { arabic: 'جَامِعَةٌ', translit: 'jāmiʿa', english: 'university' },
    { arabic: 'عَمِلَ', translit: 'ʿamila', english: 'he worked' },
    { arabic: 'سَافَرَ', translit: 'sāfara', english: 'he travelled' },
    { arabic: 'سَنَةٌ', translit: 'sana', english: 'year' },
    {
      arabic: 'الْمَدْرَسَةُ الِابْتِدَائِيَّةُ',
      translit: 'al-madrasa al-ibtidāʾiyya',
      english: 'primary school',
    },
    { arabic: 'ذِكْرَيَاتٌ', translit: 'dhikrayāt', english: 'memories' },
    { arabic: 'صَدِيقُ الطُّفُولَةِ', translit: 'ṣadīq aṭ-ṭufūla', english: 'childhood friend' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you say “I was born”?',
      options: ['وُلِدَتْ', 'وُلِدَ', 'وُلِدْتُ'],
      answer: 2,
    },
    {
      type: 'choose',
      prompt: 'Which word means “village”?',
      options: ['قَرْيَةٌ', 'جَامِعَةٌ', 'سَنَةٌ'],
      answer: 0,
    },
    {
      type: 'choose',
      prompt: 'Pick the correct sentence: “The family moved to Cairo.”',
      options: ['انْتَقَلَ الْعَائِلَةُ إِلَى الْقَاهِرَةِ', 'انْتَقَلَتِ الْعَائِلَةُ إِلَى الْقَاهِرَةِ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'كَبِرْتُ فِي قَرْيَةٍ صَغِيرَةٍ',
      options: ['كَبِرْتُ فِي مَدِينَةٍ كَبِيرَةٍ', 'كَبِرْتُ فِي قَرْيَةٍ صَغِيرَةٍ', 'سَكَنْتُ فِي قَرْيَةٍ صَغِيرَةٍ'],
      answer: 1,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the sentence you hear.',
      audio: 'تَخَرَّجَتْ مِنَ الْجَامِعَةِ',
      options: ['تَخَرَّجْتُ مِنَ الْجَامِعَةِ', 'عَمِلَتْ فِي الْجَامِعَةِ', 'تَخَرَّجَتْ مِنَ الْجَامِعَةِ'],
      answer: 2,
    },
    {
      type: 'match',
      prompt: 'Match each word with its meaning.',
      pairs: [
        { arabic: 'طِفْلٌ', english: 'child' },
        { arabic: 'جَارٌ', english: 'neighbour' },
        { arabic: 'قَرْيَةٌ', english: 'village' },
        { arabic: 'جَامِعَةٌ', english: 'university' },
        { arabic: 'ذِكْرَيَاتٌ', english: 'memories' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each verb with its meaning.',
      pairs: [
        { arabic: 'سَكَنَ', english: 'he lived' },
        { arabic: 'انْتَقَلَ', english: 'he moved' },
        { arabic: 'تَعَلَّمَ', english: 'he learned' },
        { arabic: 'سَافَرَ', english: 'he travelled' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'I was born in a village near Mansoura.',
      words: ['وُلِدْتُ', 'فِي', 'قَرْيَةٍ', 'قُرْبَ', 'الْمَنْصُورَةِ'],
      distractors: ['وُلِدَتْ'],
    },
    {
      type: 'build',
      prompt: 'Build the sentence.',
      english: 'In my childhood I learned to swim.',
      words: ['فِي', 'طُفُولَتِي', 'تَعَلَّمْتُ', 'السِّبَاحَةَ'],
      distractors: ['تَعَلَّمُوا'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: '',
      after: 'أَطْفَالُ الْقَرْيَةِ فِي الشَّارِعِ.',
      english: 'The village children played in the street.',
      options: ['لَعِبُوا', 'لَعِبَ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'أَنَا وَأَخِي',
      after: 'فِي نَفْسِ الْمَدْرَسَةِ.',
      english: 'My brother and I studied at the same school.',
      options: ['دَرَسْنَا', 'دَرَسُوا', 'دَرَسْتُ'],
      answer: 0,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'تَخَرَّجْتُ مِنَ الْجَامِعَةِ',
      after: '',
      english: 'I graduated from university last year.',
      options: ['السَّنَةَ الْمَاضِيَةَ', 'الشَّهْرَ الْقَادِمَ'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'Longer verbs take exactly the same past endings as ذَهَبَ: only the base is longer.',
    },
    {
      type: 'table',
      head: ['Verb', 'I', 'she', 'we', 'they'],
      rows: [
        ['تَعَلَّمَ, to learn', 'تَعَلَّمْتُ', 'تَعَلَّمَتْ', 'تَعَلَّمْنَا', 'تَعَلَّمُوا'],
        ['انْتَقَلَ, to move', 'انْتَقَلْتُ', 'انْتَقَلَتْ', 'انْتَقَلْنَا', 'انْتَقَلُوا'],
        ['سَافَرَ, to travel', 'سَافَرْتُ', 'سَافَرَتْ', 'سَافَرْنَا', 'سَافَرُوا'],
        ['كَبِرَ, to grow up', 'كَبِرْتُ', 'كَبِرَتْ', 'كَبِرْنَا', 'كَبِرُوا'],
      ],
    },
    {
      type: 'p',
      text: 'When the verb comes before its subject, it stays singular: masculine for a man or men, feminine for a woman, women or things. The ـَتْ of “she” becomes ـَتِ before الْ.',
    },
    {
      type: 'example',
      arabic: 'لَعِبَ الْأَطْفَالُ فِي الشَّارِعِ.',
      translit: 'laʿiba l-aṭfāl fī sh-shāriʿ',
      english: 'The children played in the street.',
    },
    {
      type: 'example',
      arabic: 'انْتَقَلَتِ الْعَائِلَةُ إِلَى الْقَاهِرَةِ.',
      translit: 'intaqalati l-ʿāʾila ilā l-qāhira',
      english: 'The family moved to Cairo.',
    },
    {
      type: 'p',
      text: 'وُلِدْتُ, “I was born”, takes the same endings: وُلِدْتَ، وُلِدَتْ، وُلِدْنَا. Learn it as a phrase for now.',
    },
  ],
  cultureTip: {
    title: 'Back to the village',
    body: 'Many Cairo families have their roots in a village in the Delta or in Upper Egypt, الصَّعِيدُ, and go back for holidays and family occasions. “Where is your family from?” is a common, friendly question, and a good way to hear someone’s childhood stories.',
  },
};
