import type { Config } from 'tailwindcss';

// Tailwind only names the tokens; the values live in src/styles/tokens.css.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        line: 'var(--color-border)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          soft: 'var(--color-primary-soft)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          soft: 'var(--color-accent-soft)',
          strong: 'var(--color-accent-strong)',
        },
        success: { DEFAULT: 'var(--color-success)', soft: 'var(--color-success-soft)' },
        danger: { DEFAULT: 'var(--color-danger)', soft: 'var(--color-danger-soft)' },
      },
      borderRadius: { DEFAULT: 'var(--radius)', ui: 'var(--radius)' },
      boxShadow: { card: 'var(--shadow-card)' },
      fontFamily: { sans: ['var(--font-ui)'], arabic: ['var(--font-arabic)'] },
    },
  },
  plugins: [],
} satisfies Config;
