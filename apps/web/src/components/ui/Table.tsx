import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

// A table that scrolls sideways inside its own box, so a wide one never widens the page on a phone.
// `label` names the scroll region for screen readers; it is focusable so a keyboard can scroll it.
export function TableScroll({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn('overflow-x-auto rounded-ui border border-line bg-surface', className)}
    >
      <table className="w-full min-w-max text-left text-sm">{children}</table>
    </div>
  );
}

export const Th = ({ className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th scope="col" className={cn('px-4 py-2 font-medium', className)} {...rest} />
);

export const Td = ({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn('px-4 py-2 align-top', className)} {...rest} />
);

export const THead = ({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn('border-b border-line bg-primary-soft/50', className)} {...rest} />
);

export const Tr = ({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn('border-b border-line last:border-b-0', className)} {...rest} />
);
