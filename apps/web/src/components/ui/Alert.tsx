import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  title?: string;
}

const tones: Record<AlertTone, string> = {
  info: 'bg-primary-soft text-ink border-primary',
  success: 'bg-success-soft text-ink border-success',
  warning: 'bg-accent-soft text-ink border-accent',
  danger: 'bg-danger-soft text-ink border-danger',
};

// Errors interrupt (role=alert); everything else is announced politely (role=status).
export function Alert({ tone = 'info', title, className, children, ...rest }: AlertProps) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      className={cn('rounded-ui border-l-4 px-4 py-3 text-sm', tones[tone], className)}
      {...rest}
    >
      {title && <p className="font-semibold">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
