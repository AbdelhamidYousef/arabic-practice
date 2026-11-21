import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';

import { MixedText } from './MixedText';
import type { StepProps } from './step-props';

// One culture tip as a warm card: the one place in the player where the sand-amber tint sets the
// mood (it is a highlight, never right or wrong).
export function CultureStep({ data, onComplete, saving }: StepProps) {
  const { t } = useT();
  const tip = data.lesson.cultureTip;
  if (!tip) return null;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-primary">{t('step.culture')}</p>
        <h1 className="mt-1 text-2xl">{t('culture.title')}</h1>
      </div>
      <Card className="rounded-3xl bg-[linear-gradient(160deg,var(--color-accent-soft),var(--color-surface)_65%)] p-6 sm:p-8">
        <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-surface text-accent-strong shadow-card">
          <Icon name="globe" className="size-6" />
        </span>
        <h2 className="mt-5 text-2xl">
          <MixedText text={tip.title} />
        </h2>
        <p className="mt-3 max-w-prose text-lg">
          <MixedText text={tip.body} />
        </p>
      </Card>
      <Button size="lg" className="w-full" loading={saving} onClick={() => onComplete()}>
        {t('player.continue')}
      </Button>
    </div>
  );
}
