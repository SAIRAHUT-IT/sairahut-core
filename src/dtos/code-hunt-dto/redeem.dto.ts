// import { z } from 'zod';

import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

// export const redeemCodeSchema = z
//   .object({
//     code: z.string(),
//   })
//   .required()
//   .strict({ message: 'Invalid input' });

// export type RedeemCodeDto = z.infer<typeof redeemCodeSchema>;

export class RedeemCodeDto {
  @ApiProperty({ required: true })
  @IsString()
  code: string;
}
