import type { SVGAttributes } from 'react';

import { cn } from '../../lib/cn';

// A handful of line icons drawn on a 24 px grid, inlined so there is no icon library to add.
// Decorative by default (aria-hidden): the button or link around an icon carries the label.
const paths = {
  speaker: ['M11 5 6 9H3v6h3l5 4V5z', 'M15.5 8.5a5 5 0 0 1 0 7', 'M18.5 5.5a9 9 0 0 1 0 13'],
  menu: ['M4 7h16', 'M4 12h16', 'M4 17h16'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  cards: [
    'M5 7h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z',
    'M7 3h12a2 2 0 0 1 2 2v11',
  ],
  check: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'm8 12.5 2.5 2.5L16 9.5'],
  blocks: ['M4 4h6v6H4z', 'M14 4h6v6h-6z', 'M4 14h6v6H4z', 'M14 14h6v6h-6z'],
  globe: [
    'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    'M3 12h18',
    'M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z',
  ],
  chat: ['M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z'],
  arrow: ['M5 12h14', 'm13 6 6 6-6 6'],
  flame: [
    'M12 21a6 6 0 0 0 6-6c0-4-3-6-4.5-10C12 8 9 8.5 9 12c-1-.5-2-2-2-3-1 1.5-1 3.5-1 6a6 6 0 0 0 6 6z',
  ],
  letter: ['M4 20h16', 'M7 16 12 4l5 12', 'M9 12h6'],
} as const;

export type IconName = keyof typeof paths;

interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={cn('size-5 shrink-0', className)}
      {...rest}
    >
      {paths[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
