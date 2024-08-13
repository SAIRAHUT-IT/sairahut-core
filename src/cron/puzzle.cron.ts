import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ValidateMemberDto } from 'src/dtos/auth/auth.dto';
import { PrismaService } from 'src/libs/prisma';

@Injectable()
export class PuzzleCron {
  private readonly logger = new Logger(PuzzleCron.name);
  constructor(private prismaService: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async resetPuzzle() {
    try {
      await this.prismaService.member.updateMany({
        where: {
          role: 'FRESHY',
        },
        data: {
          puzzle_count: 0,
        },
      });
      this.logger.log('Reset puzzle count');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
