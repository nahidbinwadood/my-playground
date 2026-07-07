'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Terminal } from './terminal';

// Staggered fade-in for the hero copy.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      {/* Layered futuristic backdrop */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]" />
      {/* Neon glow blobs */}
      <div className="absolute left-1/2 top-[-10%] -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/25 blur-[130px]" />
      <div className="absolute right-[10%] top-[30%] -z-10 h-72 w-72 rounded-full bg-teal-500/20 blur-[110px]" />
      <div className="absolute left-[8%] top-[40%] -z-10 h-64 w-64 rounded-full bg-cyan-500/15 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto max-w-3xl text-center"
        >
          {/* Glowing pill badge */}
          <motion.div variants={item} className="mb-8 flex justify-center">
            <div className="group relative inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-1.5 text-sm backdrop-blur-sm">
              <span className="absolute -inset-px -z-10 rounded-full bg-linear-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 opacity-0 blur transition-opacity group-hover:opacity-100" />
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-muted-foreground">
                Experimenting with modern web technologies
              </span>
            </div>
          </motion.div>

          {/* Gradient headline */}
          <motion.h1
            variants={item}
            className="text-5xl font-bold tracking-tight sm:text-7xl"
          >
            <span className="bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
              Build, Learn, and
            </span>
            <br />
            <span className="bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
              Experiment
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground"
          >
            A modern playground for React components, form validation
            challenges, and best practices. Built with Next.js 16, TypeScript,
            and Tailwind CSS.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex items-center justify-center gap-4"
          >
            {/* Glowing primary CTA */}
            <Button
              size="lg"
              asChild
              className="relative bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_30px_-8px] shadow-emerald-500/60 hover:from-emerald-400 hover:to-teal-500"
            >
              <Link href="/components">
                Explore Components
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-emerald-500/30 bg-background/50 backdrop-blur-sm hover:border-emerald-500/60 hover:bg-emerald-500/5"
            >
              <Link href="/form-playground">Form Challenges</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Terminal centerpiece */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' as const }}
          className="mt-16 sm:mt-24"
        >
          <Terminal />
        </motion.div>
      </div>
    </section>
  );
}
