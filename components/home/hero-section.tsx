import { Button } from '@/components/ui/button';
import { ArrowRight, Code2 } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 ring-1 ring-foreground/10 hover:ring-foreground/20 transition-all">
              <span className="text-muted-foreground">
                Experimenting with modern web technologies
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
            Build, Learn, and Experiment
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            A modern playground for React components, form validation
            challenges, and best practices. Built with Next.js 15, TypeScript,
            and Tailwind CSS.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button size="lg" asChild>
              <Link href="/components">
                Explore Components
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/form-playground">Form Challenges</Link>
            </Button>
          </div>
        </div>
        <div className="mt-16 flow-root sm:mt-24">
          <div className="relative rounded-xl bg-muted/50 p-2 ring-1 ring-inset ring-foreground/10 lg:rounded-2xl lg:p-4">
            <div className="aspect-video rounded-md bg-background shadow-2xl ring-1 ring-foreground/10 flex items-center justify-center">
              <Code2 className="h-24 w-24 text-muted-foreground/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
