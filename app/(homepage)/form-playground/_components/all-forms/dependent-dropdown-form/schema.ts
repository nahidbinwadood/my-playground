import z from 'zod';

export const dependentDropDownFormSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  city: z.string().min(1, 'City is required'),
});

export type DependentDropdownFormValues = z.infer<
  typeof dependentDropDownFormSchema
>;
