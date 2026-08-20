import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { IBlog } from '@/types';
import BlogCard from '../../app/(homepage)/blogs/_components/blog-card';
import { getAllBlogs } from '@/actions/blog.action';
import { Reveal } from './motion/reveal';

// Server component: fetches real blogs and shows the 3 most recent.
export async function LatestBlogsSection() {
  const response = await getAllBlogs({ enableCache: true });
  const blogs: IBlog[] = response?.data ?? [];

  const latest = [...blogs]
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        {/* Route label + heading on the left, archive link on the right */}
        <Reveal>
          <div className="flex flex-col gap-5 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
            <div>
              <p className="label-mono flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="pointer-events-none inline-block size-1.5 rounded-[2px] bg-iris"
                />
                /blogs
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Latest posts
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                The three most recent entries — frontend, backend, and
                JavaScript notes.
              </p>
            </div>

            <Link
              href="/blogs"
              className="group inline-flex shrink-0 items-center gap-2 self-start rounded-sm font-mono text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:self-auto"
            >
              View all posts
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </Reveal>

        {latest.length === 0 ? (
          <Reveal delay={0.08}>
            <div className="mt-10 rounded-lg border border-dashed border-line bg-surface px-6 py-14 text-center">
              <p className="font-mono text-base font-semibold tracking-tight">
                No posts yet.
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Published posts land here, newest first. Publish one from the
                admin dashboard to fill this row.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {latest.map((blog, i) => (
              <Reveal key={blog.slug} delay={i * 0.08} className="h-full">
                <BlogCard blog={blog} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
