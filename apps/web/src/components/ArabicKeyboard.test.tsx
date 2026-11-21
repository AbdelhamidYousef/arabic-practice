import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it } from 'vitest';

import { en } from '../i18n';

import { ArabicKeyboard } from './ArabicKeyboard';

function Harness({ initial = '', maxLength }: { initial?: string; maxLength?: number }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(initial);
  return (
    <>
      <textarea
        ref={ref}
        aria-label="field"
        value={value}
        maxLength={maxLength}
        onChange={(e) => setValue(e.target.value)}
      />
      <output data-testid="state">{value}</output>
      <ArabicKeyboard target={ref} />
    </>
  );
}

async function open() {
  await userEvent.click(screen.getByRole('button', { name: en['keyboard.toggle'] }));
}

describe('ArabicKeyboard', () => {
  it('starts hidden and toggles open and closed', async () => {
    render(<Harness />);
    const toggle = screen.getByRole('button', { name: en['keyboard.toggle'] });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('button', { name: 'ب' })).not.toBeInTheDocument();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'ب' })).toBeVisible();
    await userEvent.click(toggle);
    expect(screen.queryByRole('button', { name: 'ب' })).not.toBeInTheDocument();
  });

  it('types letters and keeps the (controlled) state and focus in the field', async () => {
    render(<Harness />);
    await open();
    await userEvent.click(screen.getByRole('button', { name: 'ب' }));
    await userEvent.click(screen.getByRole('button', { name: 'ت' }));
    expect(screen.getByLabelText('field')).toHaveValue('بت');
    expect(screen.getByTestId('state')).toHaveTextContent('بت');
    expect(screen.getByLabelText('field')).toHaveFocus();
  });

  it('inserts at the caret, not at the end, and moves the caret on', async () => {
    render(<Harness initial="كتب" />);
    const field = screen.getByLabelText<HTMLTextAreaElement>('field');
    field.setSelectionRange(1, 1);
    await open();
    await userEvent.click(screen.getByRole('button', { name: 'ا' }));
    expect(field).toHaveValue('كاتب');
    expect(field.selectionStart).toBe(2);
    await userEvent.click(screen.getByRole('button', { name: 'ل' }));
    expect(field).toHaveValue('كالتب');
  });

  it('replaces a selection', async () => {
    render(<Harness initial="كتب" />);
    const field = screen.getByLabelText<HTMLTextAreaElement>('field');
    field.setSelectionRange(1, 3);
    await open();
    await userEvent.click(screen.getByRole('button', { name: 'ر' }));
    expect(field).toHaveValue('كر');
  });

  it('has a real, named button for each of the eight marks, and inserts the right one', async () => {
    render(<Harness initial="ب" />);
    await open();
    const marks: [string, string][] = [
      ['fatha', 'َ'],
      ['damma', 'ُ'],
      ['kasra', 'ِ'],
      ['sukun', 'ْ'],
      ['shadda', 'ّ'],
      ['fathatan', 'ً'],
      ['dammatan', 'ٌ'],
      ['kasratan', 'ٍ'],
    ];
    const field = screen.getByLabelText<HTMLTextAreaElement>('field');
    for (const [name, mark] of marks) {
      const key = screen.getByRole('button', { name });
      expect(key.tagName).toBe('BUTTON');
      field.value = 'ب';
      field.setSelectionRange(1, 1);
      await userEvent.click(key);
      expect(field.value).toBe(`ب${mark}`);
    }
  });

  it('puts a mark right after the letter before the caret', async () => {
    render(<Harness initial="كتب" />);
    const field = screen.getByLabelText<HTMLTextAreaElement>('field');
    field.setSelectionRange(1, 1);
    await open();
    await userEvent.click(screen.getByRole('button', { name: 'fatha' }));
    expect(field).toHaveValue('كَتب');
  });

  it('types a space and backspaces one character, or a selection', async () => {
    render(<Harness initial="ابت" />);
    const field = screen.getByLabelText<HTMLTextAreaElement>('field');
    field.setSelectionRange(3, 3);
    await open();
    await userEvent.click(screen.getByRole('button', { name: en['keyboard.space'] }));
    expect(field).toHaveValue('ابت ');
    await userEvent.click(screen.getByRole('button', { name: en['keyboard.backspace'] }));
    await userEvent.click(screen.getByRole('button', { name: en['keyboard.backspace'] }));
    expect(field).toHaveValue('اب');
    field.setSelectionRange(0, 2);
    await userEvent.click(screen.getByRole('button', { name: en['keyboard.backspace'] }));
    expect(field).toHaveValue('');
    // Nothing left to delete: no error.
    await userEvent.click(screen.getByRole('button', { name: en['keyboard.backspace'] }));
    expect(field).toHaveValue('');
  });

  it('works from the keyboard (Enter on a focused key) and stops at the field maxLength', async () => {
    render(<Harness maxLength={2} />);
    await open();
    screen.getByRole('button', { name: 'ب' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByLabelText('field')).toHaveValue('ب');
    screen.getByRole('button', { name: 'ت' }).focus();
    await userEvent.keyboard('{Enter}');
    screen.getByRole('button', { name: 'ث' }).focus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByLabelText('field')).toHaveValue('بت');
  });
});
