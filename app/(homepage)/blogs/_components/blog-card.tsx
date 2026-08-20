import Link from 'next/link';
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

// The whole card is one link — nothing interactive is nested inside it.
const BlogCard = ({ blog }: { blog: IBlog }) => {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block h-full rounded-lg">
      <article className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-[border-color,translate] duration-300 ease-out group-hover:-translate-y-0.5 group-hover:border-signal/40">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
          <ImageWithLoader
            src={blog.coverImage}
            alt={`Cover image for ${blog.title}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center gap-3">
            <BlogTypeLabel type={blog.type} />
            <span className="label-mono truncate">
              {readingTime(blog.content)} min read
            </span>
          </div>

          <h2 className="line-clamp-2 font-sans text-base font-semibold leading-snug">
            {blog.title}
          </h2>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {blog.excerpt}
          </p>

          <div className="mt-auto border-t border-line pt-3">
            <time
              dateTime={blog.createdAt}
              className="font-mono text-xs tabular-nums text-muted-foreground"
            >
              {formatDate(blog.createdAt)}
            </time>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
