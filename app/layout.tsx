import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/providers/theme-provider';

// Geist Sans for everything a human reads, Geist Mono for everything a machine
// produced — the split stays semantic, not decorative. Both are variable fonts,
// so there is no weight list to keep in sync; one file carries every weight.
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
