import type { Metadata } from 'next';
import { Bricolage_Grotesque, DM_Mono, Hanken_Grotesk } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/providers/theme-provider';

// Bricolage for headings and big figures, Hanken for everything a person
// reads, DM Mono for what a machine produced (dates, counts, paths).
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display-src',
  display: 'swap',
});

const sans = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans-src',
  display: 'swap',
});

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono-src',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DevPlayground — React UI, forms, and notes',
  description:
    'Component demos, form validation challenges, and notes on building with Next.js 16, TypeScript, and Tailwind CSS. Everything on this site runs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
