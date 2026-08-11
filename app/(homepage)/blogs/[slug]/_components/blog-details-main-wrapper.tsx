import { IBlog } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import '../tiptap-content.css';
import { ImageWithLoader } from '@/components/ui/image-with-loader';
import BlogTypeLabel from '../../_components/blog-type-label';

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

// Backend sometimes sends the author as a raw Mongo ObjectId — hide those.
const isRawId = (value?: string) => /^[a-f0-9]{24}$/i.test(value ?? '');

const BlogDetailsMainWrapper = ({ blog }: { blog: IBlog }) => {
  return (
    <article className="relative container mx-auto max-w-3xl px-4 py-14 sm:py-20">
      {/* Faint emerald glow behind the header, matches the site hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_70%_90%_at_50%_-20%,rgba(16,185,129,0.14),transparent)]" />

      {/* Back link */}
      <Link
        href="/blogs"
        className="mb-10 inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
      >
        <ArrowLeft className="h-4 w-4" />
        cd ../blogs
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
          {blog.type && (
            <>
              <BlogTypeLabel type={blog.type} />
              <span aria-hidden>·</span>
            </>
          )}
          <span>{formatDate(blog.createdAt)}</span>
          <span aria-hidden>·</span>
          <span>{readingTime(blog.content)} min read</span>
        </div>

        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl">
          {blog.title}
        </h1>

        <p className="mt-6 border-l-2 border-emerald-500/60 pl-4 text-lg leading-relaxed text-muted-foreground">
          {blog.excerpt}
        </p>

        {blog.author && !isRawId(blog.author) && (
          <p className="mt-6 font-mono text-sm text-muted-foreground">
            <span className="text-emerald-600 dark:text-emerald-400">
              author:
            </span>{' '}
            {blog.author}
          </p>
        )}
      </header>

      {/* Cover image */}
      <div className="relative mb-12 aspect-video overflow-hidden rounded-2xl border">
        <ImageWithLoader
          src={blog.coverImage}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Blog content */}
      <div
        className="tiptap-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Footer */}
      <footer className="mt-16 border-t pt-8">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>
      </footer>
    </article>
  );
};

export default BlogDetailsMainWrapper;
