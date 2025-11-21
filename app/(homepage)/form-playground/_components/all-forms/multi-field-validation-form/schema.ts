import z from 'zod';

export const multiFieldValidationFormSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .regex(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
        'Please enter a valid email address'
      )
      .max(70, 'Email cannot be more than 70 characters'),
    confirmEmail: z
      .string()
      .min(1, 'Confirm email is required')
      .max(70, 'Confirm cannot be more than 70 characters')
      .transform((val) => val.trim()),
  })
  .superRefine((data, ctx) => {
    if (data.email !== data.confirmEmail) {
      ctx.addIssue({
        path: ['confirmEmail'],
        code: 'custom',
        message: 'Email do not match',
      });
    }
  });

export type MultiFieldValidationFormValues = z.infer<
  typeof multiFieldValidationFormSchema
>;
