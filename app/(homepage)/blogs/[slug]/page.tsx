
import Image from 'next/image';
import Link from 'next/link';
import { IBlogs } from '../types';
import ReactMarkdown from 'react-markdown';
import { Clock, Eye, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogDetailContent } from './blog-detail-content';

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return (
        <section className="container mx-auto py-8 px-4 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
            <Link href="/blogs">
              <Button>Back to Blogs</Button>
            </Link>
          </div>
        </section>
      );
    }

    const blog = (await response.json()) as IBlogs;

    // Increment view count
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/blogs/${slug}`, {
      method: 'PUT',
      body: JSON.stringify({ viewCount: blog.viewCount + 1 }),
    }).catch(() => {});

    return (
      <BlogDetailContent blog={blog} />
    );
  } catch (error) {
    console.error('Error fetching blog:', error);
    return (
      <section className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Error loading blog</h1>
          <Link href="/blogs">
            <Button>Back to Blogs</Button>
          </Link>
        </div>
      </section>
    );
  }
}

export default page;
