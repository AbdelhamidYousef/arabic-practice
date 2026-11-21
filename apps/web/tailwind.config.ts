import type { Config } from 'tailwindcss';

// Tailwind only names the tokens; the values live in src/styles/ as CSS variables (design system,
// phase 7). Until then the default theme is enough.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
} satisfies Config;
