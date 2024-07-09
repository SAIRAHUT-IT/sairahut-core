import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SophomoreService } from './sophomore.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('SOPHOMORE')
@Controller('sophomore')
export class SophomoreController {
  constructor(private readonly sophomoreService: SophomoreService) {}

  @Get()
  getSophomores() {
    return this.sophomoreService.getSophomore();
  }
}
