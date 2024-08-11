import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class PatchPuzzle {
  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(6)
  code: string;
}
