import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MixedText, splitArabic } from './MixedText';

describe('splitArabic', () => {
  it('keeps a phrase of several Arabic words as one run', () => {
    expect(splitArabic('No “am”: أَنَا آدَمُ. Easy.')).toEqual([
      { text: 'No “am”: ', arabic: false },
      { text: 'أَنَا آدَمُ', arabic: true },
      { text: '. Easy.', arabic: false },
    ]);
  });

  it('handles text that is all English or all Arabic', () => {
    expect(splitArabic('hello')).toEqual([{ text: 'hello', arabic: false }]);
    expect(splitArabic('كَيْفَ حَالُكَ؟')).toEqual([{ text: 'كَيْفَ حَالُكَ؟', arabic: true }]);
  });
});

describe('MixedText', () => {
  it('marks the Arabic runs with lang and dir', () => {
    render(
      <p>
        <MixedText text="Say شُكْرًا to thank." />
      </p>,
    );
    expect(screen.getByText('شُكْرًا')).toHaveAttribute('lang', 'ar');
    expect(screen.getByText('شُكْرًا')).toHaveAttribute('dir', 'rtl');
  });
});
