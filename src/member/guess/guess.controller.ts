import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GuessService } from './guess.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { RolesGuard } from 'src/libs/auth/role.guard';
import { Role } from 'src/libs/decorators/role.decorators';
import { MemberRole } from '@prisma/client';
import {
  GuessHopQuery,
  GuessPayloadDto,
} from 'src/dtos/guess/guess.dto';
import { MemberValidator } from 'src/libs/decorators/user.decorators';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('guess')
export class GuessController {
  constructor(private readonly guessService: GuessService) {}

  @Post()
  @Role(MemberRole.FRESHY)
  validateSophomore(
    @Body() body: GuessPayloadDto,
    @MemberValidator() member_: ValidateMemberDto,
  ) {
    return this.guessService.validateSophomore(body, member_);
  }

  @Get()
  validateHopper(
    @Query() q: GuessHopQuery,
    @MemberValidator() member_: ValidateMemberDto,
  ) {
    return this.guessService.validateHopper(q, member_);
  }
}
