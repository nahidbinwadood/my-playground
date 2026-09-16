import { Skeleton } from '@/components/ui/skeleton';

// 5-column grid: title | type | updated | status | actions
const ROW_GRID =
  'grid items-center gap-4 px-4 sm:px-5 ' +
  'grid-cols-[minmax(0,1fr)_4.5rem] ' +
  'md:grid-cols-[minmax(0,1.6fr)_5rem_5.5rem_4.5rem] ' +
  'xl:grid-cols-[minmax(0,1.6fr)_5.5rem_5.5rem_5rem_4.5rem]';

const TITLE_WIDTHS = ['w-4/5', 'w-11/12', 'w-3/4', 'w-full'];

const AdminBlogsSkeleton = () => {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading blog posts</span>

      <div aria-hidden="true" className="space-y-6 pointer-events-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-28 max-w-full rounded-sm" />
            <Skeleton className="h-9 w-64 max-w-full" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <Skeleton className="h-10 w-full shrink-0 sm:w-36" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <Skeleton className="h-3 w-24 rounded-sm" />
                <Skeleton className="h-8 w-8 shrink-0" />
              </div>
              <Skeleton className="mt-4 h-8 w-16" />
              <Skeleton className="mt-2 h-3 w-32 max-w-full rounded-sm" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div
            className={`${ROW_GRID} border-b border-line bg-surface py-3.5`}
          >
            <Skeleton className="h-3 w-16 rounded-sm" />
            <Skeleton className="hidden h-3 w-10 rounded-sm md:block" />
            <Skeleton className="hidden h-3 w-14 rounded-sm md:block" />
            <Skeleton className="hidden h-3 w-12 rounded-sm xl:block" />
            <span className="block" />
          </div>

          <div className="divide-y divide-line">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={`${ROW_GRID} py-4`}>
                <Skeleton
                  className={`h-4 ${TITLE_WIDTHS[index % TITLE_WIDTHS.length]}`}
                />
                <Skeleton className="hidden h-5 w-16 rounded-md md:block" />
                <Skeleton className="hidden h-4 w-20 md:block" />
                <Skeleton className="hidden h-5 w-16 rounded-full xl:block" />
                <Skeleton className="h-8 w-8 justify-self-end" />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-4 py-3.5 sm:px-5">
            <Skeleton className="h-3 w-40 max-w-full rounded-sm" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogsSkeleton;
