import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/sonner';
import React from 'react';
import { Providers } from '@/components/providers/theme-provider';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <div className="flex min-h-screen flex-col">
        <Toaster />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </Providers>
  );
};

export default RootLayout;
