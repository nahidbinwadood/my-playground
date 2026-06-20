import z from 'zod';

const rateSchema = z.object({
  spendFrom: z
    .number('Spend From is required')
    .min(0, 'Must be 0 or greater')
    .optional(),
  points: z
    .number('Points is required')
    .min(0, 'Must be 0 or greater')
    .optional(),
});

export const tieredRateSchema = z
  .object({
    rates: z.array(rateSchema).min(1).max(4, 'Maximum 4 tiers allowed'),
  })
  .superRefine((data, ctx) => {
    const rates = data.rates;

    rates.forEach((rate, index) => {
      const previousItem = rates[index - 1];

      if (rate.spendFrom == null || rate.spendFrom == undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['rates', index, 'spendFrom'],
          message: 'Spend from is required',
        });
      }
      if (rate.points == null || rate.points == undefined) {
        ctx.addIssue({
          code: 'custom',
          path: ['rates', index, 'points'],
          message: 'Points is required',
        });
      }

      if (index === 0) return;
      // check if the spend from and points are greater than previous one==>
      if (previousItem) {
        if (
          (rate.spendFrom != null || rate.spendFrom !== undefined) &&
          (previousItem.spendFrom != null ||
            previousItem.spendFrom !== undefined) &&
          rate.spendFrom <= previousItem.spendFrom
        ) {
          ctx.addIssue({
            code: 'custom',
            path: ['rates', index, 'spendFrom'],
            message: `Spend from must be greater than ${previousItem.spendFrom}`,
          });
        }

        if (
          (rate.points != null || rate.points !== undefined) &&
          (previousItem.points != null || previousItem.points !== undefined) &&
          rate.points <= previousItem.points
        ) {
          ctx.addIssue({
            code: 'custom',
            path: ['rates', index, 'points'],
            message: `Points must be greater than ${previousItem.points}`,
          });
        }
      }
    });
  });

export type TieredRateFormValues = z.infer<typeof tieredRateSchema>;
