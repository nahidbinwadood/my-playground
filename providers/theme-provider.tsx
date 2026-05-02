'use client';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster />
      {children}
    </NextThemeProvider>
  );
};

export default ThemeProvider;
