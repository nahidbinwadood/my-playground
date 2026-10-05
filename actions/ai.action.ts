'use server';

import { ApiError, apiFetch } from '@/lib/api';

export type TRecallCard = { question: string; answer: string };
export type TAuditIssue = { quote: string; why: string };

type TAIResult<T> =
  { success: true; data: T } | { success: false; message: string };

// Returns a result instead of throwing: Next masks thrown server-action errors
// in production, and the backend's message ("AI is not configured…", "The
// model returned an unexpected format") is exactly what the admin needs to see.
// No cache and no updateTag — nothing is stored, every call is fresh work.
const callAI = async <T>(path: string): Promise<TAIResult<T>> => {
  try {
    const res = await apiFetch<T>(path, { method: 'POST', auth: true });
    return { success: true, data: res.data };
  } catch (error) {
    console.error(`AI ${path} error:`, error);
    return {
      success: false,
      message:
        error instanceof ApiError
          ? error.message
          : 'The AI request failed. Please try again.',
    };
  }
};

// note → recall cards ==>
export const generateCardsAction = async (noteId: string) =>
  callAI<{ cards: TRecallCard[] }>(`/ai/notes/${noteId}/cards`);

// note → possible mistakes ==>
export const auditNoteAction = async (noteId: string) =>
  callAI<{ issues: TAuditIssue[] }>(`/ai/notes/${noteId}/audit`);
