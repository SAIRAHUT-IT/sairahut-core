import { z } from 'zod';

export const redeemCodeSchema = z
  .object({
    code: z.string(),
  })
  .required()
  .strict({ message: 'Invalid input' });

export type RedeemCodeDto = z.infer<typeof redeemCodeSchema>;
