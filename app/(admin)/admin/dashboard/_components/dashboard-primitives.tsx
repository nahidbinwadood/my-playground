import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Fixed in UTC so the server render is deterministic and the numbers do not
// drift between requests.
const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (value?: string) =>
  value ? dateFmt.format(new Date(value)) : '—';

export const unknown = '—';

// Panels are the shell for every region below the journal: a title strip in the
// reading voice, with machine values (counts, dates) set in mono.
export const Panel = ({
  label,
  meta,
  action,
  className,
  children,
}: {
  label: string;
  meta?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) => (
  <section
    className={cn(
      'flex flex-col overflow-hidden rounded-[14px] bg-surface',
      className
    )}
  >
    <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
      <h2 className="text-sm font-semibold tracking-tight">{label}</h2>
      <div className="flex shrink-0 items-center gap-2">
        {meta ? <Meta>{meta}</Meta> : null}
        {action}
      </div>
    </header>
    <div className="flex-1">{children}</div>
  </section>
);

// A counted value in a title strip. Mono because a machine produced it, in a
// well so it reads as a reading rather than a word in the sentence.
export const Meta = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full bg-muted px-2.5 py-1 font-mono text-[0.6875rem] tabular-nums text-muted-foreground">
    {children}
  </span>
);

// A panel's action is a control, so it is shaped like one — a quiet ghost
// button that fills on hover. Underlines belong to prose.
export const PanelAction = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Button
    asChild
    variant="ghost"
    size="sm"
    className="-mr-1.5 h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
  >
    <Link href={href}>{children}</Link>
  </Button>
);

// Empty states say what to do next, in the interface's voice.
export const EmptyRegion = ({
  title,
  hint,
  href,
  cta,
}: {
  title: string;
  hint: string;
  href?: string;
  cta?: string;
}) => (
  <div className="flex h-full flex-col items-center justify-center gap-1.5 px-5 py-12 text-center">
    <p className="text-sm font-medium">{title}</p>
    <p className="max-w-sm text-sm text-muted-foreground">{hint}</p>
    {href && cta ? (
      <Button asChild variant="outline" size="sm" className="mt-3">
        <Link href={href}>{cta}</Link>
      </Button>
    ) : null}
  </div>
);

// A failed fetch must not take the page down — the other panels still render,
// and the region says so plainly instead of silently showing zero.
export const Unavailable = ({ what }: { what: string }) => (
  <div className="px-5 py-10 text-center">
    <p className="text-sm font-medium text-warn-ink">Could not load {what}</p>
    <p className="mt-1 text-sm text-muted-foreground">
      The API did not respond. The figures for this panel are missing, not zero.
    </p>
  </div>
);

// One line of the journal's ledger: what it measures on the left, the reading
// on the right. Deliberately not a tile — four big numbers in four identical
// boxes gave a text value like a category name the same weight as a streak.
export const LedgerRow = ({
  label,
  value,
  note,
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
}) => (
  <div className="flex items-baseline justify-between gap-3 px-5 py-3.5">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="flex min-w-0 flex-col items-end gap-1 text-right">
      <span className="text-sm font-medium tabular-nums">{value}</span>
      {note ? (
        <span className="font-mono text-[0.6875rem] text-muted-foreground">
          {note}
        </span>
      ) : null}
    </dd>
  </div>
);
