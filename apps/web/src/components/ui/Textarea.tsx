import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  type ChangeEvent,
  type TextareaHTMLAttributes,
} from 'react';

import { cn } from '../../lib/cn';

import { controlClasses, Field } from './Field';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string | undefined;
  /** Grows with its text (up to `max-h`, then scrolls) instead of staying a fixed box. */
  autoGrow?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, rows = 4, autoGrow = false, onChange, value, ...rest },
  ref,
) {
  const inner = useRef<HTMLTextAreaElement | null>(null);
  const setRefs = useCallback(
    (node: HTMLTextAreaElement | null) => {
      inner.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  // Reset to `auto` first so the box can also shrink when text is deleted.
  const fit = () => {
    const el = inner.current;
    if (!autoGrow || !el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 2}px`;
  };
  useLayoutEffect(fit, [value, autoGrow]);
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(event);
    fit();
  };
  return (
    <Field label={label} hint={hint} error={error}>
      {(aria) => (
        <textarea
          ref={setRefs}
          rows={rows}
          {...aria}
          {...rest}
          {...(value !== undefined && { value })}
          onChange={handleChange}
          className={cn(
            controlClasses,
            autoGrow ? 'resize-none overflow-y-auto' : 'resize-y',
            className,
          )}
        />
      )}
    </Field>
  );
});
