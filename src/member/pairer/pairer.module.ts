import { Module } from '@nestjs/common';
import { PairerService } from './pairer.service';
import { PairerController } from './pairer.controller';
import { FreshyService } from '../freshy/freshy.service';
import { SophomoreService } from '../sophomore/sophomore.service';
import { PrismaService } from 'src/libs/prisma';

@Module({
  controllers: [PairerController],
  providers: [PairerService, PrismaService],
})
export class PairerModule {}
