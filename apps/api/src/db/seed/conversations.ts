import type { SeedLearner } from './users.ts';
import { demoLearners } from './users.ts';

// Made-up practice conversations for the demo teacher's class, so the teacher view has something
// to show: transcripts, corrections and a spread of mistake types. The learners' sentences are
// typed the way a learner types (no harakat); each correction restores them, with harakat.
// A partner reply is a short, level-appropriate line, as the partner prompt asks for.

export type SeedMistakeType =
  'grammar' | 'vocabulary' | 'harakat' | 'spelling' | 'word_order' | 'register';

export interface SeedMistake {
  type: SeedMistakeType;
  original: string;
  correction: string;
  explanation: string;
}

export interface SeedTurn {
  learner: string;
  corrected: string;
  praise?: string;
  mistakes: SeedMistake[];
  partner: string;
}

export interface SeedConversation {
  learner: SeedLearner['email'];
  lessonSlug: string;
  /** How many days ago the conversation started (always at least 1: seed usage never counts for today's caps). */
  daysAgo: number;
  turns: SeedTurn[];
}

const [layla, omar, sofia, daniel] = demoLearners.map((l) => l.email) as [
  string,
  string,
  string,
  string,
];

export const seedConversations: SeedConversation[] = [
  {
    learner: layla,
    lessonSlug: 'greetings',
    daysAgo: 9,
    turns: [
      {
        learner: 'مرحبا! اسمي ليلى. كيف حالك؟',
        corrected: 'مَرْحَبًا! اِسْمِي لَيْلَى. كَيْفَ حَالُكِ؟',
        praise: 'A clear introduction, and the question is well formed.',
        mistakes: [
          {
            type: 'grammar',
            original: 'حالك',
            correction: 'حالكِ',
            explanation: 'Salma is a woman, so "your" ends in kasra (كِ), not fatha (كَ): كَيْفَ حَالُكِ.',
          },
        ],
        partner: 'أَنَا بِخَيْرٍ، شُكْرًا! تَشَرَّفْنَا يَا لَيْلَى.',
      },
      {
        learner: 'شكرا. انا بخير ايضا.',
        corrected: 'شُكْرًا. أَنَا بِخَيْرٍ أَيْضًا.',
        mistakes: [
          {
            type: 'spelling',
            original: 'انا',
            correction: 'أنا',
            explanation: '"I" is written with a hamza above the alef: أَنَا.',
          },
          {
            type: 'spelling',
            original: 'ايضا',
            correction: 'أيضا',
            explanation: '"Also" starts with a hamza above the alef: أَيْضًا.',
          },
        ],
        partner: 'الْحَمْدُ لِلَّهِ! أَنَا سَعِيدَةٌ.',
      },
    ],
  },
  {
    learner: layla,
    lessonSlug: 'family',
    daysAgo: 4,
    turns: [
      {
        learner: 'عندي أخ كبيرة.',
        corrected: 'عِنْدِي أَخٌ كَبِيرٌ.',
        mistakes: [
          {
            type: 'grammar',
            original: 'كبيرة',
            correction: 'كبير',
            explanation:
              'The adjective must match the noun. أَخٌ (brother) is masculine, so use كَبِيرٌ without the ة.',
          },
        ],
        partner: 'جَمِيلٌ! هَلْ أَخُوكَ فِي الْبَيْتِ؟',
      },
    ],
  },
  {
    learner: omar,
    lessonSlug: 'cafe-order',
    daysAgo: 7,
    turns: [
      {
        learner: 'اريد قهوه من فضلك',
        corrected: 'أُرِيدُ قَهْوَةً مِنْ فَضْلِكَ.',
        praise: 'Polite and clear. You remembered مِنْ فَضْلِكَ.',
        mistakes: [
          {
            type: 'spelling',
            original: 'اريد',
            correction: 'أريد',
            explanation: '"I want" starts with a hamza above the alef: أُرِيدُ.',
          },
          {
            type: 'spelling',
            original: 'قهوه',
            correction: 'قهوة',
            explanation:
              'This word ends in ta marbuta (ة), the dotted shape that marks a feminine noun, not a plain ha (ه).',
          },
        ],
        partner: 'حَاضِرٌ! هَلْ تُرِيدُ سُكَّرًا مَعَ الْقَهْوَةِ؟',
      },
      {
        learner: 'نعم قليلا من السكر',
        corrected: 'نَعَمْ، قَلِيلًا مِنَ السُّكَّرِ.',
        praise: 'Perfect sentence. قَلِيلًا مِنْ is used exactly right.',
        mistakes: [],
        partner: 'تَفَضَّلْ! قَهْوَةٌ بِالسُّكَّرِ.',
      },
    ],
  },
  {
    learner: omar,
    lessonSlug: 'daily-routine',
    daysAgo: 2,
    turns: [
      {
        learner: 'أنا آكل الفطور في الساعة سبعة',
        corrected: 'أَنَا آكُلُ الْفُطُورَ فِي السَّاعَةِ السَّابِعَةِ.',
        mistakes: [
          {
            type: 'grammar',
            original: 'سبعة',
            correction: 'السابعة',
            explanation:
              'To give the time, use the feminine ordinal after السَّاعَة: السَّاعَةُ السَّابِعَةُ means "seven o\'clock".',
          },
        ],
        partner: 'مُمْتَازٌ! وَمَتَى تَذْهَبُ إِلَى الْعَمَلِ؟',
      },
      {
        learner: 'اذهب الى العمل بالسيارة',
        corrected: 'أَذْهَبُ إِلَى الْعَمَلِ بِالسَّيَّارَةِ.',
        mistakes: [
          {
            type: 'spelling',
            original: 'الى',
            correction: 'إلى',
            explanation:
              '"To" is written with a hamza below the alef and ends in ى (alef maqsura, no dots): إِلَى.',
          },
          {
            type: 'spelling',
            original: 'اذهب',
            correction: 'أذهب',
            explanation: '"I go" starts with a hamza above the alef: أَذْهَبُ.',
          },
        ],
        partner: 'جَيِّدٌ! هَلْ تَرْجِعُ مُتَأَخِّرًا؟',
      },
    ],
  },
  {
    learner: sofia,
    lessonSlug: 'weather',
    daysAgo: 6,
    turns: [
      {
        learner: 'الطقس اليوم بارد جدا لكن أمس كان أكثر بارد',
        corrected: 'الطَّقْسُ الْيَوْمَ بَارِدٌ جِدًّا، لَكِنْ أَمْسِ كَانَ أَبْرَدَ.',
        praise: 'Good use of كَانَ for the past.',
        mistakes: [
          {
            type: 'grammar',
            original: 'أكثر بارد',
            correction: 'أبرد',
            explanation:
              'Arabic builds the comparative from the adjective itself on the pattern أَفْعَل (بَارِد becomes أَبْرَد), not with أَكْثَر plus the adjective.',
          },
        ],
        partner: 'نَعَمْ، الشِّتَاءُ بَارِدٌ هُنَا. هَلْ تُحِبُّ الثَّلْجَ؟',
      },
      {
        learner: 'نعم احب الثلج لانه جميل',
        corrected: 'نَعَمْ، أُحِبُّ الثَّلْجَ لِأَنَّهُ جَمِيلٌ.',
        mistakes: [
          {
            type: 'spelling',
            original: 'لانه',
            correction: 'لأنه',
            explanation:
              '"Because" is لِأَنَّ: the hamza sits on the alef, and the pronoun joins it (لِأَنَّهُ).',
          },
          {
            type: 'spelling',
            original: 'احب',
            correction: 'أحب',
            explanation: '"I like" starts with a hamza above the alef: أُحِبُّ.',
          },
        ],
        partner: 'جَمِيلٌ فِعْلًا! الثَّلْجُ أَبْيَضُ وَنَاعِمٌ.',
      },
    ],
  },
  {
    learner: sofia,
    lessonSlug: 'hobbies',
    daysAgo: 3,
    turns: [
      {
        learner: 'ايش تحب في وقت الفراغ؟',
        corrected: 'مَاذَا تُحِبُّ فِي وَقْتِ الْفَرَاغِ؟',
        mistakes: [
          {
            type: 'register',
            original: 'ايش',
            correction: 'ماذا',
            explanation:
              '"ايش" is colloquial (spoken dialect). In Modern Standard Arabic ask مَا or مَاذَا.',
          },
        ],
        partner: 'أُحِبُّ الرَّسْمَ وَالْمُوسِيقَى. وَأَنْتَ، هَلْ تَسْتَمْتِعُ بِالرِّيَاضَةِ؟',
      },
      {
        learner: 'نَعَمْ، أَسْتَمْتَعُ بِكُرَةِ الْقَدَمِ كُلَّ أُسْبُوعٍ.',
        corrected: 'نَعَمْ، أَسْتَمْتِعُ بِكُرَةِ الْقَدَمِ كُلَّ أُسْبُوعٍ.',
        mistakes: [
          {
            type: 'harakat',
            original: 'أَسْتَمْتَعُ',
            correction: 'أَسْتَمْتِعُ',
            explanation:
              'In the present tense the vowel on the ت before the last letter is kasra: أَسْتَمْتِعُ. The fatha belongs to the past tense (اِسْتَمْتَعَ).',
          },
        ],
        partner: 'رَائِعٌ! كُرَةُ الْقَدَمِ رِيَاضَةٌ مُمْتِعَةٌ.',
      },
    ],
  },
  {
    learner: daniel,
    lessonSlug: 'work-and-study',
    daysAgo: 8,
    turns: [
      {
        learner: 'أنا أعمل في شركة تأمين منذ ثلاثة سنوات',
        corrected: 'أَنَا أَعْمَلُ فِي شَرِكَةِ تَأْمِينٍ مُنْذُ ثَلَاثِ سَنَوَاتٍ.',
        mistakes: [
          {
            type: 'grammar',
            original: 'ثلاثة سنوات',
            correction: 'ثلاث سنوات',
            explanation:
              'The numbers 3 to 10 take the opposite gender of the noun. سَنَوَات (years) is grammatically feminine, so the number drops its ة: ثَلَاثُ سَنَوَاتٍ.',
          },
        ],
        partner: 'هَذِهِ خِبْرَةٌ جَيِّدَةٌ. مَا الَّذِي تَعَلَّمْتَهُ فِي هَذِهِ الشَّرِكَةِ؟',
      },
      {
        learner: 'تعلمت كيف أعمل مع فريق بشكل جيد',
        corrected: 'تَعَلَّمْتُ كَيْفَ أَعْمَلُ مَعَ فَرِيقٍ بِشَكْلٍ جَيِّدٍ.',
        praise: 'Excellent. بِشَكْلٍ جَيِّدٍ is natural, formal phrasing.',
        mistakes: [],
        partner: 'مُمْتَازٌ! هَلْ تُفَكِّرُ فِي تَغْيِيرِ وَظِيفَتِكَ؟',
      },
    ],
  },
  {
    learner: daniel,
    lessonSlug: 'news-headlines',
    daysAgo: 1,
    turns: [
      {
        learner: 'قرأت ان الحكومة أعلنت قرارا جديدا',
        corrected: 'قَرَأْتُ أَنَّ الْحُكُومَةَ أَعْلَنَتْ قَرَارًا جَدِيدًا.',
        mistakes: [
          {
            type: 'grammar',
            original: 'ان',
            correction: 'أنَّ',
            explanation:
              'After verbs like قَرَأَ, قَالَ and سَمِعَ, أَنَّ (with shadda) introduces a fact and takes a noun in the accusative. أَنْ (no shadda) is followed by a verb.',
          },
        ],
        partner: 'نَعَمْ، سَمِعْتُ عَنْ ذَلِكَ. كَيْفَ سَيُؤَثِّرُ هَذَا الْقَرَارُ فِي الِاقْتِصَادِ؟',
      },
      {
        learner: 'أعتقد أن الأسعار ستصعد في الأشهر القادمة',
        corrected: 'أَعْتَقِدُ أَنَّ الْأَسْعَارَ سَتَرْتَفِعُ فِي الْأَشْهُرِ الْقَادِمَةِ.',
        mistakes: [
          {
            type: 'vocabulary',
            original: 'ستصعد',
            correction: 'سترتفع',
            explanation:
              'صَعِدَ is for climbing (stairs, a mountain). For prices, temperatures and levels use اِرْتَفَعَ ("rose"): سَتَرْتَفِعُ.',
          },
        ],
        partner: 'هَذَا صَحِيحٌ، وَقَدْ تَنْخَفِضُ أَسْعَارُ أَشْيَاءَ أُخْرَى.',
      },
    ],
  },
];
