'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ValidationConsole } from './validation-console';

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

export function HeroSection() {
  return (
    <section className="relative border-b border-line bg-background">
      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-8"
        >
          {/* Copy — first in the DOM, so it stays first on mobile. */}
          <div className="lg:col-span-5">
            <motion.p variants={item} className="eyebrow">
              UI components + form validation
            </motion.p>

            <motion.h1
              variants={item}
              className="mt-5 text-balance text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl xl:text-[3.5rem] xl:leading-[1.05]"
            >
              Components and validation edge cases,{' '}
              <span className="text-gradient-signal">left running</span>.
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              This is where UI components get built and form validation gets
              pushed until it breaks. Nothing here is a screenshot — the console
              parses every keystroke against a real Zod schema.
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
              <Button size="lg" variant="outline" asChild>
                <Link href="/form-playground">Try form challenges</Link>
              </Button>
            </motion.div>
          </div>

          {/* Live console — the page's one loud element. */}
          <motion.div
            variants={item}
            className="lg:col-span-7 lg:-mr-4 lg:-mt-6 xl:-mr-10"
          >
            <ValidationConsole />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
