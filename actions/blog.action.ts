'use server';

import { BlogFormValues } from '@/app/(admin)/admin/blogs/create-blog/validation/blog-schema';
import { getToken } from '@/lib/getToken';
import { revalidateTag } from 'next/cache';

// create blog action==>
export const createBlogAction = async (payload: BlogFormValues) => {
  const accessToken = (await getToken()).accessToken;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    // throw error if the response doesn't return success==>
    if (!data.success) {
      throw new Error(data.message);
    }
    revalidateTag('blogs', 'max');
    return data;
  } catch (error) {
    throw error;
  }
};

// get all blogs action==>
export const getAllBlogs = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs `,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        next: {
          tags: ['blogs'],
        },
        cache: 'force-cache',
      }
    );

    const data = await response.json();

    // throw error if the response doesn't return success==>
    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// delete blog==>
export const deleteBlog = async (id: string) => {
  const accessToken = (await getToken()).accessToken;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      }
    );

    const data = await response.json();

    // throw error if the response doesn't return success==>
    if (!data.success) {
      throw new Error(data.message);
    }
    revalidateTag('blogs', 'max');
    return data;
  } catch (error) {
    throw error;
  }
};
