import { cn } from '@/lib/utils';

type Tone = 'signal' | 'warn' | 'fail';

// The validation vocabulary, made visible: green = resolved, amber = still
// open, rose = broken. Same mapping on every page.
const statusTone: Record<string, Tone> = {
  published: 'signal',
  live: 'signal',
  active: 'signal',
  valid: 'signal',
  pass: 'signal',
  passed: 'signal',
  approved: 'signal',
  resolved: 'signal',
  complete: 'signal',
  completed: 'signal',

  draft: 'warn',
  pending: 'warn',
  review: 'warn',
  'in review': 'warn',
  unresolved: 'warn',
  scheduled: 'warn',
  paused: 'warn',
  warning: 'warn',
  unknown: 'warn',

  error: 'fail',
  failed: 'fail',
  fail: 'fail',
  invalid: 'fail',
  archived: 'fail',
  rejected: 'fail',
  blocked: 'fail',
  deleted: 'fail',
};

// Surface tint + hairline border from the token, with the label mixed toward
// the foreground so 11px text still clears 4.5:1 in both themes.
const toneClasses: Record<Tone, string> = {
  signal:
    'border-signal/30 bg-signal/10 text-[color:color-mix(in_oklch,var(--signal)_60%,var(--foreground))]',
  warn: 'border-warn/30 bg-warn/10 text-[color:color-mix(in_oklch,var(--warn)_60%,var(--foreground))]',
  fail: 'border-fail/30 bg-fail/10 text-[color:color-mix(in_oklch,var(--fail)_60%,var(--foreground))]',
};

const dotClasses: Record<Tone, string> = {
  signal: 'bg-signal',
  warn: 'bg-warn',
  fail: 'bg-fail',
};

/**
 * Status badge. Accepts a boolean (isPublished) or a status string
 * ('PUBLISHED', 'draft', 'archived', …). Color carries the state, but the
 * label always spells it out, so the badge never depends on color alone.
 */
const StatusPill = ({
  status,
  className,
}: {
  status: boolean | string;
  className?: string;
}) => {
  const raw =
    typeof status === 'boolean'
      ? status
        ? 'published'
        : 'draft'
      : status.trim().replace(/[_-]+/g, ' ').toLowerCase();

  const key = raw || 'unknown';
  const tone: Tone = statusTone[key] ?? 'warn';
  const label = key.charAt(0).toUpperCase() + key.slice(1);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[0.6875rem] uppercase leading-5 tracking-[0.14em]',
        toneClasses[tone],
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 shrink-0 rounded-full',
          dotClasses[tone]
        )}
      />
      {label}
    </span>
  );
};

export default StatusPill;
