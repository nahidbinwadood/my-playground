'use server';

import { CACHE_TAGS } from '@/lib/cache-tags';
import { getToken } from '@/lib/getToken';
import { IBlog } from '@/types';
import { updateTag } from 'next/cache';

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
    updateTag(CACHE_TAGS.blogs);
    return data;
  } catch (error) {
    throw error;
  }
};

// get all blogs action==>
//
// Cached and tagged 'blogs'. Next's fetch default is no-store, so without the
// explicit force-cache every page navigation re-hit the API — which is what made
// the admin tables flash a skeleton on each visit. The tag is the escape hatch:
// any write below expires it and the next reader gets fresh data.
//
// The cache key includes the Authorization header, so the draft-carrying
// /blogs/all responses can never be served to a signed-out visitor.
//
// Public pages get published blogs only (the backend filters drafts out).
// Admin surfaces pass includeDrafts: true, which hits the admin-only /blogs/all
// endpoint so their tables and pickers still show unpublished entries.
export const getAllBlogs = async ({
  includeDrafts = false,
}: {
  includeDrafts?: boolean;
} = {}) => {
  try {
    const url = includeDrafts
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/all`
      : `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs`;

    const headers: HeadersInit = { 'Content-Type': 'application/json' };

    if (includeDrafts) {
      const accessToken = (await getToken()).accessToken;
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
      cache: 'force-cache',
      next: {
        tags: [CACHE_TAGS.blogs],
      },
    });

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
    updateTag(CACHE_TAGS.blogs);
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
    updateTag(CACHE_TAGS.blogs);
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
    updateTag(CACHE_TAGS.blogs);
    return data;
  } catch (error) {
    throw error;
  }
};

// get single blog — one entry per post, under the same 'blogs' tag so editing or
// deleting a post also drops its detail page
export const singleBlogAction = async (id: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'force-cache',
        next: {
          tags: [CACHE_TAGS.blogs],
        },
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
