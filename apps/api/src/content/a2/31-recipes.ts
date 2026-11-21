import type { ContentLesson } from '../types.ts';

// A2 L31: food, recipes and tastes. Made-up for this app from the Classroom plan
// (curriculum/msa/a2.md, L31: C28, G30, V24, K23; the sound and reading items S16, S17, R15, R16
// are left out). The owner reviews the Arabic before real learners see it.
export const lesson: ContentLesson = {
  slug: 'a2-recipes',
  unit: 'A2.1',
  kind: 'lesson',
  title: 'Cooking: recipes and tastes',
  topic: 'Cooking a dish with a neighbour',
  summary: 'Follow and give simple cooking steps, and say how food tastes.',
  goals: [
    'Give cooking instructions to a man, a woman or a group',
    'Name common ingredients and kitchen things',
    'Say if food is sweet, salty, sour or delicious',
  ],
  grammarFocus: 'The imperative for a man, a woman and a group: اُطْبُخْ، اُطْبُخِي، اُطْبُخُوا.',
  scenario:
    'You are Hoda, the learner’s friendly neighbour in Cairo, teaching them to cook molokhia in her ' +
    'kitchen. Give one cooking step at a time with the imperative (masculine; switch to the ' +
    'feminine if the learner is a woman), name the ingredients, and ask how things taste. ' +
    'Use short A2 sentences with mostly words from the lesson. ' +
    'Reply only in Arabic with full harakat, ask one short question at a time, and never correct ' +
    'the learner yourself: a separate step does that.',
  openingLine: 'أَهْلًا يَا جَارِي! الْيَوْمَ نَطْبُخُ الْمُلُوخِيَّةَ مَعًا. هَلْ تُحِبُّ الطَّبْخَ؟',
  vocab: [
    { arabic: 'وَصْفَةٌ', translit: 'waṣfa', english: 'recipe' },
    {
      arabic: 'يَطْبُخُ',
      translit: 'yaṭbukh',
      english: 'to cook (he cooks)',
      note: 'Imperative: اُطْبُخْ.',
    },
    { arabic: 'يَغْسِلُ', translit: 'yaghsil', english: 'to wash', note: 'Imperative: اِغْسِلْ.' },
    { arabic: 'يَقْطَعُ', translit: 'yaqṭaʿ', english: 'to cut', note: 'Imperative: اِقْطَعْ.' },
    {
      arabic: 'يَضَعُ',
      translit: 'yaḍaʿ',
      english: 'to put',
      note: 'Imperative: ضَعْ, with no helping vowel.',
    },
    {
      arabic: 'يُضِيفُ',
      translit: 'yuḍīf',
      english: 'to add',
      note: 'Imperative: أَضِفْ، أَضِيفِي، أَضِيفُوا.',
    },
    { arabic: 'قِدْرٌ', translit: 'qidr', english: 'cooking pot' },
    { arabic: 'مِلْعَقَةٌ', translit: 'milʿaqa', english: 'spoon' },
    { arabic: 'مِلْحٌ', translit: 'milḥ', english: 'salt' },
    { arabic: 'زَيْتٌ', translit: 'zayt', english: 'oil' },
    { arabic: 'بَصَلٌ', translit: 'baṣal', english: 'onions' },
    { arabic: 'ثُومٌ', translit: 'thūm', english: 'garlic' },
    { arabic: 'طَعْمٌ', translit: 'ṭaʿm', english: 'taste' },
    { arabic: 'لَذِيذٌ', translit: 'ladhīdh', english: 'delicious' },
    { arabic: 'حُلْوٌ', translit: 'ḥulw', english: 'sweet' },
    { arabic: 'مَالِحٌ', translit: 'māliḥ', english: 'salty' },
    { arabic: 'حَامِضٌ', translit: 'ḥāmiḍ', english: 'sour' },
  ],
  exercises: [
    {
      type: 'choose',
      prompt: 'How do you tell a woman “cook!”?',
      options: ['اُطْبُخُوا', 'اُطْبُخِي', 'اُطْبُخْ'],
      answer: 1,
    },
    {
      type: 'choose',
      prompt: 'You are talking to a group of friends. Which word means “wash!”?',
      options: ['اِغْسِلْ', 'اِغْسِلِي', 'اِغْسِلُوا'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose what you hear.',
      audio: 'ضَعِي الْمِلْحَ',
      options: ['ضَعِ الْمِلْحَ', 'ضَعُوا الْمِلْحَ', 'ضَعِي الْمِلْحَ'],
      answer: 2,
    },
    {
      type: 'listen',
      prompt: 'Listen and choose the word you hear.',
      audio: 'لَذِيذٌ',
      options: ['مَالِحٌ', 'لَذِيذٌ', 'حُلْوٌ'],
      answer: 1,
    },
    {
      type: 'match',
      prompt: 'Match each ingredient or thing with its meaning.',
      pairs: [
        { arabic: 'بَصَلٌ', english: 'onions' },
        { arabic: 'ثُومٌ', english: 'garlic' },
        { arabic: 'زَيْتٌ', english: 'oil' },
        { arabic: 'مِلْحٌ', english: 'salt' },
        { arabic: 'مِلْعَقَةٌ', english: 'spoon' },
      ],
    },
    {
      type: 'match',
      prompt: 'Match each taste with its meaning.',
      pairs: [
        { arabic: 'حُلْوٌ', english: 'sweet' },
        { arabic: 'مَالِحٌ', english: 'salty' },
        { arabic: 'حَامِضٌ', english: 'sour' },
        { arabic: 'لَذِيذٌ', english: 'delicious' },
      ],
    },
    {
      type: 'build',
      prompt: 'Build the instruction (to a man).',
      english: 'Cut the onions.',
      words: ['اِقْطَعِ', 'الْبَصَلَ'],
      distractors: ['اِقْطَعِي'],
    },
    {
      type: 'build',
      prompt: 'Build the instruction (to a woman).',
      english: 'Put a little oil in the pot.',
      words: ['ضَعِي', 'قَلِيلًا', 'مِنَ', 'الزَّيْتِ', 'فِي', 'الْقِدْرِ'],
      distractors: ['ضَعُوا'],
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'اللَّيْمُونُ',
      after: '',
      english: 'Lemon is sour.',
      options: ['حُلْوٌ', 'حَامِضٌ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'يَا كَرِيمُ،',
      after: 'الْبَصَلَ وَالثُّومَ.',
      english: 'Karim, wash the onions and the garlic.',
      options: ['اِغْسِلِي', 'اِغْسِلِ'],
      answer: 1,
    },
    {
      type: 'gap',
      prompt: 'Fill the gap.',
      before: 'يَا أَصْدِقَائِي،',
      after: 'الْأَرُزَّ.',
      english: 'My friends, cook the rice.',
      options: ['اُطْبُخُوا', 'اُطْبُخْ', 'اُطْبُخِي'],
      answer: 0,
    },
  ],
  grammarNote: [
    {
      type: 'p',
      text: 'To tell someone to do something, Arabic uses the imperative. It is made from the “you” form of the present: drop the تَـ at the start, then the ending changes for a man, a woman or a group.',
    },
    {
      type: 'table',
      head: ['You (present)', 'To a man', 'To a woman', 'To a group'],
      rows: [
        ['تَطْبُخُ', 'اُطْبُخْ', 'اُطْبُخِي', 'اُطْبُخُوا'],
        ['تَغْسِلُ', 'اِغْسِلْ', 'اِغْسِلِي', 'اِغْسِلُوا'],
        ['تَقْطَعُ', 'اِقْطَعْ', 'اِقْطَعِي', 'اِقْطَعُوا'],
        ['تَضَعُ', 'ضَعْ', 'ضَعِي', 'ضَعُوا'],
      ],
    },
    {
      type: 'p',
      text: 'When what is left starts with a sukun (طْبُخْ), add a helping vowel in front: اُ when the middle vowel is u (اُطْبُخْ), اِ when it is a or i (اِقْطَعْ، اِغْسِلْ). ضَعْ starts with a vowel, so it needs none. The alif written after ـُوا is silent. Some verbs are irregular: يُضِيفُ gives أَضِفْ.',
    },
    {
      type: 'example',
      arabic: 'اِغْسِلِي الْبَصَلَ أَوَّلًا.',
      translit: 'ighsilī l-baṣal awwalan',
      english: 'Wash the onions first. (to a woman)',
    },
    {
      type: 'example',
      arabic: 'ضَعُوا الْقِدْرَ عَلَى النَّارِ.',
      translit: 'ḍaʿū l-qidr ʿalā n-nār',
      english: 'Put the pot on the heat. (to a group)',
    },
    {
      type: 'p',
      text: 'Before الْ, the sukun of the man’s form becomes a kasra so the words link: اِقْطَعِ الْبَصَلَ، ضَعِ الْمِلْحَ.',
    },
  ],
  cultureTip: {
    title: 'Molokhia and the Friday lunch',
    body: 'مُلُوخِيَّةٌ is a green soup of finely chopped jute leaves, finished with garlic fried in ghee and eaten with rice or bread. مَحْشِيٌّ is vegetables such as vine leaves, peppers and courgettes stuffed with spiced rice. In many Egyptian homes Friday lunch is the big family meal, and these are the dishes people miss most when they are away.',
  },
};
