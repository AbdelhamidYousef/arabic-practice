import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

export type BadgeTone = 'neutral' | 'primary' | 'accent' | 'success' | 'danger';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

// Every tone pairs a dark text colour with a tint, checked in styles/tokens.test.ts.
const tones: Record<BadgeTone, string> = {
  neutral: 'bg-surface text-ink border border-line',
  primary: 'bg-primary-soft text-primary',
  accent: 'bg-accent-soft text-accent-strong',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
};

export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...rest}
    />
  );
}
