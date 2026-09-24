import { cn } from '@/lib/utils';

// Lime square + name. The square is the one brand mark; it survives a
// collapsed sidebar, the text does not (callers hide it).
const Wordmark = ({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) => (
  <span className={cn('flex items-center gap-2.5', className)}>
    <span aria-hidden="true" className="size-5 shrink-0 rounded-md bg-brand" />
    <span
      className={cn(
        'font-display text-lg font-bold tracking-[-0.02em] text-foreground',
        textClassName
      )}
    >
      playground
    </span>
  </span>
);

export default Wordmark;
