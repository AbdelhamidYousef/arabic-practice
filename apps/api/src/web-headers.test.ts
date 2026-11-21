import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

// The web app's security headers live in apps/web/vercel.json, which only Vercel reads. This pins
// them so nobody loosens one by accident: the policy was checked against the real Vite build
// (no inline script, no external host, same-origin API, bundled fonts).
interface VercelConfig {
  headers: { source: string; headers: { key: string; value: string }[] }[];
}
const config = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../web/vercel.json', import.meta.url)), 'utf8'),
) as VercelConfig;
const rule = config.headers.find((h) => h.source === '/(.*)');
const header = (key: string) => rule?.headers.find((h) => h.key === key)?.value;

describe('apps/web/vercel.json security headers', () => {
  it('applies to every path', () => {
    expect(rule).toBeDefined();
  });

  it('sends a strict Content-Security-Policy', () => {
    const csp = header('Content-Security-Policy') ?? '';
    const directives = Object.fromEntries(
      csp.split(';').map((d) => {
        const [name, ...values] = d.trim().split(/\s+/);
        return [name, values];
      }),
    ) as Record<string, string[]>;
    expect(directives['default-src']).toEqual(["'self'"]);
    expect(directives['script-src']).toEqual(["'self'"]);
    expect(directives['connect-src']).toEqual(["'self'"]);
    expect(directives['frame-ancestors']).toEqual(["'none'"]);
    expect(directives['base-uri']).toEqual(["'self'"]);
    expect(directives['form-action']).toEqual(["'self'"]);
    expect(csp).not.toMatch(/unsafe-eval|\*|http:/);
  });

  it('sends the other three headers', () => {
    expect(header('X-Content-Type-Options')).toBe('nosniff');
    expect(header('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(header('Permissions-Policy')).toBe('camera=(), microphone=(), geolocation=()');
  });
});
