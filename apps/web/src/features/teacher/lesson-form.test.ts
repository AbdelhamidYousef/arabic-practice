import { describe, expect, it } from 'vitest';

import { emptyForm, emptyVocab, move, toInput, validateForm } from './lesson-form';

const reason = (code: string) => code;

describe('move', () => {
  it('moves an item and leaves out-of-range moves alone', () => {
    expect(move(['a', 'b', 'c'], 0, 1)).toEqual(['b', 'a', 'c']);
    expect(move(['a', 'b', 'c'], 2, 0)).toEqual(['c', 'a', 'b']);
    const list = ['a', 'b'];
    expect(move(list, 0, -1)).toBe(list);
    expect(move(list, 1, 2)).toBe(list);
  });
});

describe('validateForm', () => {
  const filled = () => ({
    ...emptyForm(),
    title: 'T',
    topic: 'Topic',
    summary: 'S',
    scenario: 'Sc',
    openingLine: 'أهلاً',
  });

  it('drops the blank spare rows before sending', () => {
    const form = {
      ...filled(),
      vocab: [emptyVocab(), { ...emptyVocab(), arabic: 'أ', english: 'a' }],
    };
    expect(toInput(form).vocab).toEqual([{ arabic: 'أ', english: 'a', note: '' }]);
    expect(toInput(form).goals).toEqual([]);
    expect(validateForm(form, reason).errors).toEqual({});
  });

  it('reports a required field', () => {
    expect(validateForm({ ...filled(), title: '  ' }, reason).errors).toEqual({
      title: 'required',
    });
  });

  it('numbers vocab errors by the row on screen, not by the rows that were sent', () => {
    const form = {
      ...filled(),
      vocab: [emptyVocab(), { ...emptyVocab(), arabic: 'أ', english: '' }],
    };
    expect(validateForm(form, reason).errors).toEqual({ 'vocab.1.english': 'required' });
  });

  it('rejects a position that is not a number', () => {
    expect(validateForm({ ...filled(), position: '' }, reason).errors).toHaveProperty('position');
  });
});
