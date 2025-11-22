import z from 'zod';

export const crossFieldValidationSchema = z
  .object({
    startDate: z.date({ message: 'Start date is required' }),
    endDate: z.date({ message: 'End date is required' }),
  })
  .superRefine((data, ctx) => {
    if (data.endDate <= data.startDate) {
      ctx.addIssue({
        path: ['endDate'],
        code: 'custom',
        message: 'End date cannot be before start date',
      });
    }
  });

export type CrossFieldValidationFormValues = z.infer<
  typeof crossFieldValidationSchema
>;
