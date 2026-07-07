import { IBlog } from '@/types';
import { Reveal } from '@/components/home/motion/reveal';
import BlogCard from './blog-card';

const AllBlogsMainWrapper = ({ blogs }: { blogs: IBlog[] }) => {
  return (
    <section className="container mx-auto max-w-7xl px-4 py-12">
      {/* Page header */}
      <Reveal className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Notes and deep-dives on frontend, backend, and JavaScript.
        </p>
      </Reveal>

      {blogs?.length ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, i) => (
            <Reveal key={blog.slug} delay={i * 0.08}>
              <BlogCard blog={blog} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="py-20 text-center text-muted-foreground">
          No blog posts yet. Check back soon.
        </p>
      )}
    </section>
  );
};

export default AllBlogsMainWrapper;
