'use server';

import { getToken } from '@/lib/getToken';
import { revalidateTag } from 'next/cache';

// create blog action==>
// Multipart: payload is FormData (fields + cover photo file). No explicit
// Content-Type header — fetch sets the multipart boundary itself.
export const createBlogAction = async (payload: FormData) => {
  const accessToken = (await getToken()).accessToken;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/create`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
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
export const getAllBlogs = async ({
  enableCache = false,
}: {
  enableCache?: boolean;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: {
          tags: ['blogs'],
        },
        ...(enableCache ? { cache: 'force-cache' } : {}),
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

// update blog action==>
// Multipart like create. When the cover photo was replaced, the FormData also
// carries deleteImageUrl (the previous cover photo URL) for backend cleanup.
export const updateBlogAction = async (id: string, payload: FormData) => {
  const accessToken = (await getToken()).accessToken;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: payload,
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

// get single blog==>
export const singleBlogAction = async (id: string, enableCache?: boolean) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        ...(enableCache ? { cache: 'force-cache' } : {}),
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
