import { cn } from '@/lib/utils';

// Small colored pill showing a blog's publish status.
// Accepts either a boolean (isPublished) or a string ('published'/'draft').
// Green = published, amber = draft. Colors work in light and dark mode.
const StatusPill = ({
  status,
  className,
}: {
  status: boolean | string;
  className?: string;
}) => {
  const isPublished =
    typeof status === 'boolean'
      ? status
      : status.toLowerCase() === 'published';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        isPublished
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        className
      )}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
};

export default StatusPill;
