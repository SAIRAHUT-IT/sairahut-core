// import { z } from 'zod';

import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

// export const thisthatSchema = z.array(z.string());

// export type ThisOrThatDto = z.infer<typeof thisthatSchema>;

export class ThisOrThatDto {
  @ApiProperty()
  @IsArray({ message: 'Need Array' })
  payload: string[];
}
