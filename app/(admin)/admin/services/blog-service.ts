import { IBlogs } from '@/app/(homepage)/blogs/types';

export class BlogService {
  static async getAllBlogs(): Promise<IBlogs[]> {
    const response = await fetch('/api/blogs', {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }

    return response.json();
  }

  static async getBlogBySlug(slug: string): Promise<IBlogs | null> {
    const response = await fetch(`/api/blogs/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  }

  static async createBlog(data: Omit<IBlogs, 'id' | 'createdAt' | 'updatedAt'>): Promise<IBlogs> {
    const response = await fetch('/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create blog');
    }

    return response.json();
  }

  static async updateBlog(
    slug: string,
    data: Partial<Omit<IBlogs, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<IBlogs> {
    const response = await fetch(`/api/blogs/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update blog');
    }

    return response.json();
  }

  static async deleteBlog(slug: string): Promise<void> {
    const response = await fetch(`/api/blogs/${slug}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete blog');
    }
  }
}
