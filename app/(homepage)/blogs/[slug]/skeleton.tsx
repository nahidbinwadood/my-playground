import { Skeleton } from '@/components/ui/skeleton';

export function BlogDetailsSkeleton() {
  return (
    <section className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Breadcrumb Skeleton */}
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-1" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Title Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-6 w-3/4" />
      </div>

      {/* Meta Info Skeleton */}
      <div className="mb-8 flex flex-wrap gap-4 items-center border-b pb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Banner Image Skeleton */}
      <div className="mb-8 overflow-hidden rounded-lg">
        <Skeleton className="h-96 w-full" />
      </div>

      {/* Content Skeleton */}
      <div className="prose dark:prose-invert max-w-none mb-8">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="mb-4">
            {i % 4 === 0 ? (
              <Skeleton className="h-6 w-1/2 mb-4" />
            ) : (
              <>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Tags Skeleton */}
      <div className="flex flex-wrap gap-2 border-t pt-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>

      {/* Related Articles Skeleton */}
      <div className="mt-12">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border overflow-hidden">
              <Skeleton className="h-40 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
