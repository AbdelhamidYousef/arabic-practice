import { en } from './en';
import { makeLookup } from './translate';
import type { Params, PluralForms } from './types';

export type { Dictionary, Entry, Params, PluralForms } from './types';
export { en };

export type Key = keyof typeof en;
// `t` takes keys whose entry is a string, `tn` the ones with plural forms: the compiler stops a
// plural key being used as plain text (or the other way round).
export type StringKey = { [K in Key]: (typeof en)[K] extends string ? K : never }[Key];
export type PluralKey = { [K in Key]: (typeof en)[K] extends PluralForms ? K : never }[Key];

export type TFunction = (key: StringKey, params?: Params) => string;
export type TnFunction = (key: PluralKey, count: number, params?: Params) => string;

const lookup = makeLookup(en, 'en');

/** `t('nav.lessons')`, `tn('count.lessons', 3)`. A plain function so non-React code can use it. */
export const t = lookup.t as TFunction;
export const tn = lookup.tn as TnFunction;

/**
 * The hook components call. Today it returns the same functions every time (English only); it
 * exists so that adding a language later changes this one file, not every component.
 */
export function useT(): { t: TFunction; tn: TnFunction } {
  return { t, tn };
}
