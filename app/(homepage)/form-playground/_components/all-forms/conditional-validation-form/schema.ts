import z from 'zod';

export const conditionalValidationFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name cannot exceed 80 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(30, 'Email cannot exceed 30 characters')
    .regex(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
      'Please enter a valid email address'
    ),
  accountType: z
    .enum(['personal', 'business'], 'Account type is required')
    .nullable(),
});

export type ConditionalValidationFormValues = z.infer<
  typeof conditionalValidationFormSchema
>;
