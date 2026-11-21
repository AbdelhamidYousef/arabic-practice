import { ArabicText } from '../../components/ui/ArabicText';

// Arabic letters (base block, supplement, extended-A, presentation forms), and runs of them joined
// by spaces, so "أَنَا آدَمُ" stays one right-to-left run inside an English sentence.
const ARABIC = '\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFF';
const RUN = new RegExp(`([${ARABIC}]+(?:\\s+[${ARABIC}]+)*)`, 'g');

/** Splits text into English and Arabic parts; the Arabic parts go through ArabicText. */
export function splitArabic(text: string): { text: string; arabic: boolean }[] {
  return text
    .split(RUN)
    .map((part, i) => ({ text: part, arabic: i % 2 === 1 }))
    .filter((part) => part.text !== '');
}

// Content text (grammar notes, culture tips, lesson titles) mixes English with Arabic examples.
// Arabic must always carry lang/dir and the Arabic font (conventions), so each run is wrapped.
// An Arabic run inside an English line keeps the English line height: the tall Arabic line (which
// keeps harakat apart on their own lines) would otherwise push that one line apart from the rest.
const inline = { lineHeight: 1 };

export function MixedText({ text, arabicClassName }: { text: string; arabicClassName?: string }) {
  const parts = splitArabic(text);
  const mixed = parts.length > 1;
  return (
    <>
      {parts.map((part, i) =>
        part.arabic ? (
          <ArabicText key={i} className={arabicClassName} style={mixed ? inline : undefined}>
            {part.text}
          </ArabicText>
        ) : (
          part.text
        ),
      )}
    </>
  );
}
