import { Module } from '@nestjs/common';
import { BingoService } from './bingo.service';
import { BingoController } from './bingo.controller';
import { PrismaService } from 'src/libs/prisma';
import { RolesGuard } from 'src/libs/auth/role.guard';
import { JwtStrategy } from 'src/libs/auth/jwt.strategy';

@Module({
  imports: [],
  controllers: [BingoController],
  providers: [BingoService, PrismaService, JwtStrategy, RolesGuard],
})
export class BingoModule {}
