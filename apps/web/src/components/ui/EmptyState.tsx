import type { ReactNode } from 'react';

import { cn } from '../../lib/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  /** A button or link: the way out of the empty state. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2 px-4 py-12 text-center', className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="max-w-prose text-muted">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
