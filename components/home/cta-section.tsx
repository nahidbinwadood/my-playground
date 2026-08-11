import { Button } from '@/components/ui/button';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from './motion/reveal';

export function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="relative isolate overflow-hidden rounded-3xl border border-emerald-500/20 bg-card px-6 py-20 text-center sm:px-16 sm:py-24">
          {/* Emerald grid backdrop, same language as the hero */}
          <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#10b98112_1px,transparent_1px),linear-gradient(to_bottom,#10b98112_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)]" />
          {/* Soft glow */}
          <div className="absolute left-1/2 top-0 -z-10 h-48 w-lg max-w-full -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />

          <p className="font-mono text-sm text-emerald-600 dark:text-emerald-400">
            {'// start-here'}
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to start building?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Explore the component library or take on a form-validation
            challenge. Everything here is open source.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_30px_-8px] shadow-emerald-500/60 hover:from-emerald-400 hover:to-teal-500"
            >
              <Link href="/components">
                Explore components
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-500/30 bg-background/50 backdrop-blur-sm hover:border-emerald-500/60 hover:bg-emerald-500/5"
              asChild
            >
              <a
                href="https://github.com/nahidbinwadood/my-playground"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
              </a>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
