import { Skeleton } from '@/components/ui/skeleton';

/**
 * Mirrors <BlogCard />: fixed-ratio cover, mono meta row, two-line title,
 * two-line excerpt, date row pinned to the bottom.
 */
const BlogCardSkeleton = () => (
  <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card">
    <Skeleton className="aspect-[16/10] w-full rounded-none" />

    <div className="flex flex-1 flex-col p-5">
      {/* Meta row */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20 rounded-sm" />
        <Skeleton className="h-4 w-12 rounded-sm" />
      </div>

      {/* Title — two lines */}
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
      </div>

      {/* Excerpt — two lines */}
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>

      {/* Date row */}
      <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-10" />
      </div>
    </div>
  </div>
);

/**
 * Mirrors <FeaturedBlogCard />: horizontal split from lg up — cover on the
 * left (~2/5), content on the right — stacked below that.
 */
const FeaturedBlogCardSkeleton = () => (
  <div className="grid overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-5">
    <Skeleton className="aspect-[16/10] w-full rounded-none lg:col-span-2 lg:aspect-auto lg:h-full lg:min-h-[22rem]" />

    <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-3 lg:p-10">
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-5 w-16 rounded-sm" />
        <Skeleton className="h-5 w-20 rounded-sm" />
        <Skeleton className="h-5 w-24 rounded-sm" />
      </div>

      {/* Title — two lines */}
      <div className="mt-5 space-y-3">
        <Skeleton className="h-6 w-full sm:h-7" />
        <Skeleton className="h-6 w-3/4 sm:h-7" />
      </div>

      {/* Excerpt — three lines */}
      <div className="mt-5 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>

      {/* Read link */}
      <Skeleton className="mt-7 h-4 w-28" />
    </div>
  </div>
);

const BlogSkeleton = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
    >
      <span className="sr-only">Loading posts</span>

      <div aria-hidden="true" className="pointer-events-none">
        {/* Page header: eyebrow, title, description, hairline rule */}
        <div className="mb-12 sm:mb-16">
          <Skeleton className="h-3 w-20 rounded-sm" />
          <Skeleton className="mt-5 h-9 w-64 sm:h-14 sm:w-[26rem]" />
          <div className="mt-6 max-w-2xl space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
          <div className="mt-10 h-px w-full bg-line" />
        </div>

        {/* Featured post */}
        <FeaturedBlogCardSkeleton />

        {/* Post grid */}
        <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSkeleton;
