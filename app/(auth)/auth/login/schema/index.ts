import z from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .max(80, 'Email cannot exceed 80 characters')
    .regex(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
      'Please enter a valid email address'
    ),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(50, 'Password cannot exceed 50 characters')
    .regex(/[A-Z]/, 'Password should contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password should container at least one lowercase letter')
    .regex(/[0-9]/, 'Password should container at least one number')
    .regex(
      /[!@#%$*^(),.?":P{}]/,
      'Password should container at least one special character'
    ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
