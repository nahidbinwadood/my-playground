import { Skeleton } from '@/components/ui/skeleton';

const BlogDetailsSkeleton = () => {
  return (
    <section className="container mx-auto py-8 px-4 max-w-4xl animate-pulse">

      {/* Back Button Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-44 rounded-md" />
      </div>

      {/* Cover Image Skeleton */}
      <Skeleton className="w-full h-72 md:h-96 rounded-2xl mb-8" />

      {/* Meta Row Skeleton */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Skeleton className="h-6 w-24 rounded-md" />
        <Skeleton className="h-6 w-40 rounded-md" />
        <Skeleton className="h-6 w-40 rounded-md" />
      </div>

      {/* Title Skeleton */}
      <div className="space-y-3 mb-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-4/5" />
      </div>

      {/* Excerpt Skeleton */}
      <div className="space-y-2 mb-8">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>

      {/* Divider Skeleton */}
      <Skeleton className="h-px w-full mb-8" />

      {/* Content Skeleton */}
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