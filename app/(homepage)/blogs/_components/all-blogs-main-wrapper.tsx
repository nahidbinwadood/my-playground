import Link from 'next/link';
import { IBlog } from '@/types';
import { Reveal } from '@/components/home/motion/reveal';
import { Button } from '@/components/ui/button';
import BlogCard from './blog-card';
import FeaturedBlogCard from './featured-blog-card';

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

// Newest createdAt across the set — shown as the index's "last update" stat.
const lastUpdated = (posts: IBlog[]) => {
  const newest = posts.reduce<number>((acc, post) => {
    const time = new Date(post.createdAt).getTime();
    return Number.isNaN(time) ? acc : Math.max(acc, time);
  }, 0);
  return newest > 0 ? formatDate(new Date(newest).toISOString()) : null;
};

const AllBlogsMainWrapper = ({ blogs }: { blogs: IBlog[] }) => {
  const posts = blogs ?? [];
  const [featured, ...rest] = posts;
  const updated = lastUpdated(posts);

  return (
    <section className="relative">
      {/* Column guides — spec-sheet device, decorative only */}
      <div
        aria-hidden="true"
        className="grid-guides pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />

      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        {/* Page header */}
        <Reveal className="max-w-3xl">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-iris">
            /blogs
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
            Engineering notes
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Write-ups on frontend, backend, and JavaScript — kept while building
            the components and form challenges on this site.
          </p>
        </Reveal>

        {/* Index stats */}
        <Reveal delay={0.06}>
          <dl className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-line pt-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <dt className="uppercase tracking-[0.18em] text-muted-foreground">
                Posts
              </dt>
              <dd className="tabular-nums text-foreground">{posts.length}</dd>
            </div>
            {updated && (
              <div className="flex items-center gap-2">
                <dt className="uppercase tracking-[0.18em] text-muted-foreground">
                  Last update
                </dt>
                <dd className="tabular-nums text-foreground">{updated}</dd>
              </div>
            )}
          </dl>
        </Reveal>

        {featured ? (
          <>
            {/* Latest post, editorial split */}
            <Reveal className="mt-14 sm:mt-20">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="label-mono">Latest</h2>
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
              </div>
              <FeaturedBlogCard blog={featured} />
            </Reveal>

            {rest.length > 0 && (
              <div className="mt-14 sm:mt-20">
                <Reveal className="mb-6 flex items-center gap-4">
                  <h2 className="label-mono">All posts</h2>
                  <span aria-hidden="true" className="h-px flex-1 bg-line" />
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    {rest.length}
                  </span>
                </Reveal>
                <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                  {rest.map((blog, i) => (
                    <Reveal key={blog.slug} delay={Math.min(i, 5) * 0.07}>
                      <BlogCard blog={blog} />
                    </Reveal>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty state — says what to read instead while the index fills up */
          <Reveal className="mt-14 sm:mt-20">
            <div className="rounded-lg border border-dashed border-line bg-surface px-6 py-16 text-center sm:py-20">
              <p className="label-mono">Empty index</p>
              <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
                No posts published yet
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Posts appear here as soon as one is published from the admin
                dashboard. The component showcase and the form challenges are
                already running.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild>
                  <Link href="/components">Open the component showcase</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/form-playground">Open the form playground</Link>
                </Button>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
};

export default AllBlogsMainWrapper;
