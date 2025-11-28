import { isValidPhoneNumber } from 'react-phone-number-input';
import z from 'zod';

export const fieldArrayFormSchema = z.object({
  contacts: z.array(
    z.object({
      name: z
        .string()
        .min(1, 'Name is required')
        .max(50, 'Name cannot exceed 50 characters'),
      email: z
        .string()
        .min(1, 'Email is required')
        .max(30, 'Email cannot exceed 30 characters')
        .regex(
          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
          'Please enter a valid email address'
        ),
      phone: z.array(
        z.object({
          value: z
            .string()
            .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
        })
      ),
    })
  ),
});

export type FieldArrayFormValues = z.infer<typeof fieldArrayFormSchema>;
