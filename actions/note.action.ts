'use server';

import { getToken } from '@/lib/getToken';
import { INote, INoteInput } from '@/types';
import { revalidateTag } from 'next/cache';

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
  revalidateTag('notes', 'max');
  return data;
};

// get all notes — the tracker's data source ==>
// `includeContent: false` keeps list and timeline views light, since note bodies
// can be long and only the detail view needs them.
export const getAllNotes = async ({
  includeContent = true,
  enableCache = false,
}: {
  includeContent?: boolean;
  enableCache?: boolean;
} = {}) => {
  const query = includeContent ? '' : '?includeContent=false';

  const response = await fetch(notesUrl(query), {
    method: 'GET',
    headers: await authHeaders(),
    next: { tags: ['notes'] },
    ...(enableCache ? { cache: 'force-cache' } : {}),
  });

  return parse<INote[]>(response);
};

// get the notes attached to one blog ==>
export const getNotesByBlog = async (blogId: string) => {
  const response = await fetch(notesUrl(`/blog/${blogId}`), {
    method: 'GET',
    headers: await authHeaders(),
    next: { tags: ['notes'] },
  });

  return parse<INote[]>(response);
};

// get a single note ==>
export const getNoteById = async (id: string) => {
  const response = await fetch(notesUrl(`/${id}`), {
    method: 'GET',
    headers: await authHeaders(),
    next: { tags: ['notes'] },
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
  revalidateTag('notes', 'max');
  return data;
};

// delete note ==>
export const deleteNoteAction = async (id: string) => {
  const response = await fetch(notesUrl(`/${id}`), {
    method: 'DELETE',
    headers: await authHeaders(),
  });

  const data = await parse<never>(response);
  revalidateTag('notes', 'max');
  return data;
};
