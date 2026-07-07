import { IBlog } from '@/types';
import { ArrowLeft, CalendarIcon, Clock } from 'lucide-react';
import Link from 'next/link';
import '../tiptap-content.css';
import { Button } from '@/components/ui/button';
import StatusPill from '@/components/common/status-pill';
import { ImageWithLoader } from '@/components/ui/image-with-loader';

// Colored badge per blog type (dark-safe).
const typeColors: Record<string, string> = {
  FRONTEND: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  BACKEND: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  JAVASCRIPT: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

// Rough reading time: strip HTML tags, count words, ~200 wpm.
const readingTime = (html: string) => {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const BlogDetailsMainWrapper = ({ blog }: { blog: IBlog }) => {
  return (
    <section className="container mx-auto max-w-4xl px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4" />
            Back to all blogs
          </Link>
        </Button>
      </div>

      {/* Cover image */}
      <div className="relative mb-8 h-72 overflow-hidden rounded-2xl border md:h-96">
        <ImageWithLoader
          src={blog.coverImage}
          alt={blog.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Meta row */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {blog.type && (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              typeColors[blog.type] ?? 'bg-muted text-muted-foreground'
            }`}
          >
            {blog.type.charAt(0) + blog.type.slice(1).toLowerCase()}
          </span>
        )}
        <StatusPill status={blog.isPublished} />
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          {formatDate(blog.createdAt)}
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          {readingTime(blog.content)} min read
        </span>
      </div>

      {/* Title */}
      <h1 className="mb-4 text-3xl font-bold leading-snug md:text-4xl">
        {blog.title}
      </h1>

      {/* Excerpt */}
      <p className="mb-8 border-l-4 border-emerald-500/50 pl-4 text-base leading-relaxed text-muted-foreground">
        {blog.excerpt}
      </p>

      <hr className="mb-8 border-border" />

      {/* Blog content */}
      <div
        className="tiptap-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </section>
  );
};

export default BlogDetailsMainWrapper;
