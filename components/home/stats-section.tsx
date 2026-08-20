import { cn } from '@/lib/utils';
import blogs from '../../app/(homepage)/blogs/data/blogs.json';
import { CountUp } from './motion/count-up';
import { Reveal } from './motion/reveal';

// Datasheet rows. Every figure is counted from what is actually in this repo:
// 5 previews registered in the showcase page, 9 of the 19 specified challenges
// have a working form, the blog seed length, and the shadcn primitives folder.
const entries = [
  { label: 'Components', value: 5, source: '/components' },
  { label: 'Working forms', value: 9, source: '/form-playground' },
  { label: 'Blog posts', value: blogs.length, source: '/blogs' },
  { label: 'UI primitives', value: 46, source: 'components/ui' },
];

// Hairline ruling only — no cards. Mobile is a 2x2 grid ruled on both axes;
// from md it collapses into one continuous ruled row. The first cell in each
// row keeps its left edge flush with the section margin, the last its right.
// Sides are set individually rather than with `px-*`, so the flush edges
// survive the md override.
function cellClass(i: number) {
  return cn(
    'border-line py-8 md:py-10',
    i % 2 === 0 ? 'pr-4' : 'border-l pl-4',
    i > 1 && 'border-t',
    i > 0 ? 'md:border-l md:pl-6' : 'md:pl-0',
    i < 3 ? 'md:pr-6' : 'md:pr-0',
    'md:border-t-0'
  );
}

export function StatsSection() {
  return (
    <section aria-labelledby="stats-heading" className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
            <h2 id="stats-heading" className="label-mono">
              Contents
            </h2>
            <p className="label-mono">Counted from source</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 border-b border-line md:grid-cols-4">
          {entries.map((entry, i) => (
            <div key={entry.label} className={cellClass(i)}>
              <Reveal delay={i * 0.06}>
                <p className="label-mono">{entry.label}</p>
                <p className="mt-3 font-mono text-4xl font-semibold tabular-nums tracking-[-0.03em] text-foreground sm:text-5xl">
                  <CountUp value={entry.value} />
                </p>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {entry.source}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
