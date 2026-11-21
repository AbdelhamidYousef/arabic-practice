import { useId, useState, type RefObject } from 'react';

import { useT, type StringKey } from '../i18n';
import { cn } from '../lib/cn';

import { ArabicText } from './ui/ArabicText';

type Field = HTMLTextAreaElement | HTMLInputElement;

// Letters in the standard Arabic keyboard order (right to left, top to bottom).
const LETTER_ROWS: string[][] = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط', 'ذ'],
  ['ئ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ', 'أ', 'إ', 'آ'],
];

// The marks sit on a tatweel (the stretch letter) so each one is visible by itself; the key
// inserts only the mark. The accessible name is the mark's English name, because a screen reader
// says nothing useful for a lone diacritic.
const HARAKAT: { mark: string; name: StringKey }[] = [
  { mark: 'َ', name: 'keyboard.fatha' },
  { mark: 'ُ', name: 'keyboard.damma' },
  { mark: 'ِ', name: 'keyboard.kasra' },
  { mark: 'ْ', name: 'keyboard.sukun' },
  { mark: 'ّ', name: 'keyboard.shadda' },
  { mark: 'ً', name: 'keyboard.fathatan' },
  { mark: 'ٌ', name: 'keyboard.dammatan' },
  { mark: 'ٍ', name: 'keyboard.kasratan' },
];

function setCaret(field: Field, position: number) {
  field.setSelectionRange(position, position);
}

/**
 * Replaces the selection with `text` (or just inserts it at the caret) and puts the caret after it.
 * It writes through `setRangeText` and then fires a real `input` event, so a React-controlled
 * field's `onChange` runs exactly as if the person had typed.
 */
export function insertAtCaret(field: Field, text: string): void {
  const start = field.selectionStart ?? field.value.length;
  const end = field.selectionEnd ?? start;
  const room =
    field.maxLength >= 0 ? field.maxLength - (field.value.length - (end - start)) : Infinity;
  if (text.length > room) return;
  field.setRangeText(text, start, end, 'end');
  setCaret(field, start + text.length);
  field.dispatchEvent(new Event('input', { bubbles: true }));
}

/** Deletes the selection, or the character before the caret. */
export function backspaceAtCaret(field: Field): void {
  const start = field.selectionStart ?? field.value.length;
  const end = field.selectionEnd ?? start;
  const from = start === end ? Math.max(0, start - 1) : start;
  if (from === end) return;
  field.setRangeText('', from, end, 'end');
  setCaret(field, from);
  field.dispatchEvent(new Event('input', { bubbles: true }));
}

interface ArabicKeyboardProps {
  /** The field the keys type into. Focus goes back to it after every key. */
  target: RefObject<Field | null>;
  className?: string;
}

const keyClasses =
  'flex h-11 min-w-0 flex-1 items-center justify-center rounded-ui border border-line bg-surface text-xl text-ink hover:bg-primary-soft active:bg-primary-soft';

export function ArabicKeyboard({ target, className }: ArabicKeyboardProps) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  // Every key: do the edit, then hand focus (and the caret) back to the field so typing goes on.
  const press = (edit: (field: Field) => void) => () => {
    const field = target.current;
    if (!field) return;
    field.focus();
    edit(field);
    field.focus();
  };
  // A pointer press must not move focus off the field in the first place (it would flash the
  // on-screen keyboard of a phone away and lose the caret).
  const keepFocus = (event: { preventDefault: () => void }) => event.preventDefault();

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-11 items-center rounded-ui border border-line bg-surface px-4 text-sm font-medium text-ink hover:bg-primary-soft"
      >
        {t('keyboard.toggle')}
      </button>
      <div
        id={panelId}
        role="group"
        aria-label={t('keyboard.label')}
        hidden={!open}
        className={cn('mt-2 space-y-1 rounded-ui border border-line bg-bg p-2', !open && 'hidden')}
      >
        {LETTER_ROWS.map((row) => (
          <div key={row.join('')} className="flex gap-1">
            {row.map((letter) => (
              <button
                key={letter}
                type="button"
                className={keyClasses}
                onMouseDown={keepFocus}
                onClick={press((field) => insertAtCaret(field, letter))}
              >
                <ArabicText>{letter}</ArabicText>
              </button>
            ))}
          </div>
        ))}
        <div className="flex gap-1" role="group" aria-label={t('keyboard.harakat')}>
          {HARAKAT.map(({ mark, name }) => (
            <button
              key={mark}
              type="button"
              aria-label={t(name)}
              className={keyClasses}
              onMouseDown={keepFocus}
              onClick={press((field) => insertAtCaret(field, mark))}
            >
              <ArabicText aria-hidden="true">{`ـ${mark}`}</ArabicText>
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            className={cn(keyClasses, 'flex-[6] text-sm')}
            onMouseDown={keepFocus}
            onClick={press((field) => insertAtCaret(field, ' '))}
          >
            {t('keyboard.space')}
          </button>
          <button
            type="button"
            className={cn(keyClasses, 'flex-[2] text-sm')}
            onMouseDown={keepFocus}
            onClick={press(backspaceAtCaret)}
          >
            {t('keyboard.backspace')}
          </button>
        </div>
      </div>
    </div>
  );
}
