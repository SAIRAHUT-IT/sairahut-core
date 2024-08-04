import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuestionDto {
  @ApiProperty({
    description: 'The question text',
    example: 'ไปคาราโอเกะ',
  })
  @IsString({ message: 'The question must be a string' })
  question: string;

  @ApiProperty({
    description: 'Indicates if the question is checked',
    example: false,
  })
  @IsBoolean({ message: 'is_checked must be a boolean' })
  is_checked: boolean;
}

// export class BingoPayloadDto {
//   @ApiProperty({
//     type: [[QuestionDto]],
//     description: 'A two-dimensional array of questions',
//   })
//   @IsArray({ message: 'The payload must be an array' })
//   @ValidateNested({ each: true })
//   @Type(() => QuestionDto)
//   payload: QuestionDto[][];
// }

export class BingoPayloadDto {
  @ApiProperty()
  @IsNumber()
  column: number;

  @ApiProperty()
  @IsNumber()
  row: number;

  @ApiProperty()
  @IsString()
  key: string;
}

export interface PrizeObject {
  [key: number]: string[];
}

export class PatchTicketDto {
  @ApiProperty()
  @IsNumber()
  ticket_id: number;
}
