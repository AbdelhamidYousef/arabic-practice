import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

// The page width, the same on every page so content lines up with the header and footer:
// generous side gutters on a phone, a wide column on a desktop. Reading pages narrow their own
// text with `max-w-prose` inside.
export function Container({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6', className)} {...rest} />;
}
