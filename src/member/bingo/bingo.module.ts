import { Module } from '@nestjs/common';
import { BingoService } from './bingo.service';
import { BingoController } from './bingo.controller';

@Module({
  controllers: [BingoController],
  providers: [BingoService]
})
export class BingoModule {}
