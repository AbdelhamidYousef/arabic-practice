import { useId, useState, type RefObject } from 'react';

import { useT, type StringKey } from '../i18n';
import { cn } from '../lib/cn';

import { ArabicText } from './ui/ArabicText';

type Field = HTMLTextAreaElement | HTMLInputElement;

// Letters in the standard Arabic keyboard order (three rows of 12, read in one run); the grid wraps
// them to fit the width.
const LETTERS: string[] = [
  ...['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  ...['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط', 'ذ'],
  ...['ئ', 'ء', 'ؤ', 'ر', 'ى', 'ة', 'و', 'ز', 'ظ', 'أ', 'إ', 'آ'],
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
  /** Extra classes for the key panel (the toggle button is not part of it). */
  panelClassName?: string;
}

// Keys are a fixed 40 px tall. The 36 letters sit in a grid of 6 columns on a phone (6 rows, no key
// under ~38 px at 320 px) and the usual 12 per row from the `sm` breakpoint up.
// `leading-none` on the glyph: the Arabic line height (2) would otherwise spill over the key border.
const keyClasses =
  'flex h-10 min-w-0 items-center justify-center rounded-ui border border-line bg-surface p-0 text-xl leading-none text-ink hover:bg-primary-soft active:bg-primary-soft [&_.arabic]:leading-none';
const gridClasses = 'grid gap-1';

export function ArabicKeyboard({ target, className, panelClassName }: ArabicKeyboardProps) {
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
        className={cn(
          'mt-2 space-y-1 rounded-ui border border-line bg-bg p-2',
          !open && 'hidden',
          panelClassName,
        )}
      >
        <div className={cn(gridClasses, 'grid-cols-6 sm:grid-cols-12')}>
          {LETTERS.map((letter) => (
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
        <div
          className={cn(gridClasses, 'grid-cols-4 min-[400px]:grid-cols-8')}
          role="group"
          aria-label={t('keyboard.harakat')}
        >
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
        <div className="grid grid-cols-[1fr_4rem] gap-1 sm:grid-cols-[1fr_6rem]">
          <button
            type="button"
            className={cn(keyClasses, 'text-sm')}
            onMouseDown={keepFocus}
            onClick={press((field) => insertAtCaret(field, ' '))}
          >
            {t('keyboard.space')}
          </button>
          <button
            type="button"
            aria-label={t('keyboard.backspace')}
            className={keyClasses}
            onMouseDown={keepFocus}
            onClick={press(backspaceAtCaret)}
          >
            <span aria-hidden="true">⌫</span>
          </button>
        </div>
      </div>
    </div>
  );
}
