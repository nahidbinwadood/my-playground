import { Skeleton } from '@/components/ui/skeleton';

const BlogCreateUpdateSkeleton = () => {
  return (
    <div role="status" aria-busy="true">
      <span className="sr-only">Loading the blog editor</span>

      <div aria-hidden="true" className="pointer-events-none">
        {/* Breadcrumb */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Skeleton className="h-3 w-20 rounded-sm" />
          <Skeleton className="h-3 w-2 rounded-sm" />
          <Skeleton className="h-3 w-12 rounded-sm" />
          <Skeleton className="h-3 w-2 rounded-sm" />
          <Skeleton className="h-3 w-20 rounded-sm" />
        </div>

        {/* Page heading */}
        <div className="mb-8 space-y-3">
          <Skeleton className="h-9 w-56 max-w-full" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        {/* Authoring layout: form inputs + sticky preview */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Left column — form inputs */}
          <div className="space-y-6">
            {/* Headline panel */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-sm" />
                <Skeleton className="h-11 w-full" />
              </div>
              <div className="mt-5 space-y-2">
                <Skeleton className="h-3 w-16 rounded-sm" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Publish panel — compact row + cover image */}
            <div className="rounded-lg border border-border bg-card">
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-16 rounded-sm" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20 rounded-sm" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="border-t border-line p-5">
                <Skeleton className="h-3 w-24 rounded-sm" />
                <div className="mt-3 flex h-40 w-full items-center justify-center rounded-md border border-dashed border-line bg-surface">
                  <div className="flex w-2/3 flex-col items-center gap-3">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-3 w-full rounded-sm" />
                    <Skeleton className="h-3 w-2/3 rounded-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content panel — editor */}
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="min-h-[26rem] space-y-3 p-5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[96%]" />
                <Skeleton className="h-4 w-[88%]" />
                <Skeleton className="mt-6 h-5 w-48" />
                <Skeleton className="h-4 w-[92%]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[78%]" />
                <Skeleton className="mt-6 h-4 w-[85%]" />
                <Skeleton className="h-4 w-[70%]" />
              </div>
            </div>
          </div>

          {/* Right column — sticky preview */}
          <div className="sticky top-6 hidden xl:block">
            <div className="h-[calc(100vh-6rem)] overflow-hidden rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between border-b border-line bg-surface px-4 py-2.5">
                <Skeleton className="h-3 w-16 rounded-sm" />
                <Skeleton className="h-3 w-10 rounded-sm" />
              </div>
              <div className="space-y-3 p-5">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[75%]" />
                <Skeleton className="mt-4 h-5 w-36" />
                <Skeleton className="h-4 w-[85%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-line pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
};

export default BlogCreateUpdateSkeleton;
