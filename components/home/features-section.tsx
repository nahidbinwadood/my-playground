import { Blocks, FileText, Layers, ListChecks } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from './motion/reveal';

// Each feature links to a section of the playground.
const features = [
  {
    icon: Blocks,
    title: 'UI Components',
    description: 'Browse reusable React components with live previews and copy-ready code.',
    href: '/components',
  },
  {
    icon: ListChecks,
    title: 'Form Challenges',
    description: 'Real-world form validation scenarios built with React Hook Form and Zod.',
    href: '/form-playground',
  },
  {
    icon: FileText,
    title: 'Dev Blog',
    description: 'Notes and deep-dives on frontend, backend, and JavaScript topics.',
    href: '/blogs',
  },
  {
    icon: Layers,
    title: 'Modern Stack',
    description: 'Next.js 16, TypeScript, Tailwind 4, and shadcn/ui — best practices throughout.',
    href: '/components',
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Ambient grid + glow backdrop */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-size-[36px_36px] mask-[radial-gradient(ellipse_70%_60%_at_50%_50%,black,transparent)]" />
      <div className="absolute left-1/2 top-1/2 -z-10 h-96 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-4 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-500 backdrop-blur-sm">
            What&apos;s inside
          </span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything a developer needs
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            One playground to explore, learn, and ship faster.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.1}>
              <Link href={feature.href} className="group block h-full">
                {/* Gradient-border glass card with neon hover glow */}
                <div className="relative h-full rounded-2xl bg-linear-to-br from-white/10 to-white/0 p-px transition-all duration-300 group-hover:from-emerald-500/50 group-hover:to-teal-500/20">
                  {/* Glow */}
                  <div className="absolute -inset-1 -z-10 rounded-2xl bg-emerald-500/0 blur-lg transition-all duration-300 group-hover:bg-emerald-500/20" />
                  <div className="flex h-full flex-col rounded-2xl border border-border/50 bg-card/60 p-6 backdrop-blur-xl transition-transform duration-300 group-hover:-translate-y-1">
                    {/* Neon icon tile */}
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shadow-[0_0_20px_-6px] shadow-emerald-500/0 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-emerald-500/70">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
