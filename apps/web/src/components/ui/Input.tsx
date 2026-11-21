import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

import { controlClasses, Field } from './Field';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string | undefined;
  hideLabel?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, hideLabel, className, ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error} hideLabel={hideLabel}>
      {(aria) => <input ref={ref} {...aria} {...rest} className={cn(controlClasses, className)} />}
    </Field>
  );
});
