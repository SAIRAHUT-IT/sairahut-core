import { ApiProperty } from '@nestjs/swagger';
import { MemberRole } from '@prisma/client';
import {
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { z } from 'zod';

export const callbackGoogleDto = z
  .object({
    code: z.string(),
    scope: z.string(),
    authuser: z.string(),
    prompt: z.string(),
  })
  .required()
  .strict({ message: 'Invalid input' });

export type CallBackGoogleDto = z.infer<typeof callbackGoogleDto>;

// export const validateMemberDto = z
//   .object({
//     id: z.number(),
//     username: z.string(),
//     role: z.string(),
//   })
//   .required()
//   .strict({ message: 'Invalid input' });
// export type ValidateMemberDto = z.infer<typeof validateMemberDto>;

export class ValidateMemberDto {
  id: number;
  username: string;
  role: MemberRole;
}

export class PatchNickNameDto {
  @ApiProperty()
  @IsString()
  @MinLength(3, { message: 'nickname must be at least 3 characters' })
  @MaxLength(10, {
    message: 'nickname must not be more than 10 characters',
  })
  nickname: string;
}
