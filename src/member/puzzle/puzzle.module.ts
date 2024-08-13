import { Module } from '@nestjs/common';
import { PuzzleService } from './puzzle.service';
import { PuzzleController } from './puzzle.controller';
import { PrismaService } from 'src/libs/prisma';
import { JwtStrategy } from 'src/libs/auth/jwt.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PuzzleController],
  providers: [PuzzleService, PrismaService, JwtStrategy],
})
export class PuzzleModule {}
