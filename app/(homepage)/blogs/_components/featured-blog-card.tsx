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

// Latest post — editorial split: image left, content right.
const FeaturedBlogCard = ({ blog }: { blog: IBlog }) => {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block">
      <article className="grid overflow-hidden rounded-2xl border bg-card transition-colors hover:border-emerald-500/40 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden md:aspect-auto md:min-h-80">
          <ImageWithLoader
            src={blog.coverImage}
            alt={blog.title}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-10">
          <div className="mb-4 flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-0.5 text-emerald-600 dark:text-emerald-400">
              Latest
            </span>
            <BlogTypeLabel type={blog.type} />
            <span>{formatDate(blog.createdAt)}</span>
          </div>

          <h2 className="text-2xl font-bold leading-snug tracking-tight transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400 sm:text-3xl">
            {blog.title}
          </h2>

          <p className="mt-4 line-clamp-3 leading-relaxed text-muted-foreground">
            {blog.excerpt}
          </p>

          <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Read post
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </Link>
  );
};

export default FeaturedBlogCard;
