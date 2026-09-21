'use server';

import { getToken } from '@/lib/getToken';
import { IBlog } from '@/types';
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
// Public pages get published blogs only (the backend now filters drafts out).
// Admin surfaces pass includeDrafts: true, which hits the admin-only /blogs/all
// endpoint so their tables and pickers still show unpublished entries.
export const getAllBlogs = async ({
  enableCache = false,
  includeDrafts = false,
}: {
  enableCache?: boolean;
  includeDrafts?: boolean;
}) => {
  try {
    const url = includeDrafts
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/all`
      : `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs`;

    const headers: HeadersInit = { 'Content-Type': 'application/json' };

    if (includeDrafts) {
      const accessToken = (await getToken()).accessToken;
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(
      url,
      {
        method: 'GET',
        headers,
        next: {
          tags: ['blogs'],
        },
        ...(enableCache ? { cache: 'force-cache' } : {}),
      }
    );

    // The backend is expected to reply JSON ({ success, statusCode, … }) but
    // can return plain-text error pages (5xx/gateway). Parse defensively so a
    // non-JSON body surfaces as a readable error instead of a JSON.parse
    // SyntaxError crashing the page render.
    const contentType = response.headers.get('content-type') ?? '';
    let data: ({ data: IBlog[] } & Record<string, unknown>) | null = null;

    if (contentType.toLowerCase().includes('application/json')) {
      data = await response.json();
    }

    // throw error if the response doesn't return success==>
    if (!data?.success) {
      const fallback = `Blogs API ${response.status} ${response.statusText}: expected a JSON response`;
      throw new Error(
        typeof data?.message === 'string' ? data.message : fallback
      );
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

// toggle blog publish status==>
export const toggleBlogStatus = async (id: string, status: 'DRAFT' | 'PUBLISHED') => {
  const accessToken = (await getToken()).accessToken;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

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
