import { IBlogs } from '@/app/(homepage)/blogs/types';
import fs from 'fs';
import path from 'path';

function getBlogsFilePath(): string {
  // Try multiple path approaches to handle the (homepage) directory
  const approaches = [
    // Direct path with escaped parentheses
    path.join(process.cwd(), 'app', '(homepage)', 'blogs', 'data', 'blogs.json'),
    // Alternative: using direct string
    path.join(process.cwd(), 'app/(homepage)/blogs/data/blogs.json'),
  ];

  for (const filePath of approaches) {
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }

  // Return the most likely path as fallback
  return approaches[0];
}

function readBlogs(): IBlogs[] {
  const blogsFilePath = getBlogsFilePath();
  const content = fs.readFileSync(blogsFilePath, 'utf-8');
  return JSON.parse(content);
}

function writeBlogs(blogs: IBlogs[]): void {
  fs.writeFileSync(blogsFilePath, JSON.stringify(blogs, null, 2), 'utf-8');
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const blogs = readBlogs();
    const blog = blogs.find((b) => b.slug === slug);

    if (!blog) {
      return Response.json({ error: 'Blog not found' }, { status: 404 });
    }

    return Response.json(blog);
  } catch (error) {
    console.error('Error reading blog:', error);
    return Response.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();

    const blogs = readBlogs();
    const blogIndex = blogs.findIndex((b) => b.slug === slug);

    if (blogIndex === -1) {
      return Response.json({ error: 'Blog not found' }, { status: 404 });
    }

    const updatedBlog: IBlogs = {
      ...blogs[blogIndex],
      ...body,
      slug: blogs[blogIndex].slug, // Keep the original slug
      id: blogs[blogIndex].id, // Keep the original id
      createdAt: blogs[blogIndex].createdAt, // Keep the original createdAt
      updatedAt: new Date().toISOString(),
    };

    blogs[blogIndex] = updatedBlog;
    writeBlogs(blogs);

    return Response.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return Response.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const blogs = readBlogs();
    const filteredBlogs = blogs.filter((b) => b.slug !== slug);

    if (filteredBlogs.length === blogs.length) {
      return Response.json({ error: 'Blog not found' }, { status: 404 });
    }

    writeBlogs(filteredBlogs);

    return Response.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return Response.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
