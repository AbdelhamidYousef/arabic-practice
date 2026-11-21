import { useEffect } from 'react';

import { t } from '../i18n';

interface SeoProps {
  title: string;
  description?: string;
  noindex?: boolean;
}

function upsertMeta(name: string): HTMLMetaElement {
  const existing = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (existing) return existing;
  const el = document.createElement('meta');
  el.setAttribute('name', name);
  document.head.appendChild(el);
  return el;
}

// Sets <title>, the meta description and robots through the DOM in an effect: a few lines instead
// of a dependency. It puts the page name first so a tab or a screen reader says where you are.
export function Seo({ title, description, noindex }: SeoProps) {
  useEffect(() => {
    const previous = document.title;
    const site = t('app.name');
    document.title = title === site ? site : `${title} | ${site}`;
    return () => {
      document.title = previous;
    };
  }, [title]);

  useEffect(() => {
    if (!description) return;
    const meta = upsertMeta('description');
    const previous = meta.getAttribute('content');
    meta.setAttribute('content', description);
    return () => {
      if (previous === null) meta.remove();
      else meta.setAttribute('content', previous);
    };
  }, [description]);

  useEffect(() => {
    if (!noindex) return;
    const meta = upsertMeta('robots');
    meta.setAttribute('content', 'noindex');
    return () => meta.remove();
  }, [noindex]);

  return null;
}
