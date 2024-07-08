import { Module } from '@nestjs/common';
import { SophomoreService } from './sophomore.service';
import { SophomoreController } from './sophomore.controller';
import { PrismaService } from 'src/libs/prisma';

@Module({
  controllers: [SophomoreController],
  providers: [SophomoreService, PrismaService],
})
export class SophomoreModule {}
