'use client';

import { IBlog } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'motion/react';
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
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 40,
    restDelta: 0.001,
  });

  const showAuthor = Boolean(blog.author) && !isRawId(blog.author);

  return (
    <>
      {/* Reading progress — the single accent moment on this page. */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-signal"
      />

      <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[68ch]">
          <Link
            href="/blogs"
            className="label-mono inline-flex items-center gap-2 rounded-sm transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" aria-hidden="true" />
            /blogs
          </Link>

          <header className="mt-8">
            <div className="label-mono flex flex-wrap items-center gap-x-2.5 gap-y-1">
              {blog.type && (
                <>
                  <BlogTypeLabel type={blog.type} />
                  <span aria-hidden="true" className="opacity-40">
                    /
                  </span>
                </>
              )}
              <time dateTime={blog.createdAt} className="tabular-nums">
                {formatDate(blog.createdAt)}
              </time>
              <span aria-hidden="true" className="opacity-40">
                /
              </span>
              <span className="tabular-nums">
                {readingTime(blog.content)} min read
              </span>
            </div>

            <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.03em] sm:text-4xl md:text-5xl">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                {blog.excerpt}
              </p>
            )}

            {showAuthor && (
              <div className="mt-8 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface font-mono text-sm font-semibold"
                >
                  {blog.author.trim().charAt(0).toUpperCase()}
                </span>
                <span className="leading-tight">
                  <span className="block text-sm font-semibold">
                    {blog.author}
                  </span>
                  <span className="label-mono mt-0.5 block">Author</span>
                </span>
              </div>
            )}

            <hr className="mt-8 border-t border-line" />
          </header>
        </div>

        {/* Cover image breaks wider than the reading column. */}
        {blog.coverImage && (
          <figure className="relative mt-10 aspect-video overflow-hidden rounded-lg border border-line">
            <ImageWithLoader
              src={blog.coverImage}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </figure>
        )}

        <div
          className="tiptap-content mx-auto mt-12 max-w-[68ch]"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <footer className="mx-auto mt-16 max-w-[68ch] border-t border-line pt-8">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <Link
              href="/blogs"
              className="label-mono inline-flex items-center gap-2 rounded-sm transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Read the other posts
            </Link>
            {blog.updatedAt && (
              <span className="label-mono tabular-nums">
                Updated {formatDate(blog.updatedAt)}
              </span>
            )}
          </div>
        </footer>
      </article>
    </>
  );
};

export default BlogDetailsMainWrapper;
