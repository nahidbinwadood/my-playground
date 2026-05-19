const BlogCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
    <div className="w-full h-52 bg-gray-200 dark:bg-gray-700 animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5" />
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/5" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5" />
      <div className="flex justify-between pt-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-14" />
      </div>
    </div>
  </div>
);

const BlogSkeleton = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* top section */}
      <section className="space-y-5">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-64" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-96" />
      </section>

      {/* blog grid */}
      <section className="mt-5">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogSkeleton;
