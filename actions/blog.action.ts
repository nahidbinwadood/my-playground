'use server';

import { apiFetch, apiFetchOrNull } from '@/lib/api';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { IBlog } from '@/types';
import { updateTag } from 'next/cache';

// Reads are cached under the 'blogs' tag with 1h ISR; every write below
// expires it, so the next reader gets fresh data.
const blogsCache = { tag: CACHE_TAGS.blogs, revalidateSeconds: 3600 };

// create blog action==>
// Multipart: payload is FormData (fields + cover photo file); apiFetch leaves
// Content-Type unset so fetch writes the multipart boundary itself.
export const createBlogAction = async (payload: FormData) => {
  const data = await apiFetch<IBlog>('/blogs/create', {
    method: 'POST',
    body: payload,
    auth: true,
  });
  updateTag(CACHE_TAGS.blogs);
  return data;
};

// get all blogs action==>
//
// Explicitly cached: Next's fetch default is no-store, and without the cache
// every page navigation re-hit the API, which is what made the admin tables
// flash a skeleton on each visit.
//
// Public pages get published blogs only (the backend filters drafts out).
// Admin surfaces pass includeDrafts: true, which hits the admin-only /blogs/all
// endpoint with the token, so their tables and pickers still show unpublished
// entries. The token is part of the cache key, so those responses can never be
// served to a signed-out visitor.
export const getAllBlogs = async ({
  includeDrafts = false,
}: {
  includeDrafts?: boolean;
} = {}) =>
  apiFetch<IBlog[]>(includeDrafts ? '/blogs/all' : '/blogs', {
    auth: includeDrafts,
    cache: blogsCache,
  });

// delete blog==>
export const deleteBlog = async (id: string) => {
  const data = await apiFetch<never>(`/blogs/${id}`, {
    method: 'DELETE',
    auth: true,
  });
  updateTag(CACHE_TAGS.blogs);
  return data;
};

// update blog action==>
// Multipart like create. When the cover photo was replaced, the FormData also
// carries deleteImageUrl (the previous cover photo URL) for backend cleanup.
export const updateBlogAction = async (id: string, payload: FormData) => {
  const data = await apiFetch<IBlog>(`/blogs/${id}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
  updateTag(CACHE_TAGS.blogs);
  return data;
};

// toggle blog publish status==>
export const toggleBlogStatus = async (
  id: string,
  status: 'DRAFT' | 'PUBLISHED'
) => {
  const data = await apiFetch<IBlog>(`/blogs/${id}`, {
    method: 'PATCH',
    body: { status },
    auth: true,
  });
  updateTag(CACHE_TAGS.blogs);
  return data;
};

// get single blog: one cache entry per post, under the same 'blogs' tag.
//
// Public pages get published posts only; a draft answers like a missing slug.
// The admin edit page passes includeDrafts: true, which hits the admin-only
// /blogs/all/:slug with the token.
//
// Returns null when the post does not exist (or is a draft on a public read),
// so callers can render a 404 instead of crashing.
export const singleBlogAction = async (
  slug: string,
  { includeDrafts = false }: { includeDrafts?: boolean } = {}
): Promise<{ success: boolean; message: string; data: IBlog } | null> =>
  apiFetchOrNull<IBlog>(`/blogs/${includeDrafts ? 'all/' : ''}${slug}`, {
    auth: includeDrafts,
    cache: blogsCache,
  });
