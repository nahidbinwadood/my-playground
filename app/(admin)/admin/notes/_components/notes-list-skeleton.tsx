import { Skeleton } from '@/components/ui/skeleton';

const TITLE_WIDTHS = ['w-4/5', 'w-11/12', 'w-3/4', 'w-full'];

const NotesListSkeleton = () => {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading notes</span>

      <div aria-hidden="true" className="pointer-events-none space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-28 max-w-full rounded-sm" />
            <Skeleton className="h-9 w-40 max-w-full" />
            <Skeleton className="h-4 w-80 max-w-full" />
          </div>
          <Skeleton className="h-10 w-full shrink-0 sm:w-32" />
        </div>

        <div className="grid grid-cols-1 divide-y divide-line overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="px-5 py-4 sm:py-5">
              <Skeleton className="h-3 w-20 rounded-sm" />
              <Skeleton className="mt-3 h-8 w-14" />
              <Skeleton className="mt-2 h-3 w-32 max-w-full rounded-sm" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-3 w-16 rounded-sm" />
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="size-8 rounded-sm" />
              </div>
              <div className="space-y-2">
                <Skeleton
                  className={`h-4 ${TITLE_WIDTHS[index % TITLE_WIDTHS.length]}`}
                />
                <Skeleton className="h-3 w-28 max-w-full rounded-sm" />
              </div>
              <Skeleton className="h-3 w-full rounded-sm" />
              <Skeleton className="h-3 w-11/12 rounded-sm" />
              <div className="mt-2 flex items-center justify-between border-t border-line pt-3">
                <Skeleton className="h-3 w-20 rounded-sm" />
                <Skeleton className="h-3 w-24 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesListSkeleton;
