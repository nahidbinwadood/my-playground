import { IBlogs } from '@/app/(homepage)/blogs/types';
import fs from 'fs';
import path from 'path';

const blogsFilePath = path.join(process.cwd(), 'app/(homepage)/blogs/data/blogs.json');

function readBlogs(): IBlogs[] {
  const content = fs.readFileSync(blogsFilePath, 'utf-8');
  return JSON.parse(content);
}

function writeBlogs(blogs: IBlogs[]): void {
  fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2), 'utf-8');
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
