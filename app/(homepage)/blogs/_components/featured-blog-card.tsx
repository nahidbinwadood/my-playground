import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { IBlog } from '@/types';
import { ImageWithLoader } from '@/components/ui/image-with-loader';
import BlogTypeLabel from './blog-type-label';

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

// Rough reading time: strip HTML tags, count words, ~200 wpm.
const readingTime = (html?: string) => {
  const words = (html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

// Latest post — same card vocabulary at larger scale: image left, content
// right on lg, stacked below. One link, nothing interactive nested inside.
const FeaturedBlogCard = ({ blog }: { blog: IBlog }) => {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block rounded-lg">
      <article className="grid overflow-hidden rounded-lg border border-border bg-card transition-[border-color,translate] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:border-signal/40 lg:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line lg:aspect-auto lg:min-h-96 lg:border-r lg:border-b-0">
          <ImageWithLoader
            src={blog.coverImage}
            alt={`Cover image for ${blog.title}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-col justify-center gap-4 p-5 sm:p-8 lg:p-10">
          <div className="flex items-center gap-3">
            <span className="label-mono">Featured</span>
            <span aria-hidden="true" className="h-px flex-1 bg-line" />
            <BlogTypeLabel type={blog.type} />
          </div>

          <h2 className="text-xl font-semibold leading-snug tracking-[-0.02em] break-words sm:text-2xl lg:text-[1.75rem]">
            {blog.title}
          </h2>

          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {blog.excerpt}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-line pt-4 font-mono text-xs tabular-nums text-muted-foreground">
            <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
            <span aria-hidden="true">/</span>
            <span>{readingTime(blog.content)} min read</span>
            <span className="ml-auto inline-flex items-center gap-1.5 text-foreground">
              Read post
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default FeaturedBlogCard;
