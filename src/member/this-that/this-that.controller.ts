import { Controller, Body, Patch, UseGuards } from '@nestjs/common';
import { ThisThatService } from './this-that.service';
import { ThisOrThatDto } from 'src/dtos/this-that/this-that.dto';
import { MemberValidator } from 'src/libs/decorators/user.decorators';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('THIS-THAT')
@Controller('this-that')
export class ThisThatController {
  constructor(private readonly thisThatService: ThisThatService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch()
  patchThisOrThat(
    @Body() body: ThisOrThatDto,
    @MemberValidator() member: ValidateMemberDto,
  ) {
    return this.thisThatService.patchThisThat(body, member);
  }
}
