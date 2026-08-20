import { Logo } from '@/app/(auth)/auth/login/_components/logo';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const AUTH_COPY = {
  login: {
    route: '/auth/login',
    heading: 'Sign in',
    lead: 'Use your admin credentials to reach the dashboard.',
    prompt: 'Need an account?',
    linkLabel: 'Create one',
    linkHref: '/auth/signup',
  },
  signup: {
    route: '/auth/signup',
    heading: 'Create account',
    lead: 'This form runs the same validation rules as the rest of the playground.',
    prompt: 'Already have an account?',
    linkLabel: 'Sign in',
    linkHref: '/auth/login',
  },
} as const;

const AuthLayoutWrapper = ({
  formComponent,
  authType = 'login',
}: {
  formComponent: React.ReactNode;
  authType: 'login' | 'signup';
}) => {
  const copy = AUTH_COPY[authType];

  return (
    <div className="min-h-svh lg:grid lg:grid-cols-2">
      {/* Form column */}
      <div className="flex min-h-svh flex-col px-5 py-6 sm:px-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-md font-mono text-xs tracking-tight text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          Back to site
        </Link>

        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">
            {/* Wordmark — shown here only when the side panel is hidden */}
            <div className="mb-10 flex items-center gap-2.5 lg:hidden">
              <Logo className="size-6 shrink-0 text-foreground" />
              <span className="font-mono text-[0.9375rem] font-semibold tracking-[-0.03em] text-foreground">
                DevPlayground
              </span>
            </div>

            <p className="label-mono">{copy.route}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              {copy.heading}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {copy.lead}
            </p>

            <div className="mt-8">{formComponent}</div>

            <div className="mt-8 border-t border-line pt-5">
              <p className="text-sm text-muted-foreground">
                {copy.prompt}{' '}
                <Link
                  href={copy.linkHref}
                  className="rounded-sm font-medium text-foreground underline decoration-line underline-offset-4 transition-colors hover:decoration-foreground"
                >
                  {copy.linkLabel}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quiet side panel */}
      <aside className="relative hidden overflow-hidden border-l border-line bg-surface lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="dot-grid pointer-events-none absolute inset-0"
          style={{
            WebkitMaskImage:
              'radial-gradient(ellipse 75% 60% at 50% 45%, black 0%, transparent 80%)',
            maskImage:
              'radial-gradient(ellipse 75% 60% at 50% 45%, black 0%, transparent 80%)',
          }}
        />

        <div className="relative flex items-center gap-3">
          <Logo className="size-7 shrink-0 text-foreground" />
          <span className="font-mono text-[0.9375rem] font-semibold tracking-[-0.03em] text-foreground">
            DevPlayground
          </span>
        </div>

        <div className="relative max-w-md">
          <p className="label-mono">/admin</p>
          <p className="mt-4 font-mono text-lg leading-relaxed tracking-[-0.02em] text-foreground">
            The admin area is where blog posts get drafted, edited, and
            published — every other page on this site is open to anyone.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default AuthLayoutWrapper;
