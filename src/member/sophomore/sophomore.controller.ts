import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SophomoreService } from './sophomore.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';

@ApiTags('SOPHOMORE')
@Controller('sophomore')
export class SophomoreController {
  constructor(private readonly sophomoreService: SophomoreService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getSophomores() {
    return this.sophomoreService.getSophomore();
  }
}
