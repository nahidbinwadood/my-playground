import z from 'zod';

export const basicValidationSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(20, 'Name cannot more than 20 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(30, 'Email cannot be more than 30 characters')
    .regex(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
      'Please enter a valid email address'
    ),
  password: z
    .string()
    .min(8, 'Password is must be at least 8 characters long')
    .max(50, 'Password cannot be more than 50 characters')
    .regex(/[A-Z]/, 'Password should contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password should contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password should contain at least one number ')
    .regex(
      /[!@#%$*^(),.?":P{}|<>]/,
      'Password should contain at least one special character'
    ),
});

export type BasicValidationFormValues = z.infer<typeof basicValidationSchema>;
