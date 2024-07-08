import { Controller, Get, Delete } from '@nestjs/common';
import { PairerService } from './pairer.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('PAIRER')
@Controller('pairer')
export class PairerController {
  constructor(private readonly pairerService: PairerService) {}

  @Get()
  getPaired() {
    return this.pairerService.pairer();
  }

  @Delete()
  unpairer() {
    return this.pairerService.unpairer();
  }
}
