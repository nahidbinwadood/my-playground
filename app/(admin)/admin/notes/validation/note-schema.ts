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
  // An ICategory id. '' is the select's "nothing chosen yet" state — it has to
  // be representable, because a note can be started before a category is picked,
  // but it must never reach the API, so it is rejected on submit.
  category: z.string().min(1, 'Pick a category for this note'),
  content: z.string().min(1, 'Content is required'),
});

// what the form holds while editing (topic may still be unset)
export type NoteFormValues = z.input<typeof noteSchema>;
// what validation guarantees on submit (topic is a real topic)
export type NoteSubmitValues = z.output<typeof noteSchema>;
