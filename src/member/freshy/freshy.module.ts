import { Module } from '@nestjs/common';
import { FreshyService } from './freshy.service';
import { FreshyController } from './freshy.controller';
import { PrismaService } from 'src/libs/prisma';

@Module({
  controllers: [FreshyController],
  providers: [FreshyService, PrismaService],
})
export class FreshyModule {}
