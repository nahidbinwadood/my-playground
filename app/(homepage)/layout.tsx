import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import React from 'react';

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Header />
      <main className="flex-1 min-w-0">{children}</main>
      <Footer />
    </div>
  );
};

export default RootLayout;
