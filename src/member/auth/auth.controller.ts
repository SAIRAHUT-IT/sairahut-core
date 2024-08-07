import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CallBackGoogleDto,
  PatchInfoDto,
  PatchNickNameDto,
  ValidateMemberDto,
} from 'src/dtos/auth/auth.dto';
import { MemberValidator } from 'src/libs/decorators/user.decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('@me')
  validateMember(
    @MemberValidator() validateMemberDto: ValidateMemberDto,
  ) {
    return this.authService.validateMember(validateMemberDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('@me/info')
  patchInfo(
    @Body() body: PatchInfoDto,
    @MemberValidator() validateMemberDto: ValidateMemberDto,
  ) {
    return this.authService.patchInfo(body, validateMemberDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('nickname')
  patchNickName(
    @Body() body: PatchNickNameDto,
    @MemberValidator() member: ValidateMemberDto,
  ) {
    return this.authService.patchNickName(body, member);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('hint/unlock')
  unlockHint(@MemberValidator() member: ValidateMemberDto) {
    return this.authService.unlockHint(member);
  }
  @Get('callback')
  googleCallbackLogin(@Query() query: CallBackGoogleDto) {
    return this.authService.googleCallbackLogin(query);
  }

  @Get('signin')
  generateGoogleURL() {
    return this.authService.generateGoogleURL();
  }
}
