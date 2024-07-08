import { Module } from '@nestjs/common';
import { CodeHuntService } from './code-hunt.service';
import { CodeHuntController } from './code-hunt.controller';
import { PrismaService } from 'src/libs/prisma';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [CodeHuntController],
  providers: [CodeHuntService, PrismaService],
})
export class CodeHuntModule {}
