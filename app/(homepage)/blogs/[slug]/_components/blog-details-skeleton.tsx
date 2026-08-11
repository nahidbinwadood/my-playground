import { Skeleton } from '@/components/ui/skeleton';

const BlogDetailsSkeleton = () => {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-14 sm:py-20">
      {/* Back link */}
      <Skeleton className="mb-10 h-5 w-32" />

      {/* Header */}
      <div className="mb-10 space-y-4">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-4/5" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Cover image */}
      <Skeleton className="mb-12 aspect-video w-full rounded-2xl" />

      {/* Content */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-10/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-9/12" />
      </div>
    </section>
  );
};

export default BlogDetailsSkeleton;
