import { Inter } from 'next/font/google';

export const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true,
  fallback: ['system-ui','Segoe UI','Roboto','Helvetica','Arial','sans-serif'],
  preload: true,
  weight: ['400','500','600','700'],
  variable: '--font-sans',
});

export const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true,
  fallback: ['system-ui','Segoe UI','Roboto','Helvetica','Arial','sans-serif'],
  preload: true,
  weight: ['700'],
  variable: '--font-heading',
});

// compat: quem ainda importar `inter` continua a funcionar
export const inter = fontSans;
