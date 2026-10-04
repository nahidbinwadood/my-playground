'use server';

import { apiFetch } from '@/lib/api';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { INote, INoteInput } from '@/types';
import { updateTag } from 'next/cache';

// Every note read shares the 'notes' tag (1h ISR); any note write expires it.
const notesCache = { tag: CACHE_TAGS.notes, revalidateSeconds: 3600 };

// create note ==>
export const createNoteAction = async (payload: INoteInput) => {
  const data = await apiFetch<INote>('/notes/create', {
    method: 'POST',
    body: payload,
    auth: true,
  });
  updateTag(CACHE_TAGS.notes);
  return data;
};

// get all notes: the tracker's data source ==>
// `includeContent: false` keeps list and timeline views light, since note bodies
// can be long and only the detail view needs them.
//
// Cached: the dashboard, the notes index and the logging page all call this,
// and each of them was paying a fresh round trip before.
export const getAllNotes = async ({
  includeContent = true,
}: {
  includeContent?: boolean;
} = {}) =>
  apiFetch<INote[]>(`/notes${includeContent ? '' : '?includeContent=false'}`, {
    auth: true,
    cache: notesCache,
  });

// completed notes: the one public read, and what the homepage renders ==>
//
// Deliberately sends NO token: this is the signed-out path, and the backend
// only returns status: 'COMPLETE' here.
export const getCompleteNotes = async () =>
  apiFetch<INote[]>('/notes/complete', { cache: notesCache });

// get the notes attached to one blog ==>
export const getNotesByBlog = async (blogId: string) =>
  apiFetch<INote[]>(`/notes/blog/${blogId}`, {
    auth: true,
    cache: notesCache,
  });

// get a single note ==>
export const getNoteById = async (id: string) =>
  apiFetch<INote>(`/notes/${id}`, { auth: true, cache: notesCache });

// update note: only the submitted fields are sent ==>
export const updateNoteAction = async (
  id: string,
  payload: Partial<INoteInput>
) => {
  const data = await apiFetch<INote>(`/notes/${id}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
  updateTag(CACHE_TAGS.notes);
  return data;
};

// delete note ==>
export const deleteNoteAction = async (id: string) => {
  const data = await apiFetch<never>(`/notes/${id}`, {
    method: 'DELETE',
    auth: true,
  });
  updateTag(CACHE_TAGS.notes);
  return data;
};
