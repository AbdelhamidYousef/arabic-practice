// A dictionary entry is a plain string or a set of plural forms. `{name}` marks a value filled in
// at runtime; there is no markup in a string (bold text or a link is a component around `t()`).
export interface PluralForms {
  /** Used for a count of exactly 0 when the wording differs ("No items"). */
  zero?: string;
  one: string;
  other: string;
}
export type Entry = string | PluralForms;
export type Dictionary = Record<string, Entry>;
export type Params = Record<string, string | number>;
