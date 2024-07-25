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
import { FreshyService } from './freshy.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/auth/jwt-auth.guard';

@ApiTags('FRESHY')
@Controller('freshy')
export class FreshyController {
  constructor(private readonly freshyService: FreshyService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getFreshies() {
    return this.freshyService.getFreshies();
  }
}
