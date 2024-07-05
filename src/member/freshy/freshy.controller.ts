import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FreshyService } from './freshy.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('FRESHY')
@Controller('freshy')
export class FreshyController {
  constructor(
    private readonly freshyService: FreshyService,
  ) {}

  @Get()
  getFreshies() {
    return this.freshyService.getFreshies();
  }
}
