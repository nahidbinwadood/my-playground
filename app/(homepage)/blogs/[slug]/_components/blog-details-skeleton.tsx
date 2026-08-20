import { Skeleton } from '@/components/ui/skeleton';

// Last-line widths per paragraph block — prose never ends flush.
const PARAGRAPHS = [
  ['w-full', 'w-full', 'w-11/12', 'w-full', 'w-2/3'],
  ['w-full', 'w-10/12', 'w-full', 'w-1/2'],
  ['w-full', 'w-full', 'w-11/12', 'w-3/5'],
];

const BlogDetailsSkeleton = () => {
  return (
    <div
      role="status"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28"
    >
      <span className="sr-only">Loading article</span>

      <div
        aria-hidden="true"
        className="pointer-events-none mx-auto w-full max-w-[68ch]"
      >
        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-4 w-20 rounded-sm" />
          <Skeleton className="h-4 w-28 rounded-sm" />
          <Skeleton className="h-4 w-20 rounded-sm" />
        </div>

        {/* Title — three lines */}
        <div className="mt-6 space-y-3">
          <Skeleton className="h-8 w-full sm:h-11" />
          <Skeleton className="h-8 w-full sm:h-11" />
          <Skeleton className="h-8 w-3/5 sm:h-11" />
        </div>

        {/* Author row */}
        <div className="mt-8 flex items-center gap-3">
          <Skeleton className="size-9 shrink-0 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        {/* Hairline rule */}
        <div className="mt-8 h-px w-full bg-line" />

        {/* Hero image */}
        <Skeleton className="mt-8 aspect-[16/9] w-full rounded-lg" />

        {/* Article body */}
        <div className="mt-12 space-y-8">
          {PARAGRAPHS.map((lines, block) => (
            <div key={block} className="space-y-3">
              {lines.map((width, line) => (
                <Skeleton key={line} className={`h-4 ${width}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsSkeleton;
