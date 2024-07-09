import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CallBackGoogleDto,
  ValidateMemberDto,
} from 'src/dtos/auth/auth.dto';
import { MemberValidator } from 'src/libs/decorators/user.decorators';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';

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

  @Get('callback')
  googleCallbackLogin(@Query() query: CallBackGoogleDto) {
    console.log(query);
    return this.authService.googleCallbackLogin(query);
  }

  @Get('signin')
  generateGoogleURL() {
    return this.authService.generateGoogleURL();
  }
}
