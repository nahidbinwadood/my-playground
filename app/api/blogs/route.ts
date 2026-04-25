import { IBlogs } from '@/app/(homepage)/blogs/types';

function readBlogs(): IBlogs[] {
  // Use require for reliable JSON loading in Next.js
  try {
    const blogsData = require('../../(homepage)/blogs/data/blogs.json');
    return Array.isArray(blogsData) ? blogsData : [];
  } catch (error) {
    console.error('[v0] Error loading blogs:', error);
    return [];
  }
}

function writeBlogs(blogs: IBlogs[]): void {
  // Writing functionality can be implemented with database in the future
  // For now, in-memory updates are used
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function GET() {
  try {
    const blogs = readBlogs();
    return Response.json(blogs);
  } catch (error) {
    console.error('Error reading blogs:', error);
    return Response.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const blogs = readBlogs();

    const newBlog: IBlogs = {
      id: generateId(),
      slug: generateSlug(body.title),
      title: body.title,
      excerpt: body.excerpt,
      author: body.author || 'Admin',
      category: body.category,
      tags: body.tags || [],
      coverImage: body.coverImage,
      content: body.content,
      viewCount: 0,
      readTime: body.readTime || 5,
      featured: body.featured || false,
      status: body.status || 'draft',
      metaDescription: body.metaDescription,
      metaKeywords: body.metaKeywords || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    blogs.push(newBlog);
    writeBlogs(blogs);

    return Response.json(newBlog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return Response.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
