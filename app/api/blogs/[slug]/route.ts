import { IBlogs } from '@/app/(homepage)/blogs/types';

function readBlogs(): IBlogs[] {
  // Use require for reliable JSON loading in Next.js
  try {
    const blogsData = require('../../../(homepage)/blogs/data/blogs.json');
    return Array.isArray(blogsData) ? blogsData : [];
  } catch (error) {
    console.error('[v0] Error loading blogs:', error);
    return [];
  }
}

function writeBlogs(blogs: IBlogs[]): void {
  // Writing functionality will be handled by updating the main list route
  // This is a placeholder for future database integration
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    console.log('[v0] Fetching blog with slug:', slug);
    const blogs = readBlogs();
    console.log('[v0] Total blogs loaded:', blogs.length);
    console.log('[v0] Available slugs:', blogs.map(b => b.slug));
    const blog = blogs.find((b) => b.slug === slug);

    if (!blog) {
      console.log('[v0] Blog not found for slug:', slug);
      return Response.json({ error: 'Blog not found' }, { status: 404 });
    }

    return Response.json(blog);
  } catch (error) {
    console.error('[v0] Error reading blog:', error);
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
