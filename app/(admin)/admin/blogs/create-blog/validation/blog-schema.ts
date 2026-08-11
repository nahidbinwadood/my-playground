import z from 'zod';

export const blogSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  // New upload = File, existing image in edit mode = URL string.
  coverImage: z.union([
    z.instanceof(File, { message: 'Cover Image is required' }),
    z.string().min(1, 'Cover Image is required'),
  ]),
  status: z.enum(['DRAFT', 'PUBLISHED'], `Status must be DRAFT or PUBLISHED`),
  type: z.enum(
    ['FRONTEND', 'BACKEND', 'JAVASCRIPT'],
    `type must be FRONTEND, BACKEND or JAVASCRIPT`
  ),
  author: z.string().optional(),
});

export type BlogFormValues = z.infer<typeof blogSchema>;
