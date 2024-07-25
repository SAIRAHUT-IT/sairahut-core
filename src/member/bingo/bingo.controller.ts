import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { BingoService } from './bingo.service';
import {
  BingoPayloadDto,
  bingoPayloadSchema,
} from 'src/dtos/bingo/bingo.dto';
import { ZodValidationPipe } from 'src/libs/zod-validation.pipe';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('BINGO')
@Controller('bingo')
export class BingoController {
  constructor(private readonly bingoService: BingoService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ZodValidationPipe(bingoPayloadSchema))
  @Post()
  validateBingoPayload(@Body() payload: BingoPayloadDto) {
    return this.bingoService.validateBingoPayload(payload);
  }
}
