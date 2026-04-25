'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IBlogs } from '../types';
import ReactMarkdown from 'react-markdown';
import { Clock, Eye, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BlogDetailContent({ blog }: { blog: IBlogs }) {
  const [relatedBlogs, setRelatedBlogs] = useState<IBlogs[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        const response = await fetch('/api/blogs');
        if (response.ok) {
          const allBlogs = (await response.json()) as IBlogs[];
          const related = allBlogs
            .filter(
              (b) =>
                b.category === blog.category &&
                b.slug !== blog.slug &&
                b.status === 'published'
            )
            .slice(0, 3);
          setRelatedBlogs(related);
        }
      } catch (error) {
        console.error('Error fetching related blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [blog.category, blog.slug]);

  return (
    <section className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Back Button */}
      <Link href="/blogs" className="inline-block mb-8">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Blogs
        </Button>
      </Link>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/blogs" className="hover:text-foreground transition-colors">
          Blogs
        </Link>
        <span>/</span>
        <span className="text-foreground">{blog.title}</span>
      </nav>

      {/* Title */}
      <header className="mb-8">
        <div className="mb-4 inline-block">
          <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
            {blog.category}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {blog.title}
        </h1>
        <p className="text-xl text-muted-foreground">
          {blog.excerpt}
        </p>
      </header>

      {/* Meta Information */}
      <div className="flex flex-wrap gap-6 items-center border-b pb-6 mb-8 text-sm">
        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            {blog.author.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{blog.author}</p>
            <p className="text-muted-foreground text-xs">Author</p>
          </div>
        </div>

        {/* Published Date */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Reading Time */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{blog.readTime} min read</span>
        </div>

        {/* Views */}
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span>{blog.viewCount.toLocaleString()} views</span>
        </div>
      </div>

      {/* Featured Image */}
      {blog.coverImage && (
        <div className="relative h-96 md:h-[500px] w-full mb-8 overflow-hidden rounded-lg">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content */}
      <article className="prose dark:prose-invert max-w-none mb-12">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
            p: ({ node, ...props }) => <p className="text-base leading-7 mb-4" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4" {...props} />,
            code: ({ node, inline, ...props }: any) =>
              inline ? (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
              ) : (
                <code className="bg-muted p-4 rounded-lg block overflow-x-auto text-sm font-mono mb-4" {...props} />
              ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
            ),
          }}
        >
          {blog.content}
        </ReactMarkdown>
      </article>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="border-t pt-8 mb-12">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blogs?tag=${tag}`}
                className="px-4 py-2 bg-muted rounded-full text-sm hover:bg-primary/10 hover:text-primary transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedBlogs.map((relatedBlog) => (
              <Link key={relatedBlog.id} href={`/blogs/${relatedBlog.slug}`}>
                <article className="group rounded-lg border overflow-hidden hover:shadow-lg transition-shadow">
                  {relatedBlog.coverImage && (
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={relatedBlog.coverImage}
                        alt={relatedBlog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {relatedBlog.readTime} min read
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="mt-16 bg-muted rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Subscribe to get the latest articles delivered to your inbox.
        </p>
        <div className="flex gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg bg-background border focus:outline-none focus:ring-2 focus:ring-primary"
            disabled
          />
          <Button disabled>Coming Soon</Button>
        </div>
      </section>
    </section>
  );
}
