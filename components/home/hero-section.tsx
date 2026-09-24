'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

// One tight page-load sequence: short travel, small stagger.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export function HeroSection({ panel }: { panel: React.ReactNode }) {
  return (
    <section className="relative bg-background">
      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8"
        >
          {/* Copy — first in the DOM, so it stays first on mobile. */}
          <div className="lg:col-span-6">
            <motion.p
              variants={item}
              className="flex items-center gap-2 font-mono text-sm text-muted-foreground"
            >
              <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
              reading · components · form challenges
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-5 text-balance text-5xl font-bold leading-[0.98] tracking-[-0.035em] text-foreground sm:text-6xl xl:text-[4.75rem]"
            >
              Learning in public,{' '}
              <span className="text-brand-ink">logged daily.</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              A developer&apos;s study desk: what I&apos;m reading, what I built
              to understand it, and the playgrounds where it gets tested.
            </motion.p>

            <motion.div
              variants={item}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button size="lg" asChild>
                <Link href="/components">
                  Explore components
                  <ArrowRight />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/form-playground">Try form challenges</Link>
              </Button>
            </motion.div>
          </div>

          {/* Public reading-list panel — server-rendered, passed in */}
          <motion.div variants={item} className="lg:col-span-6">
            {panel}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
