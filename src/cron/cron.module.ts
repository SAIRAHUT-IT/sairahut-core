import { Module } from '@nestjs/common';
import { PuzzleCron } from './puzzle.cron';
import { PrismaService } from 'src/libs/prisma';

@Module({
  imports: [],
  controllers: [],
  providers: [PuzzleCron, PrismaService],
})
export class CronModule {}
