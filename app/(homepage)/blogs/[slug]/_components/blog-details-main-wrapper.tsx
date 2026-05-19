import { IBlog } from '@/types';
import { ArrowLeft, CalendarIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';
import '../tiptap-content.css';
import { Button } from '@/components/ui/button';

const BlogDetailsMainWrapper = ({ blog }: { blog: IBlog }) => {
  return (
    <section className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button asChild variant="outline" className="gap-2">
          <Link href="/blogs">
            <ArrowLeft className="w-4 h-4" />
            Back to all blogs
          </Link>
        </Button>
      </div>
      {/* Cover Image */}
      <div className="overflow-hidden rounded-2xl mb-8">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-72 md:h-96 object-cover"
        />
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <span
          className={`text-xs font-medium px-3 py-1 rounded-md ${
            blog.isPublished
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}
        >
          {blog.isPublished ? 'Published' : 'Draft'}
        </span>

        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <CalendarIcon className="w-4 h-4" />
          {new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>

        {blog.updatedAt !== blog.createdAt && (
          <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            Updated{' '}
            {new Date(blog.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold leading-snug mb-4">
        {blog.title}
      </h1>

      {/* Excerpt */}
      <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed border-l-4 border-gray-200 dark:border-gray-700 pl-4 mb-8">
        {blog.excerpt}
      </p>

      <hr className="border-gray-200 dark:border-gray-800 mb-8" />

      {/* Blog Content */}
      <div
        className="tiptap-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </section>
  );
};

export default BlogDetailsMainWrapper;
