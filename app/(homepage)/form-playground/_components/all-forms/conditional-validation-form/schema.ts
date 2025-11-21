import z from 'zod';

export const conditionalValidationFormSchema = z
  .object({
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
      .string()
      .min(1, 'Account type is required')
      .refine((val) => val === 'personal' || val === 'business', {
        message: 'Invalid account type selected',
      }),
    companyName: z
      .string()
      .max(50, 'Company name cannot exceed 50 characters')
      .optional(),

    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // if the account type is business==>
    if (data.accountType == 'business') {
      if (!data.companyName) {
        ctx.addIssue({
          path: ['companyName'],
          code: 'custom',
          message: 'Company Name is required',
        });
      }
    }

    // if the account type is personal==>
    if (data.accountType == 'personal') {
      if (!data.phone) {
        ctx.addIssue({
          path: ['phone'],
          code: 'custom',
          message: 'Phone is required',
        });
      }
    }
  });

export type ConditionalValidationFormValues = z.infer<
  typeof conditionalValidationFormSchema
>;
