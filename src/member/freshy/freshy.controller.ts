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
