import { z } from 'zod';

export const bingoPayloadSchema = z.array(
  z.array(
    z
      .object({
        // id: z.number(),
        is_checked: z.boolean(),
      })
      .required()
      .strict({ message: 'Invalid input' }),
  ),
);

export type BingoPayloadDto = z.infer<typeof bingoPayloadSchema>;

// export class BingoPayloadDto {}
