import { forwardRef, type SelectHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

import { controlClasses, Field } from './Field';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string | undefined;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, className, children, ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(aria) => (
        <select ref={ref} {...aria} {...rest} className={cn(controlClasses, className)}>
          {children}
        </select>
      )}
    </Field>
  );
});
