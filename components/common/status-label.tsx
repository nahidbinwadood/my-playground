import { cn } from '@/lib/utils';
import { TNoteStatus } from '@/types';

/**
 * The note status chip — Draft or Complete.
 *
 * Same treatment as category chips (tinted fill, readable ink, no border).
 * Includes an indicator dot for instant visual recognition across note cards.
 *
 * Token choice follows the design system's functional trio:
 * - `warn` reads as in-progress (Draft)
 * - `signal` reads as completed/verified (Complete)
 */
const STATUS_CLASS: Record<TNoteStatus, string> = {
  DRAFT: 'bg-warn/15 text-warn-ink',
  COMPLETE: 'bg-signal/15 text-signal-ink',
};

const STATUS_DOT: Record<TNoteStatus, string> = {
  DRAFT: 'bg-warn-ink',
  COMPLETE: 'bg-signal-ink',
};

// Sentence case — the design system forbids uppercase letter-spaced labels.
const STATUS_LABEL: Record<TNoteStatus, string> = {
  DRAFT: 'Draft',
  COMPLETE: 'Complete',
};

// The opposite label, for the toggle in the card menu.
export const STATUS_ACTION_LABEL: Record<TNoteStatus, string> = {
  DRAFT: 'Mark complete',
  COMPLETE: 'Mark draft',
};

const StatusLabel = ({
  status,
  className,
}: {
  status?: TNoteStatus | null;
  className?: string;
}) => {
  // Always resolve to a valid state: any note not marked COMPLETE is DRAFT
  const current: TNoteStatus = status === 'COMPLETE' ? 'COMPLETE' : 'DRAFT';

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[0.6875rem] font-medium tracking-tight',
        STATUS_CLASS[current],
        className
      )}
    >
      <span
        className={cn('size-1.5 rounded-full shrink-0', STATUS_DOT[current])}
        aria-hidden="true"
      />
      {STATUS_LABEL[current]}
    </span>
  );
};

export default StatusLabel;
