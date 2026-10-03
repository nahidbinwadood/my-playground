'use server';

import { CACHE_TAGS } from '@/lib/cache-tags';
import { getCacheFetchOptions } from '@/lib/cache-fetch';
import { getToken } from '@/lib/getToken';
import { INote, INoteInput } from '@/types';
import { updateTag } from 'next/cache';

// Built per call so the env var is read at request time, matching blog.action.ts.
const notesUrl = (path = '') =>
  `${process.env.NEXT_PUBLIC_SERVER_URL}/notes${path}`;

type TApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

// Every note endpoint returns the same envelope; unwrap it in one place.
// The backend flattens Zod and Mongo errors into `message`, so surfacing that
// verbatim is the most useful thing to throw.
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

// create note ==>
export const createNoteAction = async (payload: INoteInput) => {
  const response = await fetch(notesUrl('/create'), {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parse<INote>(response);
  updateTag(CACHE_TAGS.notes);
  return data;
};

// get all notes — the tracker's data source ==>
// `includeContent: false` keeps list and timeline views light, since note bodies
// can be long and only the detail view needs them.
//
// Cached under 'notes' like every other read below: the dashboard, the notes
// index and the logging page all call this, and each of them was paying a fresh
// round trip before. Any note write expires the tag for all three.
export const getAllNotes = async ({
  includeContent = true,
}: {
  includeContent?: boolean;
} = {}) => {
  const query = includeContent ? '' : '?includeContent=false';

  const response = await fetch(notesUrl(query), {
    method: 'GET',
    headers: await authHeaders(),
    cache: 'force-cache',
    next: { tags: [CACHE_TAGS.notes] },
  });

  return parse<INote[]>(response);
};

// completed notes — the one public read, and what the homepage renders ==>
//
// Deliberately sends NO Authorization header: this is the signed-out path, and
// the backend only returns status: 'COMPLETE' here. Cached under the notes tag
// with 1-hour ISR. Hard reload (no-cache) bypasses the cache to fetch directly from API.
export const getCompleteNotes = async () => {
  const cacheOptions = await getCacheFetchOptions({
    tag: CACHE_TAGS.notes,
    revalidateSeconds: 3600,
  });

  const response = await fetch(notesUrl('/complete'), {
    method: 'GET',
    ...cacheOptions,
  });

  return parse<INote[]>(response);
};

// get the notes attached to one blog ==>
export const getNotesByBlog = async (blogId: string) => {
  const cacheOptions = await getCacheFetchOptions({
    tag: CACHE_TAGS.notes,
    revalidateSeconds: 3600,
    extraHeaders: await authHeaders(),
  });

  const response = await fetch(notesUrl(`/blog/${blogId}`), {
    method: 'GET',
    ...cacheOptions,
  });

  return parse<INote[]>(response);
};

// get a single note ==>
export const getNoteById = async (id: string) => {
  const cacheOptions = await getCacheFetchOptions({
    tag: CACHE_TAGS.notes,
    revalidateSeconds: 3600,
    extraHeaders: await authHeaders(),
  });

  const response = await fetch(notesUrl(`/${id}`), {
    method: 'GET',
    ...cacheOptions,
  });

  return parse<INote>(response);
};

// update note — only the submitted fields are sent ==>
export const updateNoteAction = async (
  id: string,
  payload: Partial<INoteInput>
) => {
  const response = await fetch(notesUrl(`/${id}`), {
    method: 'PATCH',
    headers: await authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await parse<INote>(response);
  updateTag(CACHE_TAGS.notes);
  return data;
};

// delete note ==>
export const deleteNoteAction = async (id: string) => {
  const response = await fetch(notesUrl(`/${id}`), {
    method: 'DELETE',
    headers: await authHeaders(),
  });

  const data = await parse<never>(response);
  updateTag(CACHE_TAGS.notes);
  return data;
};
