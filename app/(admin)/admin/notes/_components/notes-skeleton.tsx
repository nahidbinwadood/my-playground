import { Skeleton } from '@/components/ui/skeleton';

// Mirrors the real field shape: label line above a control, or above a body well.
const FieldSkeleton = ({ body = false }: { body?: boolean }) => (
  <div className="space-y-2">
    <Skeleton className="h-3 w-20 rounded-sm" />
    <Skeleton className={body ? 'h-40 w-full' : 'h-10 w-full'} />
  </div>
);

const PanelSkeleton = ({
  labelWidth,
  hintWidth,
  children,
  footer = false,
}: {
  labelWidth: string;
  hintWidth: string;
  children: React.ReactNode;
  footer?: boolean;
}) => (
  <div className="overflow-hidden rounded-lg border border-border bg-card">
    <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5">
      <Skeleton className={`h-3 rounded-sm ${labelWidth}`} />
      <Skeleton className={`h-3 rounded-sm ${hintWidth}`} />
    </div>
    <div className="space-y-4 p-4 sm:p-5">{children}</div>
    {footer ? (
      <div className="flex items-center justify-between gap-3 border-t border-line bg-surface px-4 py-3">
        <Skeleton className="h-3 w-48 max-w-full rounded-sm" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
    ) : null}
  </div>
);

// Mirrors the timeline card: header strip, then dated groups of entries.
const TimelineSkeleton = () => (
  <div className="mt-6 max-w-3xl overflow-hidden rounded-lg border border-border bg-card">
    <div className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-2.5 sm:px-5">
      <Skeleton className="h-3 w-16 rounded-sm" />
      <Skeleton className="h-3 w-20 rounded-sm" />
    </div>

    {[0, 1].map((group) => (
      <div key={group}>
        <div className="border-b border-line bg-surface px-4 py-2 sm:px-5">
          <Skeleton className="h-3 w-40 max-w-full rounded-sm" />
        </div>
        <div className="space-y-2.5 px-4 py-4 sm:px-5">
          <div className="flex items-baseline justify-between gap-3">
            <Skeleton className="h-4 w-2/3 max-w-full" />
            <Skeleton className="h-3 w-10 shrink-0 rounded-sm" />
          </div>
          <Skeleton className="h-3 w-28 rounded-sm" />
        </div>
      </div>
    ))}
  </div>
);

const NotesSkeleton = () => {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading the note form and timeline</span>

      <div aria-hidden="true" className="pointer-events-none">
        <div className="mb-8 space-y-3 border-b border-line pb-6">
          <Skeleton className="h-3 w-24 rounded-sm" />
          <Skeleton className="h-8 w-40 max-w-full" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>

        <div className="max-w-3xl space-y-6">
          <PanelSkeleton labelWidth="w-16" hintWidth="w-16">
            <FieldSkeleton />
            <FieldSkeleton />
          </PanelSkeleton>

          <PanelSkeleton labelWidth="w-12" hintWidth="w-16" footer>
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton body />
          </PanelSkeleton>
        </div>

        <TimelineSkeleton />
      </div>
    </div>
  );
};

export default NotesSkeleton;
