import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { BingoService } from './bingo.service';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MemberValidator } from 'src/libs/decorators/user.decorators';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
import {
  BingoPayloadDto,
  PatchTicketDto,
} from 'src/dtos/bingo/bingo.dto';
import { RolesGuard } from 'src/libs/auth/role.guard';
import { Role } from 'src/libs/decorators/role.decorators';
import { MemberRole } from '@prisma/client';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Role(MemberRole.FRESHY)
@ApiTags('BINGO')
@Controller('bingo')
export class BingoController {
  constructor(private readonly bingoService: BingoService) {}

  @Patch('unlock')
  validateBingoPayload(
    @Body() payload: BingoPayloadDto,
    @MemberValidator() member: ValidateMemberDto,
  ) {
    return this.bingoService.unlockBingoSlot(payload, member);
  }

  @Post('submit')
  submit(@MemberValidator() member: ValidateMemberDto) {
    return this.bingoService.submitBingo(member);
  }

  @Patch('redeem')
  redeemTicket(
    @Body() body: PatchTicketDto,
    @MemberValidator() member: ValidateMemberDto,
  ) {
    return this.bingoService.redeemTicket(body, member);
  }
}
