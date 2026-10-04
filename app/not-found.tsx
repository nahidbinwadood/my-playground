import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Page not found — DevPlayground',
};

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/notes', label: 'Notes' },
] as const;

export default function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-5 py-16">
      <div className="w-full max-w-md rounded-xl border border-line bg-card p-8">
        <p className="label-mono">404</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          This page does not exist, or it has not been published yet.
        </p>

        <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-5">
          {LINKS.map((link) => (
            <Button key={link.href} variant="outline" size="sm" asChild>
              <Link href={link.href}>
                {link.label}
                <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
