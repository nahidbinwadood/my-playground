import { Skeleton } from '@/components/ui/skeleton';

// One label + control pair, the shape every field block in the sidebar takes.
const FieldBlock = ({ labelWidth }: { labelWidth: string }) => (
  <div className="space-y-2">
    <Skeleton className={`h-3 rounded-sm ${labelWidth}`} />
    <Skeleton className="h-10 w-full" />
  </div>
);

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

        {/* Authoring layout: editor column + settings sidebar */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          {/* Editor column */}
          <div className="space-y-6">
            {/* Title field */}
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

            {/* Editor block */}
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-line bg-surface px-3 py-2.5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-8" />
                ))}
              </div>

              {/* Writing area */}
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

          {/* Settings sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-5">
              <Skeleton className="h-3 w-20 rounded-sm" />

              <div className="mt-5 space-y-5">
                <FieldBlock labelWidth="w-24" />
                <FieldBlock labelWidth="w-20" />
                <FieldBlock labelWidth="w-16" />
              </div>

              {/* Cover image dropzone */}
              <div className="mt-6 space-y-2">
                <Skeleton className="h-3 w-24 rounded-sm" />
                {/* Square inside the sidebar; capped height once it stacks */}
                <div className="flex h-52 w-full items-center justify-center rounded-md border border-dashed border-line bg-surface xl:aspect-square xl:h-auto">
                  <div className="flex w-2/3 flex-col items-center gap-3">
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-3 w-full rounded-sm" />
                    <Skeleton className="h-3 w-2/3 rounded-sm" />
                  </div>
                </div>
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
