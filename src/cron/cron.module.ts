import { Module } from '@nestjs/common';
import { PuzzleCron } from './puzzle.cron';
import { PrismaService } from 'src/libs/prisma';
import { HopCron } from './hop.cron';
import { GuessModule } from 'src/member/guess/guess.module';

@Module({
  imports: [GuessModule],
  controllers: [],
  providers: [PuzzleCron, HopCron, PrismaService],
})
export class CronModule {}
