import type { IconName } from '../../components/ui/Icon';
import type { StringKey } from '../../i18n';

// Landing-page data. Arabic here is content (with full harakat), English goes through the
// dictionary. Lesson counts follow the course plan (docs/plan/07-course-plan.md).

export const HERO_WORD = {
  arabic: 'مَرْحَبًا',
  translit: 'marḥaban',
  meaningKey: 'home.hero.wordMeaning',
} as const;

export const SAMPLE_EXERCISE = {
  options: ['مَرْحَبًا', 'نَعَمْ', 'شُكْرًا', 'مِنْ فَضْلِكَ'],
  answer: 2,
} as const;

export interface LevelCard {
  code: string;
  nameKey: StringKey;
  canDoKey: StringKey;
  lessons: number;
  sample: string;
}

export const LEVELS: LevelCard[] = [
  { code: 'A0', nameKey: 'level.A0', canDoKey: 'home.levels.A0', lessons: 10, sample: 'بَابٌ' },
  { code: 'A1', nameKey: 'level.A1', canDoKey: 'home.levels.A1', lessons: 36, sample: 'قَهْوَةٌ' },
  { code: 'A2', nameKey: 'level.A2', canDoKey: 'home.levels.A2', lessons: 26, sample: 'سَافَرْتُ' },
];

export const LESSON_STEPS: { icon: IconName; titleKey: StringKey; bodyKey: StringKey }[] = [
  { icon: 'cards', titleKey: 'home.steps.words', bodyKey: 'home.steps.words.body' },
  { icon: 'check', titleKey: 'home.steps.practice', bodyKey: 'home.steps.practice.body' },
  { icon: 'blocks', titleKey: 'home.steps.grammar', bodyKey: 'home.steps.grammar.body' },
  { icon: 'globe', titleKey: 'home.steps.culture', bodyKey: 'home.steps.culture.body' },
  { icon: 'chat', titleKey: 'home.steps.talk', bodyKey: 'home.steps.talk.body' },
];

export const FAQ: { q: StringKey; a: StringKey }[] = [
  { q: 'home.faq.free.q', a: 'home.faq.free.a' },
  { q: 'home.faq.read.q', a: 'home.faq.read.a' },
  { q: 'home.faq.which.q', a: 'home.faq.which.a' },
  { q: 'home.faq.ai.q', a: 'home.faq.ai.a' },
];
