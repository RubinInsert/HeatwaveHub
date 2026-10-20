import type { Config } from 'tailwindcss';

/**
 * Heatwave Hub brand tokens.
 * Source: Heatwave Hub Brand Guidelines (2026) - colour palette (p.04) and typography (p.05).
 *
 * Typography: Arial / Regular - Medium - Bold. Arial is a system face, so it is
 * referenced through a font stack rather than a downloadable webfont.
 *
 * Type scale: the guidelines are specified in print points, so each token scales
 * fluidly and reaches the guideline range at desktop widths.
 *   H1 72-96 pt -> 96-128 px  (text-display caps at 96 px / 72 pt)
 *   H2 28-36 pt -> 37-48 px   (text-heading caps at 48 px / 36 pt)
 *   Body 18-24 pt -> 24-32 px (text-body / text-body-lg cap at 24 px / 32 px)
 */
const arialStack = [
  'Arial',
  'Helvetica Neue',
  'Helvetica',
  'Liberation Sans',
  'sans-serif',
];

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
      },
      colors: {
        blue: {
          400: '#2589FE',
          500: '#0070F3',
          600: '#2F6FEB',
        },
        /**
         * Approved brand palette. Suggested distribution:
         * Midnight 25%, Cream 30%, Indigo 15%, Denim Blue 12%,
         * Turquoise 8%, Golden Yellow 5%, Coral Orange 5%.
         */
        brand: {
          midnight: '#0F161A',
          cream: '#EFE3BE',
          indigo: '#33365C',
          denim: '#2A5A8C',
          turquoise: '#1AC5C5',
          golden: '#FFC63E',
          coral: '#FF5C32',
        },
      },
      fontFamily: {
        sans: arialStack,
        arial: arialStack,
      },
      fontSize: {
        // Heading 01: 72-96 pt at desktop
        display: [
          'clamp(2.5rem, 6vw, 6rem)',
          { lineHeight: '1.05', letterSpacing: '-0.02em' },
        ],
        // Subheading 02: 28-36 pt at desktop
        heading: [
          'clamp(1.75rem, 3.2vw, 3rem)',
          { lineHeight: '1.15', letterSpacing: '-0.01em' },
        ],
        subheading: [
          'clamp(1.375rem, 2.2vw, 2rem)',
          { lineHeight: '1.3', letterSpacing: '-0.005em' },
        ],
        // Body 03: 18-24 pt at desktop
        'body-lg': ['clamp(1.25rem, 2vw, 2rem)', { lineHeight: '1.5' }],
        body: ['clamp(1.125rem, 1.5vw, 1.5rem)', { lineHeight: '1.6' }],
        label: [
          'clamp(0.875rem, 1vw, 1.125rem)',
          { lineHeight: '1.4', letterSpacing: '0.08em' },
        ],
      },
      maxWidth: {
        // Short line lengths for comfortable reading
        measure: '62ch',
        'measure-tight': '46ch',
      },
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
