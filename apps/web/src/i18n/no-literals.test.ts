import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, it } from 'vitest';

// A guard, not a parser: flags JSX text and common text props written as English literals.
// Everything the user reads must go through `t()`.
const ROOT = join(import.meta.dirname, '..');
const SKIP = ['i18n/'];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.tsx$/.test(name) && !/\.test\.tsx$/.test(name) ? [path] : [];
  });
}

// Text between tags on one line (`>Hello there<`), or a line that is nothing but words (the way
// Prettier leaves JSX text when it wraps). Generics (`Promise<unknown>;`) are not text.
const INLINE_TEXT = />\s*[A-Z][a-z]+[^<>{}=;]*[a-z.!?]\s*</;
const OWN_LINE_TEXT =
  /^\s*(?!(?:case|return|export|import|const|let|type|interface|default|else)\b)[A-Za-z][A-Za-z’,.!?-]*(\s+[A-Za-z’,.!?-]+)+\s*$/;
const TEXT_PROP = /\b(aria-label|title|placeholder|label|alt|hint)="[A-Za-z][^"]*"/;
const ALLOWED = /Promise<|="[a-z]+\.[a-zA-Z.]+"/;

export function findLiteral(line: string): boolean {
  if (/^\s*(\/\/|\*|\/\*|\{\/\*)/.test(line)) return false;
  if (ALLOWED.test(line)) return false;
  return INLINE_TEXT.test(line) || OWN_LINE_TEXT.test(line) || TEXT_PROP.test(line);
}

describe('the literal-text matcher', () => {
  it('flags English written into JSX', () => {
    expect(findLiteral('<p>Welcome back to class</p>')).toBe(true);
    expect(findLiteral('  Welcome back to class')).toBe(true);
    expect(findLiteral('<img alt="A teacher" />')).toBe(true);
    expect(findLiteral('<button aria-label="Close">')).toBe(true);
  });

  it('lets code, keys and comments through', () => {
    expect(findLiteral("<p>{t('home.title')}</p>")).toBe(false);
    expect(findLiteral("<button aria-label={t('shell.close')}>")).toBe(false);
    expect(findLiteral('  // Welcome back to class')).toBe(false);
    expect(findLiteral('const x: Promise<unknown>;')).toBe(false);
    expect(findLiteral('  return null;')).toBe(false);
  });
});

describe('ui strings', () => {
  it('has no hard-coded English in JSX', () => {
    const hits: string[] = [];
    for (const file of walk(ROOT)) {
      const rel = relative(ROOT, file);
      if (SKIP.some((s) => rel.includes(s))) continue;
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          if (findLiteral(line)) hits.push(`${rel}:${i + 1}: ${line.trim()}`);
        });
    }
    expect(hits).toEqual([]);
  });
});
