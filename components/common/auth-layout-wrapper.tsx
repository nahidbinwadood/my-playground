import { Logo } from '@/app/(auth)/auth/login/_components/logo';
import Link from 'next/link';
import React from 'react';
import { Button } from '../ui/button';

const AuthLayoutWrapper = ({
  formComponent,
  authType = 'login',
}: {
  formComponent: React.ReactNode;
  authType: 'login' | 'signup';
}) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto w-full border border-border/70 pb-0 max-sm:border-t-0 sm:max-w-md sm:rounded-xl sm:bg-card sm:p-1 sm:shadow-lg/3 relative">
        {' '}
        <Button variant="ghost" asChild className="absolute left-3 top-3">
          <Link href="/">← Back</Link>
        </Button>
        <div className="border border-border/70 bg-muted/60 px-10 py-14 max-sm:border-x-0 sm:rounded-lg sm:shadow-sm/2">
          <Logo className="mx-auto size-9" />
          <h1 className="mt-3 text-center font-semibold text-2xl tracking-[-0.015em]">
            {authType == 'login' ? 'Login' : 'Signup'} to My Playground
          </h1>

          <div className="mt-10">{formComponent}</div>
        </div>
        <div className="relative py-5">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `
        linear-gradient(45deg, transparent 49%, var(--border) 49%, var(--border) 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, var(--border) 49%, var(--border) 51%, transparent 51%)
      `,
              backgroundSize: '40px 40px',
              WebkitMaskImage:
                'radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 90%)',
              maskImage:
                'radial-gradient(ellipse 60% 60% at 50% 50%, #000 10%, transparent 90%)',
            }}
          />

          <p className="relative isolate text-center text-sm">
            {authType === 'login' ? "Don't" : 'Already'} Have An Account?{' '}
            <Link
              className="text-muted-foreground underline"
              href={authType === 'login' ? '/auth/signup' : '/auth/login'}
            >
              {authType === 'login' ? 'Create an account' : 'Login'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayoutWrapper;
