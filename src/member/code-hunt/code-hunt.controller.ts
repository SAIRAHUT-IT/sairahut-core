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
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { ZodValidationPipe } from 'src/libs/zod-validation.pipe';
import { RedeemCodeDto } from 'src/dtos/code-hunt-dto/redeem.dto';
import { RolesGuard } from 'src/libs/auth/role.guard';
import { Role } from 'src/libs/decorators/role.decorators';
import { MemberRole } from '@prisma/client';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { MemberValidator } from 'src/libs/decorators/user.decorators';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';

@ApiBearerAuth()
@ApiTags('Code Hunt')
@Controller('code-hunt')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CodeHuntController {
  constructor(private readonly codeHuntService: CodeHuntService) {}

  @Role(MemberRole.SOPHOMORE, MemberRole.SENIOR)
  @Get('generate')
  generateCode(@MemberValidator() member: ValidateMemberDto) {
    return this.codeHuntService.generateCode(member);
  }

  @Role(MemberRole.FRESHY)
  // @UseGuards(ThrottlerGuard)
  @Post('redeem')
  redeemCode(
    @Body() body: RedeemCodeDto,
    @MemberValidator() member: ValidateMemberDto,
  ) {
    return this.codeHuntService.redeemCode(body, member);
  }

  @Get('leaderboard')
  leaderboard(@MemberValidator() member: ValidateMemberDto) {
    return this.codeHuntService.leaderboard(member);
  }
}
