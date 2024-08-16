import { Module } from '@nestjs/common';
import { GuessService } from './guess.service';
import { GuessController } from './guess.controller';
import { PrismaService } from 'src/libs/prisma';
import { JwtStrategy } from 'src/libs/auth/jwt.strategy';
import { RolesGuard } from 'src/libs/auth/role.guard';

@Module({
  controllers: [GuessController],
  providers: [GuessService, PrismaService, JwtStrategy, RolesGuard],
  exports: [GuessService],
})
export class GuessModule {}
