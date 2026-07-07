import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { IBlog } from '@/types';
import { ImageWithLoader } from '@/components/ui/image-with-loader';

// Colored badge per blog type (dark-safe).
const typeColors: Record<string, string> = {
  FRONTEND: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  BACKEND: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  JAVASCRIPT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

const BlogCard = ({ blog }: { blog: IBlog }) => {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* Cover image */}
        <div className="relative h-52 overflow-hidden">
          <ImageWithLoader
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {blog.type && (
            <span
              className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur ${
                typeColors[blog.type] ?? 'bg-muted text-muted-foreground'
              }`}
            >
              {blog.type.charAt(0) + blog.type.slice(1).toLowerCase()}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <h2 className="mb-2 text-lg font-semibold leading-snug transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
            {blog.title}
          </h2>
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
            {blog.excerpt}
          </p>

          {/* Meta */}
          <div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
