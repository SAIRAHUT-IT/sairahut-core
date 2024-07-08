import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CodeHuntService } from './code-hunt.service';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ZodValidationPipe } from 'src/libs/zod-validation.pipe';
import {
  RedeemCodeDto,
  redeemCodeSchema,
} from 'src/dtos/code-hunt-dto/redeem.dto';

@ApiTags('Code Hunt')
@Controller('code-hunt')
@UseGuards(ThrottlerGuard)
export class CodeHuntController {
  constructor(private readonly codeHuntService: CodeHuntService) {}

  @Get('generate')
  generateCode() {
    return this.codeHuntService.generateCode();
  }

  @UsePipes(new ZodValidationPipe(redeemCodeSchema))
  @Post('redeem')
  redeemCode(@Body() body: RedeemCodeDto) {
    return this.codeHuntService.redeemCode(body);
  }
}
