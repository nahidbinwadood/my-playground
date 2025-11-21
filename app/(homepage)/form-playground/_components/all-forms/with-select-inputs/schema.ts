import z from 'zod';

export const selectInputFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(20, 'Name cannot exceed 20 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(30, 'Email cannot exceed 30 characters')
    .regex(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
      'Please enter a valid email address'
    ),
  accountType: z.string().min(1, 'Account type is required'),
});

export type SelectInputFormValues = z.infer<typeof selectInputFormSchema>;
