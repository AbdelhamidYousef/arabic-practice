import { MAX_TURN_CHARS } from '@arabic/shared';
import { useEffect, useId, useRef, type FormEvent, type KeyboardEvent } from 'react';

import { ArabicKeyboard } from '../../components/ArabicKeyboard';
import { Button } from '../../components/ui/Button';
import { controlClasses } from '../../components/ui/Field';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';

interface ComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
  /** A turn is in flight: the field is read-only, Send becomes Stop. */
  busy: boolean;
}

export function Composer({ value, onChange, onSend, onStop, busy }: ComposerProps) {
  const { t } = useT();
  const field = useRef<HTMLTextAreaElement>(null);
  const counterId = useId();
  const hintId = useId();
  const wasBusy = useRef(false);

  // After a send, the learner types the next line without hunting for the field: focus comes back
  // when the turn is over. (The field is read-only while busy rather than disabled, so a phone's
  // on-screen keyboard also stays up.)
  useEffect(() => {
    if (wasBusy.current && !busy) field.current?.focus({ preventScroll: true });
    wasBusy.current = busy;
  }, [busy]);

  const canSend = value.trim().length > 0 && !busy;
  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (canSend) onSend();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // `isComposing`: Enter that confirms an input-method candidate must not send.
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        ref={field}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        dir="rtl"
        lang="ar"
        rows={2}
        maxLength={MAX_TURN_CHARS}
        readOnly={busy}
        aria-disabled={busy || undefined}
        aria-label={t('chat.composer.label')}
        aria-describedby={`${hintId} ${counterId}`}
        enterKeyHint="send"
        className={cn(
          controlClasses,
          'arabic max-h-40 min-h-[4.5rem] resize-none text-lg',
          busy && 'opacity-70',
        )}
      />
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <p id={hintId} className="sr-only">
          {t('chat.composer.hint')}
        </p>
        <p
          id={counterId}
          className={cn(
            'flex-1 text-xs',
            value.length >= MAX_TURN_CHARS ? 'text-danger' : 'text-muted',
          )}
        >
          {t('chat.composer.counter', { count: value.length, max: MAX_TURN_CHARS })}
        </p>
        <fieldset disabled={busy} className="contents">
          <ArabicKeyboard target={field} className="contents" panelClassName="order-last w-full" />
        </fieldset>
        {busy ? (
          <Button variant="secondary" onClick={onStop}>
            {t('chat.stop')}
          </Button>
        ) : (
          <Button type="submit" disabled={!canSend}>
            {t('chat.send')}
          </Button>
        )}
      </div>
    </form>
  );
}
