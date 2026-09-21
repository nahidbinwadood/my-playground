import { Skeleton } from '@/components/ui/skeleton';

// 6-column grid: name | slug | tone | order | updated | actions
const ROW_GRID =
  'grid items-center gap-4 px-4 sm:px-5 ' +
  'grid-cols-[minmax(0,1fr)_2rem] ' +
  'md:grid-cols-[minmax(0,1.4fr)_7rem_6rem_2rem] ' +
  'xl:grid-cols-[minmax(0,1.4fr)_7rem_6rem_4rem_7rem_2rem]';

const CategoriesSkeleton = () => {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading categories</span>

      <div aria-hidden="true" className="pointer-events-none space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-28 max-w-full rounded-sm" />
            <Skeleton className="h-9 w-52 max-w-full" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>
          <Skeleton className="h-10 w-full shrink-0 sm:w-36" />
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-72 max-w-full rounded-sm" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="hidden h-8 w-20 sm:block" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>

          <div className={`${ROW_GRID} border-b border-line bg-surface py-3.5`}>
            <Skeleton className="h-3 w-14 rounded-sm" />
            <Skeleton className="hidden h-3 w-10 rounded-sm md:block" />
            <Skeleton className="hidden h-3 w-10 rounded-sm md:block" />
            <Skeleton className="hidden h-3 w-10 rounded-sm xl:block" />
            <Skeleton className="hidden h-3 w-14 rounded-sm xl:block" />
            <span className="block" />
          </div>

          <div className="divide-y divide-line">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className={`${ROW_GRID} py-4`}>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-2/5" />
                  <Skeleton className="h-3 w-3/5 max-w-full rounded-sm" />
                </div>
                <Skeleton className="hidden h-4 w-16 md:block" />
                <Skeleton className="hidden h-6 w-20 rounded-md md:block" />
                <Skeleton className="hidden h-4 w-6 xl:block" />
                <Skeleton className="hidden h-4 w-20 xl:block" />
                <Skeleton className="h-8 w-8 justify-self-end" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesSkeleton;
