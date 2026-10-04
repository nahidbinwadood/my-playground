'use client';

import { useEffect } from 'react';
import './globals.css';

// Replaces the root layout when it throws, so it cannot rely on the layout's
// fonts, theme provider or components — keep it to plain markup and tokens.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="flex min-h-svh items-center justify-center bg-background px-5 font-sans text-foreground antialiased">
        <main className="w-full max-w-md">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            The site failed to load. Try again, or come back shortly.
          </p>
          <div className="mt-6 flex gap-4 text-sm">
            <button
              type="button"
              onClick={reset}
              className="rounded-sm bg-primary px-3 py-1.5 font-medium text-primary-foreground"
            >
              Try again
            </button>
            {/* A plain anchor: a full reload is what we want after a root failure. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="px-1 py-1.5 text-muted-foreground">
              Home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
