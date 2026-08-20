import { cn } from '@/lib/utils';
import { ArrowRight, Blocks, FileText, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from './motion/reveal';

// Each card is a real destination on the site, not an abstract feature.
// `route` is the actual path the card links to — keep the two in sync.
const destinations = [
  {
    icon: Blocks,
    route: '/components',
    title: 'UI components',
    description:
      'Preview each component as it really renders, then copy the code that produced it.',
    action: 'Browse components',
    href: '/components',
  },
  {
    icon: ListChecks,
    route: '/form-playground',
    title: 'Form challenges',
    description:
      'Work through validation scenarios built with React Hook Form and Zod, and watch every error state fire.',
    action: 'Start a challenge',
    href: '/form-playground',
  },
  {
    icon: FileText,
    route: '/blogs',
    title: 'Dev blog',
    description:
      'Read write-ups on frontend, backend, and JavaScript, filtered by topic.',
    action: 'Read the posts',
    href: '/blogs',
  },
];

export function FeaturesSection() {
  return (
    <section
      aria-labelledby="destinations-heading"
      className="py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="label-mono">
            /components &middot; /form-playground &middot; /blogs
          </p>
          <h2
            id="destinations-heading"
            className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            What runs here
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Three routes. Each one is a working page — open it and the code
            runs.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {destinations.map((destination, i) => (
            <Reveal
              key={destination.route}
              delay={i * 0.06}
              className={cn(
                // The last card fills the empty column in the 2-up layout.
                i === destinations.length - 1 && 'sm:col-span-2 lg:col-span-1'
              )}
            >
              <Link
                href={destination.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-[border-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-signal/40 sm:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="label-mono">{destination.route}</span>
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground transition-colors duration-300 group-hover:text-foreground"
                  >
                    <destination.icon className="size-4" strokeWidth={1.75} />
                  </span>
                </div>

                <h3 className="mt-6 font-sans text-base font-semibold">
                  {destination.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {destination.description}
                </p>

                <span className="mt-auto flex items-center gap-2 pt-6 font-mono text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                  {destination.action}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
