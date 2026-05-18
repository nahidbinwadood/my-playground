import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const BlogCreateUpdateSkeleton = () => {
  return (
    <section>
      {/* Page Header Skeleton */}
      <div className="mb-8">
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Title */}
        <Skeleton className="mb-2 h-10 w-80" />

        {/* Subtitle */}
        <Skeleton className="h-5 w-[420px]" />
      </div>

      {/* Form Card */}
      <Card>
        {/* Card Header */}
        <CardHeader className="space-y-3">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>

        {/* Card Content */}
        <CardContent className="space-y-4">
          {/* Blog Title */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Text Editor */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />

            <div className="rounded-md border">
              {/* Toolbar */}
              <div className="flex items-center gap-2 border-b p-3">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-8 w-8 rounded-md" />
                ))}
              </div>

              {/* Editor */}
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[85%]" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[75%]" />
              </div>
            </div>
          </div>

          {/* Selects */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Blog Status */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Blog Type */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>

          {/* Submit Button */}
          <Skeleton className="h-10 w-full rounded-md" />
        </CardContent>
      </Card>
    </section>
  );
};

export default BlogCreateUpdateSkeleton;
