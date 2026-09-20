import z from 'zod';

// Radix Select cannot use an empty string as an item value, so "not attached to
// any blog" needs a sentinel. The form maps it back to null on submit.
export const STANDALONE = 'standalone';

export const noteSchema = z.object({
  blog: z.string(),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z
    .string()
    .max(200, 'Description cannot exceed 200 characters')
    .optional(),
  type: z.enum(
    ['FRONTEND', 'BACKEND', 'JAVASCRIPT'],
    `type must be FRONTEND, BACKEND or JAVASCRIPT`
  ),
  content: z.string().min(1, 'Content is required'),
});

export type NoteFormValues = z.infer<typeof noteSchema>;
