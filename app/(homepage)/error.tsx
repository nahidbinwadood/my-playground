'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomepageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Server errors arrive here with only a digest; logging it lets the owner
    // match the browser report to the server log line.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60svh] items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-xl border border-line bg-card p-8">
        <p className="label-mono">error</p>
        <h1 className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This page failed to load. The backend may be waking up — try again
          in a moment.
        </p>
        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            ref {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-5">
          <Button size="sm" onClick={reset}>
            <RotateCcw aria-hidden="true" className="size-3.5" />
            Try again
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
