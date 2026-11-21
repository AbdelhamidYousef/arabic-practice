import { useId, type ReactNode } from 'react';

import { cn } from '../../lib/cn';

interface FieldProps {
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  className?: string;
  /** Receives the ids to put on the control so the label, hint and error are all announced. */
  children: (props: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': true | undefined;
  }) => ReactNode;
}

// Label + control + hint/error wiring, shared by Input and Textarea (and later Select).
export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  const noteId = `${id}-note`;
  const note = error ?? hint;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children({
        id,
        'aria-describedby': note ? noteId : undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {note && (
        <p id={noteId} className={cn('text-sm', error ? 'text-danger' : 'text-muted')}>
          {note}
        </p>
      )}
    </div>
  );
}

export const controlClasses =
  'w-full min-h-11 rounded-ui border border-line bg-surface px-3.5 py-2 text-base text-ink placeholder:text-muted aria-[invalid=true]:border-danger disabled:opacity-60';
