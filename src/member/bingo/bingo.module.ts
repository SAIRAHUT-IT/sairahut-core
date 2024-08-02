import { Module } from '@nestjs/common';
import { BingoService } from './bingo.service';
import { BingoController } from './bingo.controller';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [],
  controllers: [BingoController],
  providers: [BingoService],
})
export class BingoModule {}
