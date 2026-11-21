import { Link } from 'react-router-dom';

import { useT } from '../../i18n';

// The mark is the letter ع (ʿayn), the first letter of عَرَبِيّ "Arabic": a sound learners meet early
// and remember. It is decoration next to the name, so screen readers hear only the name.
export function Logo() {
  const { t } = useT();
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2.5 rounded-ui text-lg font-semibold text-ink"
    >
      <span
        aria-hidden="true"
        className="arabic inline-flex size-9 items-center justify-center rounded-xl bg-primary leading-none text-surface"
      >
        ع
      </span>
      {t('app.name')}
    </Link>
  );
}
