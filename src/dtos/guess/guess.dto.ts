import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GuessPayloadDto {
  @ApiProperty()
  @IsString()
  guess: string;
}

export class GuessHopQuery {
  @ApiProperty()
  @IsString()
  v: string;
}
