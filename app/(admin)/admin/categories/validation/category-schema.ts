import { CATEGORY_TONES } from '@/lib/categories';
import z from 'zod';

// Same limits as the API's createCategorySchema — the client check is for the
// person typing, not a security boundary.
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(40, 'Name cannot exceed 40 characters'),
  description: z
    .string()
    .max(160, 'Description cannot exceed 160 characters')
    .optional(),
  tone: z.enum(CATEGORY_TONES, `Tone must be ${CATEGORY_TONES.join(', ')}`),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
