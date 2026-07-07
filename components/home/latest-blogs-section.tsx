import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  if (latest.length === 0) return null;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Latest from the blog
            </h2>
            <p className="mt-2 text-muted-foreground">
              Fresh notes on frontend, backend, and everything in between.
            </p>
          </div>
          <Button variant="ghost" asChild className="hidden shrink-0 sm:flex">
            <Link href="/blogs">
              View all
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((blog, i) => (
            <Reveal key={blog.slug} delay={i * 0.1}>
              <BlogCard blog={blog} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
