import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CodeHuntService } from './code-hunt.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ZodValidationPipe } from 'src/libs/zod-validation.pipe';
import {
  RedeemCodeDto,
  redeemCodeSchema,
} from 'src/dtos/code-hunt-dto/redeem.dto';
import { RolesGuard } from 'src/libs/auth/role.guard';
import { Role } from 'src/libs/decorators/role.decorators';
import { MemberRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { MemberValidator } from 'src/libs/decorators/user.decorators';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';

@ApiBearerAuth()
@ApiTags('Code Hunt')
@Controller('code-hunt')
@UseGuards(ThrottlerGuard)
export class CodeHuntController {
  constructor(private readonly codeHuntService: CodeHuntService) {}

  @Role(MemberRole.SOPHOMORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('generate')
  generateCode(@MemberValidator() member: ValidateMemberDto) {
    return this.codeHuntService.generateCode(member);
  }

  @Post('redeem')
  @UsePipes(new ZodValidationPipe(redeemCodeSchema))
  redeemCode(
    @Body() body: RedeemCodeDto,
    @MemberValidator() member: ValidateMemberDto,
  ) {
    return this.codeHuntService.redeemCode(body, member);
  }
}
