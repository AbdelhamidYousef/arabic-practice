import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

// The one card style: surface fill, hairline border, one radius, soft shadow.
export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-ui border border-line bg-surface p-6 shadow-card', className)}
      {...rest}
    />
  );
}
