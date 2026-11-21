import type { GrammarBlock } from '@arabic/shared';

import { ArabicText } from '../../components/ui/ArabicText';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useT } from '../../i18n';
import { speakArabic, useArabicVoice } from '../../lib/speech';

import { MixedText } from './MixedText';
import type { StepProps } from './step-props';

// The lesson's grammar note: short paragraphs, example rows (Arabic, transliteration, English) and
// small tables. Any Arabic inside the English text or a table cell goes through ArabicText.
export function GrammarStep({ data, onComplete, saving }: StepProps) {
  const { t } = useT();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-primary">{t('step.grammar')}</p>
        <h1 className="mt-1 text-2xl">{t('grammar.title')}</h1>
      </div>
      <div className="space-y-5">
        {data.lesson.grammarNote.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
      <Button size="lg" className="w-full" loading={saving} onClick={() => onComplete()}>
        {t('player.continue')}
      </Button>
    </div>
  );
}

function Block({ block }: { block: GrammarBlock }) {
  const { t } = useT();
  const hasVoice = useArabicVoice();
  switch (block.type) {
    case 'p':
      return (
        <p className="max-w-prose text-lg">
          <MixedText text={block.text} />
        </p>
      );
    case 'example':
      return (
        <div className="flex items-center gap-4 rounded-ui border border-line bg-surface p-4 shadow-card">
          <div className="min-w-0 flex-1">
            <ArabicText as="p" className="text-2xl">
              {block.arabic}
            </ArabicText>
            <p className="text-muted">{block.translit}</p>
            <p className="font-medium">
              <MixedText text={block.english} />
            </p>
          </div>
          {hasVoice && (
            <Button
              variant="secondary"
              size="icon"
              aria-label={t('exercise.listen')}
              onClick={() => speakArabic(block.arabic)}
            >
              <Icon name="speaker" />
            </Button>
          )}
        </div>
      );
    case 'table':
      return (
        <div className="overflow-x-auto rounded-ui border border-line bg-surface">
          <table className="w-full text-left">
            <thead className="border-b border-line bg-primary-soft/50">
              <tr>
                {block.head.map((cell, i) => (
                  <th key={i} scope="col" className="px-4 py-2 text-sm font-medium">
                    <MixedText text={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b border-line last:border-b-0">
                  {row.map((cell, c) => (
                    <td key={c} className="px-4 py-2 align-middle">
                      <MixedText text={cell} arabicClassName="text-xl" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
