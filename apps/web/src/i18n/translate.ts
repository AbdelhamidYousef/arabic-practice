import type { Dictionary, Entry, Params, PluralForms } from './types';

// Fills `{name}` markers. An unknown marker is left as written, so a typo is visible, not blank.
export function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in params ? String(params[name]) : whole,
  );
}

// `Intl.PluralRules` knows each language's forms (English has two; Arabic has six), so a later
// language only adds the forms it needs to the dictionary.
export function pickPlural(forms: PluralForms, count: number, locale = 'en'): string {
  if (count === 0 && forms.zero !== undefined) return forms.zero;
  return new Intl.PluralRules(locale).select(count) === 'one' ? forms.one : forms.other;
}

export function makeLookup(dictionary: Dictionary, locale = 'en') {
  const find = (key: string): Entry => dictionary[key] ?? key;
  return {
    t: (key: string, params?: Params): string => {
      const entry = find(key);
      return interpolate(typeof entry === 'string' ? entry : entry.other, params);
    },
    tn: (key: string, count: number, params?: Params): string => {
      const entry = find(key);
      const template = typeof entry === 'string' ? entry : pickPlural(entry, count, locale);
      return interpolate(template, { count, ...params });
    },
  };
}
