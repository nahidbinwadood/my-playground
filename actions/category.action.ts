'use server';

import { apiFetch } from '@/lib/api';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { ICategory } from '@/types';
import { updateTag } from 'next/cache';

// get all categories: PUBLIC, matching the route
//
// No token on purpose: this action is called by signed out visitors on /blogs
// and /blogs/[slug], and the endpoint is deliberately unguarded, so there is
// nothing for a token to prove here.
//
// Cached under the 'categories' tag with 1h ISR.
export const getAllCategoriesAction = async () =>
  apiFetch<ICategory[]>('/categories', {
    cache: { tag: CACHE_TAGS.categories, revalidateSeconds: 3600 },
  });

// create category: admin only
export const createCategoryAction = async (payload: {
  name: string;
  description?: string;
  tone?: string;
}) => {
  const data = await apiFetch<ICategory>('/categories/create', {
    method: 'POST',
    body: payload,
    auth: true,
  });
  updateTag(CACHE_TAGS.categories);
  return data;
};

// update category: admin only
export const updateCategoryAction = async (
  id: string,
  payload: { name?: string; description?: string; tone?: string }
) => {
  const data = await apiFetch<ICategory>(`/categories/${id}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
  updateTag(CACHE_TAGS.categories);
  return data;
};

// delete category: admin only. The API refuses while blogs or notes still
// reference it, so the thrown message is the useful part of a failure here.
export const deleteCategoryAction = async (id: string) => {
  const data = await apiFetch<never>(`/categories/${id}`, {
    method: 'DELETE',
    auth: true,
  });
  updateTag(CACHE_TAGS.categories);
  return data;
};
