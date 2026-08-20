import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

// One demo = one specimen panel: a hairline header strip naming the component
// and its source file, then a padded stage where the real component runs.
export function Specimen({
  name,
  source,
  note,
  className,
  children,
}: {
  name: string;
  source: string;
  note?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors duration-200 hover:border-signal/40',
        className
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line bg-surface px-4 py-2.5">
        <h3 className="font-mono text-sm font-medium tracking-tight text-foreground">
          {name}
        </h3>
        {/* Label voice, but the path keeps its real casing and spacing. */}
        <p className="label-mono normal-case! tracking-[0.06em]!">{source}</p>
      </div>

      <div className="relative isolate flex min-h-52 flex-1 items-center justify-center px-4 py-10 sm:px-8 sm:py-12">
        <span
          aria-hidden="true"
          className="dot-grid pointer-events-none absolute inset-0"
        />
        <div className="relative flex w-full flex-col items-center">
          {children}
        </div>
      </div>

      {note ? (
        <p className="border-t border-line px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          {note}
        </p>
      ) : null}
    </div>
  );
}

// Small mono/uppercase pill used inside demos to label a state. The colour
// lives in the dot, so the text itself always keeps foreground contrast.
export function SpecimenTag({
  tone,
  children,
}: {
  tone: 'signal' | 'warn' | 'fail' | 'neutral';
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-foreground">
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full',
          tone === 'signal' && 'bg-signal',
          tone === 'warn' && 'bg-warn',
          tone === 'fail' && 'bg-fail',
          tone === 'neutral' && 'bg-muted-foreground'
        )}
      />
      {children}
    </span>
  );
}
