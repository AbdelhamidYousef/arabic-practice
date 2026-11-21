import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ArabicText } from './ArabicText';

const WORD = 'كِتَابٌ';

describe('ArabicText', () => {
  it('renders inside lang=ar dir=rtl with the Arabic font class', () => {
    render(<ArabicText>{WORD}</ArabicText>);
    const el = screen.getByText(WORD);
    expect(el).toHaveAttribute('lang', 'ar');
    expect(el).toHaveAttribute('dir', 'rtl');
    expect(el).toHaveClass('arabic');
  });

  it('keeps the harakat by default and strips them with hideHarakat', () => {
    const { rerender } = render(<ArabicText>{WORD}</ArabicText>);
    expect(screen.getByText(WORD)).toBeInTheDocument();
    rerender(<ArabicText hideHarakat>{WORD}</ArabicText>);
    expect(screen.getByText('كتاب')).toBeInTheDocument();
  });

  it('can render as a block element', () => {
    render(
      <ArabicText as="p" className="mt-2">
        {WORD}
      </ArabicText>,
    );
    expect(screen.getByText(WORD).tagName).toBe('P');
  });
});
