import z from 'zod';

export const dynamicFieldsFormSchema = z.object({
  address: z
    .array(
      z.object({
        street: z
          .string()
          .min(1, 'Street is required')
          .max(50, 'Street cannot exceed 50 characters'),
        city: z
          .string()
          .min(1, 'City is required')
          .max(50, 'City cannot exceed 50 characters'),
        state: z
          .string()
          .min(1, 'State is required')
          .max(50, 'State cannot exceed 50 characters'),
        zipCode: z
          .number({ message: 'Zip code is required' })
          .gt(1000, { message: 'Zip code must be at least 4 digits' })
          .lt(99999, { message: 'Zip code cannot be more than 5 digits' }),
      })
    )
    .max(5, 'Address cannot be more than 5'),
});

export type DynamicFieldsFormValues = z.infer<typeof dynamicFieldsFormSchema>;
