import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IBlogs } from '../types';

const BlogCard = ({ blog }: { blog: IBlogs }) => {
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <article className="group rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
        {/* Cover Image */}
        <div className="overflow-hidden">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            width={400}
            height={400}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold leading-snug mb-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {blog.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{blog.readTime} min read</span>
            <span>{blog.viewCount} views</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default BlogCard;
