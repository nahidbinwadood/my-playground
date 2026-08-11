import { Skeleton } from '@/components/ui/skeleton';

const BlogCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border">
    <Skeleton className="aspect-video w-full rounded-none" />
    <div className="space-y-3 p-5">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-5 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  </div>
);

const BlogSkeleton = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-14 sm:py-20">
      {/* Page header */}
      <section className="mb-12 max-w-2xl space-y-4 sm:mb-16">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-11 w-72" />
        <Skeleton className="h-5 w-full max-w-md" />
      </section>

      {/* Featured post */}
      <div className="grid overflow-hidden rounded-2xl border md:grid-cols-2">
        <Skeleton className="aspect-video rounded-none md:aspect-auto md:min-h-80" />
        <div className="space-y-4 p-6 sm:p-10">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Post grid */}
      <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default BlogSkeleton;
