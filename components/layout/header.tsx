'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Code2, Github, Menu, X } from 'lucide-react';
import { AnimatePresence, motion, useScroll } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ThemeToggler from '../common/theme-toggler';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Blogs', href: '/blogs' },
  { name: 'Components', href: '/components' },
  { name: 'Form Playground', href: '/form-playground' },
];

const MOBILE_PANEL_ID = 'site-nav-mobile';

export function Header() {
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();

  // The open state is keyed to the route it was opened on, so navigating
  // anywhere — including via back/forward — closes the panel on its own.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const mobileMenuOpen = openPath === pathname;
  const setMobileMenuOpen = (next: boolean | ((open: boolean) => boolean)) => {
    const open = typeof next === 'function' ? next(mobileMenuOpen) : next;
    setOpenPath(open ? pathname : null);
  };

  const findIsActive = (pathname: string, href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-background/85 backdrop-blur-md supports-backdrop-filter:bg-background/65">
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 w-full max-w-7xl items-center gap-4 px-5 sm:px-8"
      >
        {/* Wordmark — monospace logotype in a bordered plate */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5 rounded-sm"
        >
          <span
            aria-hidden="true"
            className="grid size-7 shrink-0 place-items-center rounded-sm border border-line bg-surface text-foreground transition-colors group-hover:border-signal/40"
          >
            <Code2 className="size-4" />
          </span>
          <span className="font-mono text-[0.9375rem] font-semibold tracking-[-0.03em] text-foreground">
            DevPlayground
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="mx-auto hidden items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const isActive = findIsActive(pathname, item.href);
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'relative flex items-center rounded-sm px-3 py-2 font-mono text-[0.8125rem] tracking-tight transition-colors',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="header-nav-active"
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-signal"
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-1.5 lg:flex">
          {/* theme toggler */}
          <ThemeToggler />

          <Button variant="outline" size="icon-sm" asChild>
            <Link
              href="https://github.com/nahidbinwadood/my-playground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github aria-hidden="true" />
              <span className="sr-only">Source on GitHub</span>
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link
              href="/auth/login"
              rel="noopener noreferrer"
              className="font-mono text-xs"
            >
              Login
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-controls={MOBILE_PANEL_ID}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          className="ml-auto inline-flex size-9 items-center justify-center rounded-sm border border-line bg-surface text-foreground transition-colors hover:border-border hover:bg-accent lg:hidden"
        >
          {mobileMenuOpen ? (
            <X className="size-4" aria-hidden="true" />
          ) : (
            <Menu className="size-4" aria-hidden="true" />
          )}
        </button>
      </nav>

      {/* Mobile panel — animated disclosure */}
      <div id={MOBILE_PANEL_ID} className="lg:hidden">
        <AnimatePresence initial={false}>
          {mobileMenuOpen && (
            <motion.div
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="overflow-hidden border-t border-line"
            >
              <div className="mx-auto w-full max-w-7xl px-5 pb-4 pt-3 sm:px-8">
                <ul className="flex flex-col gap-0.5">
                  {navigation.map((item) => {
                    const isActive = findIsActive(pathname, item.href);
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          aria-current={isActive ? 'page' : undefined}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center justify-between gap-3 rounded-sm px-3 py-2.5 font-mono text-sm transition-colors',
                            isActive
                              ? 'bg-surface text-foreground'
                              : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                          )}
                        >
                          <span>{item.name}</span>
                          <span
                            aria-hidden="true"
                            className="font-mono text-[0.625rem] tracking-[0.18em] text-muted-foreground"
                          >
                            {item.href}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3">
                  {/* theme toggler */}
                  <ThemeToggler />

                  <Button variant="outline" size="icon-sm" asChild>
                    <Link
                      href="https://github.com/nahidbinwadood/my-playground"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github aria-hidden="true" />
                      <span className="sr-only">Source on GitHub</span>
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto"
                    asChild
                  >
                    <Link
                      href="/auth/login"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-mono text-xs"
                    >
                      Login
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Read-position rail on the header's bottom edge */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-signal/40"
      />
    </header>
  );
}
