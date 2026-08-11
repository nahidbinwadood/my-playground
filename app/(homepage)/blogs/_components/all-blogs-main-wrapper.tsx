import { IBlog } from '@/types';
import { Reveal } from '@/components/home/motion/reveal';
import BlogCard from './blog-card';
import FeaturedBlogCard from './featured-blog-card';

const AllBlogsMainWrapper = ({ blogs }: { blogs: IBlog[] }) => {
  const [featured, ...rest] = blogs ?? [];

  return (
    <section className="relative container mx-auto max-w-6xl px-4 py-14 sm:py-20">
      {/* Faint emerald glow behind the header, matches the site hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_70%_90%_at_50%_-20%,rgba(16,185,129,0.14),transparent)]" />

      {/* Page header */}
      <Reveal className="mb-12 max-w-2xl sm:mb-16">
        <p className="mb-3 font-mono text-sm text-emerald-600 dark:text-emerald-400">
          {'// blog'}
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Engineering notes
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Deep-dives on frontend, backend, and JavaScript — written while
          building things in this playground.
        </p>
      </Reveal>

      {featured ? (
        <div className="space-y-12 sm:space-y-16">
          {/* Latest post, editorial split */}
          <Reveal>
            <FeaturedBlogCard blog={featured} />
          </Reveal>

          {rest.length > 0 && (
            <div>
              <Reveal className="mb-6 flex items-center gap-4">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  All posts
                </span>
                <span className="h-px flex-1 bg-border" />
              </Reveal>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((blog, i) => (
                  <Reveal key={blog.slug} delay={Math.min(i, 5) * 0.07}>
                    <BlogCard blog={blog} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed py-24 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            No posts yet — check back soon.
          </p>
        </div>
      )}
    </section>
  );
};

export default AllBlogsMainWrapper;
