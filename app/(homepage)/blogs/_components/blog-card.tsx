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

const BlogCard = ({ blog }: { blog: IBlog }) => {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5">
        {/* Cover image */}
        <div className="relative aspect-video overflow-hidden">
          <ImageWithLoader
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <BlogTypeLabel type={blog.type} />
            <span className="font-mono text-xs text-muted-foreground">
              {formatDate(blog.createdAt)}
            </span>
          </div>

          <h2 className="mb-2 text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {blog.title}
          </h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {blog.excerpt}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
