import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

type Tone = 'signal' | 'warn' | 'fail' | 'iris';

// The old palette names stay as keys so existing call sites keep compiling,
// but each one resolves to a semantic design-system token. The tone only
// colors the delta line — the card itself stays neutral so a grid of stats
// reads as one datasheet instead of four competing accents.
const accents = {
  emerald: 'signal',
  blue: 'iris',
  amber: 'warn',
  violet: 'iris',
  signal: 'signal',
  warn: 'warn',
  fail: 'fail',
  iris: 'iris',
} as const;

// Tokens mixed toward the foreground so 11–12px text clears 4.5:1 against
// bg-card in both themes (raw text-signal on paper does not).
const toneText: Record<Tone, string> = {
  signal: 'text-[color:color-mix(in_oklch,var(--signal)_60%,var(--foreground))]',
  warn: 'text-[color:color-mix(in_oklch,var(--warn)_60%,var(--foreground))]',
  fail: 'text-[color:color-mix(in_oklch,var(--fail)_60%,var(--foreground))]',
  iris: 'text-[color:color-mix(in_oklch,var(--iris)_60%,var(--foreground))]',
};

const trendTone: Record<'up' | 'down' | 'flat', Tone> = {
  up: 'signal',
  down: 'fail',
  flat: 'warn',
};

const trendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
};

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  accent?: keyof typeof accents; // tone of the delta line, default emerald
  className?: string;
  /** Change since the previous period, e.g. "+12 this week". */
  delta?: string;
  /** Direction of the delta. Sets the delta color and its arrow. */
  trend?: 'up' | 'down' | 'flat';
}

const StatsCard = ({
  title,
  value,
  description,
  icon,
  accent = 'emerald',
  className,
  delta,
  trend,
}: StatsCardProps) => {
  const tone: Tone = trend ? trendTone[trend] : accents[accent];
  const TrendIcon = trend ? trendIcon[trend] : null;

  return (
    <Card
      className={cn(
        'gap-0 rounded-lg border-border bg-card py-0 shadow-none',
        className
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0 space-y-2">
          <p className="label-mono truncate">{title}</p>
          <p className="font-mono text-3xl font-semibold tabular-nums tracking-tight">
            {value}
          </p>
          {(delta || description) && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {delta && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 font-mono text-xs tabular-nums',
                    toneText[tone]
                  )}
                >
                  {TrendIcon && (
                    <TrendIcon
                      className="size-3 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  {delta}
                </span>
              )}
              {description && (
                <span className="text-xs text-muted-foreground">
                  {description}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Instrument well: bordered square, neutral icon, no colored fill. */}
        {icon && (
          <div
            aria-hidden="true"
            className="pointer-events-none flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground"
          >
            {icon}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
