import { stripHarakat } from '@arabic/shared';
import type { ElementType, HTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

interface ArabicTextProps extends Omit<HTMLAttributes<HTMLElement>, 'dir' | 'lang'> {
  children: string;
  /** Shows the bare letters: a learner practising reading without the short vowels. */
  hideHarakat?: boolean;
  as?: ElementType;
}

// Arabic is always rendered through this: `lang`/`dir` tell screen readers and the bidi algorithm
// what it is, and the `.arabic` class sets the font, the larger size and the tall line.
// `dir="rtl"` on an inline span keeps punctuation inside the run on the right side.
export function ArabicText({
  children,
  hideHarakat = false,
  as: Tag = 'span',
  className,
  ...rest
}: ArabicTextProps) {
  return (
    <Tag lang="ar" dir="rtl" className={cn('arabic', className)} {...rest}>
      {hideHarakat ? stripHarakat(children) : children}
    </Tag>
  );
}
