import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

import { controlClasses, Field } from './Field';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string | undefined;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, rows = 4, ...rest },
  ref,
) {
  return (
    <Field label={label} hint={hint} error={error}>
      {(aria) => (
        <textarea
          ref={ref}
          rows={rows}
          {...aria}
          {...rest}
          className={cn(controlClasses, 'resize-y', className)}
        />
      )}
    </Field>
  );
});
