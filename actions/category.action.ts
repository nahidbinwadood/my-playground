'use server';

import { getToken } from '@/lib/getToken';
import { ICategory } from '@/types';
import { revalidateTag } from 'next/cache';

const categoriesUrl = (path = '') =>
  `${process.env.NEXT_PUBLIC_SERVER_URL}/categories${path}`;

type TApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

const parse = async <T>(response: Response): Promise<TApiResponse<T>> => {
  const data = (await response.json()) as TApiResponse<T>;

  if (!data.success) {
    throw new Error(data.message);
  }

  return data;
};

const authHeaders = async () => {
  const accessToken = (await getToken()).accessToken;

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
};

// get all categories — PUBLIC, matching the route
//
// No Authorization header on purpose: this action is called by signed out
// visitors on /blogs and /blogs/[slug], and the endpoint is deliberately
// unguarded, so there is nothing for a token to prove here.
export const getAllCategoriesAction = async () => {
  const response = await fetch(categoriesUrl(), {
    method: 'GET',
    next: { tags: ['categories'] },
  });

  return parse<ICategory[]>(response);
};

// create category — admin only
export const createCategoryAction = async (payload: {
  name: string;
  description?: string;
  tone?: string;
}) => {
  const response = await fetch(categoriesUrl('/create'), {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parse<ICategory>(response);
  revalidateTag('categories', 'max');
  return data;
};

// update category — admin only
export const updateCategoryAction = async (
  id: string,
  payload: { name?: string; description?: string; tone?: string }
) => {
  const response = await fetch(categoriesUrl(`/${id}`), {
    method: 'PATCH',
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parse<ICategory>(response);
  revalidateTag('categories', 'max');
  return data;
};

// delete category — admin only. The API refuses while blogs or notes still
// reference it, so the thrown message is the useful part of a failure here.
export const deleteCategoryAction = async (id: string) => {
  const response = await fetch(categoriesUrl(`/${id}`), {
    method: 'DELETE',
    headers: await authHeaders(),
  });

  const data = await parse<never>(response);
  revalidateTag('categories', 'max');
  return data;
};
