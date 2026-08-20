import { Button } from '@/components/ui/button';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from './motion/reveal';

export function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal className="relative isolate overflow-hidden rounded-lg border border-line bg-surface">
          {/* Dot texture, anchored top-left and masked so it fades out
              well before the copy and the buttons. */}
          <div
            aria-hidden="true"
            className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(90%_90%_at_8%_0%,black,transparent_70%)]"
          />

          <div className="relative flex flex-col gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:flex-row lg:items-end lg:justify-between lg:gap-16 lg:px-14 lg:py-16">
            <div className="max-w-xl">
              <p className="label-mono">/components</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Open a component, or read the source
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Every component on this site renders live, every form validates
                for real, and the whole project is on GitHub.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link href="/components">
                  Browse components
                  <ArrowRight />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="w-full text-muted-foreground hover:text-foreground sm:w-auto"
              >
                <a
                  href="https://github.com/nahidbinwadood/my-playground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github />
                  Read the source
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
