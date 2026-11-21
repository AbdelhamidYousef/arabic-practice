const MAX_BASE_LENGTH = 80;

// A Latin title becomes kebab-case ("Ordering at a Café" -> "ordering-at-a-cafe"): accents are
// folded away, everything that is not a letter or digit becomes one hyphen. An Arabic-only title
// has nothing left, so the caller falls back to `lesson-<short id>`.
export function slugBase(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_BASE_LENGTH)
    .replace(/-+$/g, '');
}

export function baseSlugFor(title: string, id: string): string {
  return slugBase(title) || `lesson-${id.slice(0, 8)}`;
}

// The first of `base`, `base-2`, `base-3`... that is not in `taken`. Only a hint: the unique index
// is what really decides, and the caller retries when two requests pick the same name.
export function firstFreeSlug(base: string, taken: ReadonlySet<string>): string {
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    const candidate = `${base}-${n}`;
    if (!taken.has(candidate)) return candidate;
  }
}
