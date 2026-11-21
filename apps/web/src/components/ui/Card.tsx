import type { HTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

// The one card style: surface fill, hairline border, one radius, soft shadow. The default padding
// steps aside when the caller gives its own `p-*`: `cn` only joins classes, and in Tailwind's CSS
// `p-6` comes after `p-3`, so both together would always end up as `p-6`.
const ownPadding = /(^|\s)p-/;

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-ui border border-line bg-surface shadow-card',
        !ownPadding.test(className ?? '') && 'p-6',
        className,
      )}
      {...rest}
    />
  );
}
