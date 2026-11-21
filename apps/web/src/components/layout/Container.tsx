import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

// The page width: generous side gutters on a phone, a readable column on a desktop.
export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-5xl px-4 sm:px-6', className)} {...rest} />;
}
